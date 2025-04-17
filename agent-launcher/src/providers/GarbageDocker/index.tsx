import { MonitorContext } from '@providers/Monitor/MonitorContext';
import React, { createContext, useContext, useState, PropsWithChildren, useEffect, useRef, useCallback } from 'react';
import useAgentState, { ActiveAgent } from '@pages/home/provider/useAgentState';
import { ContainerData } from '@providers/Monitor/interface';
import { IAgentToken } from '@services/api/agents-token/interface';
import BigNumber from 'bignumber.js';
import storageModel from '@storage/StorageModel';
import { AgentContext } from '@pages/home/provider/AgentContext';
import { compareString } from '@utils/string';
import { debounce, uniqBy } from 'lodash';
import { useSelector } from 'react-redux';
import { agentTasksProcessingSelector } from '@stores/states/agent-chat/selector';
import { TaskItem } from '@stores/states/agent-chat/type';
import { WHITE_LIST_CONTAINER_NAMES } from './constants';
import { getAgentContainerName } from './helpers';

interface IGarbageContext {
   checkInactiveContainers: (params: ICheckInactiveContainersParams) => void;
}

interface ICheckInactiveContainersParams {
   selectedAgent?: IAgentToken;
   activeAgents: Set<ActiveAgent>;
   containers: ContainerData[];
}

const TIME_TO_CLEAN = 10 * 60 * 1000; // 10 minutes
const INTERVAL_TIME_CHECK = 2 * 60 * 1000; // 2 minutes

const GarbageContext = createContext<IGarbageContext | undefined>(undefined);

const GarbageProvider: React.FC<PropsWithChildren> = ({ children }) => {
   const { selectedAgent, activeAgents, removeActiveAgent } = useAgentState();
   const { containers } = useContext(MonitorContext);
   const { stopAgent, getDependAgents } = useContext(AgentContext);
   const pendingTasks = useSelector(agentTasksProcessingSelector);

   const initRef = useRef(false);
   const intervalRef = useRef<NodeJS.Timeout | null>(null);

   const agentStateValueRef = useRef<{
      selectedAgent: IAgentToken | undefined;
      activeAgents: Set<ActiveAgent>;
      containers: ContainerData[];
   }>({
      selectedAgent,
      activeAgents,
      containers: [],
   });

   const pendingTasksRef = useRef<TaskItem[]>(pendingTasks);

   useEffect(() => {
      pendingTasksRef.current = pendingTasks;
   }, [pendingTasks]);

   useEffect(() => {
      agentStateValueRef.current = {
         selectedAgent,
         activeAgents,
         containers,
      };
   }, [selectedAgent, activeAgents, containers]);

   const isContainerInWhiteList = async (containerName: string) => {
      const activeModel = await storageModel.getActiveModel();
      const whiteListContainerNames = [
         ...WHITE_LIST_CONTAINER_NAMES,
         activeModel ? getAgentContainerName(activeModel) : '',
      ];
      return whiteListContainerNames.includes(containerName);
   };

   const shouldSkipAgent = async (activeAgent: ActiveAgent, selectedAgent?: IAgentToken) => {
      const containerName = getAgentContainerName(activeAgent.agent);
      const isInWhiteList = await isContainerInWhiteList(containerName);
      const isSelectedAgent = compareString(activeAgent.agent?.agent_id, selectedAgent?.agent_id);
      const hasPendingTasks = pendingTasksRef.current.find(task => 
         compareString(task.agent?.agent_id, activeAgent.agent?.agent_id) 
         && task.status === 'processing'
      );
      return Boolean(isInWhiteList || isSelectedAgent || hasPendingTasks);
   };

   const checkInactiveContainers = async () => {
      const { selectedAgent, activeAgents, containers } = agentStateValueRef.current;
      console.log('LEON checkInactiveContainers params: ', agentStateValueRef.current);
      if (!selectedAgent) return;

      const now = Date.now();
      console.log('LEON checkInactiveContainers: ', { 
         selectedAgent, 
         activeAgents: Array.from(activeAgents.values()).map((agent) => agent.agent.agent_name) 
      });


      const requestStopAgents: IAgentToken[] = [];
      const runningAgents: IAgentToken[] = [];

      for (const activeAgent of activeAgents) {
         const isSkip = await shouldSkipAgent(activeAgent, selectedAgent);
         if (isSkip) {
            runningAgents.push(activeAgent.agent);
            continue;
         }

         const isValidTime = new BigNumber(now).minus(activeAgent.timestamp).gt(TIME_TO_CLEAN);
         const remandTime = new BigNumber(TIME_TO_CLEAN).minus(new BigNumber(now).minus(activeAgent.timestamp))
         const remandTimeMinutes = new BigNumber(remandTime).div(60000).toNumber() // Ensure remandTimeMinutes is calculated correctly in minutes
         console.log('LEON checkInactiveContainers activeAgent: ', getAgentContainerName(activeAgent.agent), {
            isValidTime, 
            remandTimeMinutes
         });

         if (isValidTime) {
            const containerName = getAgentContainerName(activeAgent.agent);
            const matchingContainer = containers.find(container => 
               compareString(container.name, containerName)
            );
            
            if (matchingContainer) {
               try {
                  requestStopAgents.push(activeAgent.agent);   
                  // await stopAgent(activeAgent.agent);
                  // removeActiveAgent(activeAgent.agent.agent_id);
                  console.log(`LEON checkInactiveContainers stopped agent: ${activeAgent.agent.agent_name}`);
               } catch (error) {
                  console.error('LEON checkInactiveContainers stopAgent error: ', error);
               }
            } else if (remandTimeMinutes < -10) {
               console.log('LEON checkInactiveContainers remove agent: ', getAgentContainerName(activeAgent.agent));
               removeActiveAgent(activeAgent.agent?.agent_id);
            }
         } else {
            runningAgents.push(activeAgent.agent);
         }
      }


      // const dependUnStopAgents = unStopAgents.map(async (agent) => {
      //    const dependAgents = await getDependAgents(agent);
      //    console.log('LEON checkInactiveContainers dependAgents: ', dependAgents);
      //    return dependAgents || [];
      // });


      const tasks = await Promise.all(runningAgents.map(async (agent) => {
         const dependAgents = await getDependAgents(agent);
         return dependAgents || [];
      }));

      const dependRunningAgents: IAgentToken[] = uniqBy(tasks.flat(), 'agent_id');

      const requestStopAgentsFilter = requestStopAgents.filter(agent => {
         const isDepend = dependRunningAgents.some(dependAgent => compareString(dependAgent?.agent_id, agent?.agent_id));
         return !isDepend;
      });

      for (const agent of requestStopAgentsFilter) {
         await stopAgent(agent);
         removeActiveAgent(agent?.agent_id);
      }
   };

   const debounceCheckInactiveContainers = debounce(
      useCallback(() => {
         checkInactiveContainers();
      }, []),
      2000
   );

   const cleanup = () => {
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
         intervalRef.current = null;
      }
   };

   useEffect(() => {
      const params = agentStateValueRef.current;

      if (!initRef.current && params.selectedAgent && params.containers?.length && !intervalRef.current) {
         initRef.current = true;
         debounceCheckInactiveContainers();
         
         intervalRef.current = setInterval(() => {
            debounceCheckInactiveContainers();
         }, INTERVAL_TIME_CHECK);
      }
   }, [containers, selectedAgent, debounceCheckInactiveContainers]);

   // Add cleanup effect for component unmount
   useEffect(() => {
      return () => {
         cleanup();
         initRef.current = false;
      };
   }, []);

   return (
      <GarbageContext.Provider value={{ checkInactiveContainers }}>
         {children}
      </GarbageContext.Provider>
   );
};

const useGarbage = () => {
   const context = useContext(GarbageContext);
   if (!context) {
      throw new Error('useGarbage must be used within a GarbageProvider');
   }
   return context;
};

export { GarbageProvider, useGarbage };
