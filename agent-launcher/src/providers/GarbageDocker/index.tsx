import { MonitorContext } from '@providers/Monitor/MonitorContext';
import React, { createContext, useContext, useState, PropsWithChildren, useEffect, useRef, useCallback } from 'react';
import useAgentState, { ActiveAgent } from '@pages/home/provider/useAgentState';
import { ContainerData } from '@providers/Monitor/interface';
import { IAgentToken } from '@services/api/agents-token/interface';
import BigNumber from 'bignumber.js';
import storageModel from '@storage/StorageModel';
import { AgentContext } from '@pages/home/provider/AgentContext';
import { compareString } from '@utils/string';
import { debounce } from 'lodash';
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
   const { stopAgent } = useContext(AgentContext);
   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const pendingTasks = useSelector(agentTasksProcessingSelector);
   const pendingTasksRef = useRef<TaskItem[]>(pendingTasks);

   useEffect(() => {
      pendingTasksRef.current = pendingTasks;
      console.log('LEON pendingTasksRef.current', pendingTasks);
   }, [pendingTasks]);

   const isContainerInWhiteList = async (containerName: string) => {
      const activeModel = await storageModel.getActiveModel();
      const whiteListContainerNames = [
         ...WHITE_LIST_CONTAINER_NAMES,
         activeModel ? getAgentContainerName(activeModel) : '',
      ];
      return whiteListContainerNames.includes(containerName);
   };

   const shouldSkipAgent = (activeAgent: ActiveAgent, selectedAgent?: IAgentToken) => {
      const containerName = getAgentContainerName(activeAgent.agent);
      const isInWhiteList = isContainerInWhiteList(containerName);
      const isSelectedAgent = compareString(activeAgent.agent.agent_id, selectedAgent?.agent_id);
      const hasPendingTasks = pendingTasksRef.current.find(task => 
         compareString(task.agent.agent_id, activeAgent.agent.agent_id) 
         && task.status === 'processing'
      );
      return isInWhiteList || isSelectedAgent || hasPendingTasks;
   };

   const checkInactiveContainers = async (params: ICheckInactiveContainersParams) => {
      const { selectedAgent, activeAgents, containers } = params;
      if (!selectedAgent) return;

      const now = Date.now();
      console.log('LEON checkInactiveContainers: ', { 
         selectedAgent, 
         activeAgents: Array.from(activeAgents.values()).map((agent) => agent.agent.agent_name) 
      });

      for (const activeAgent of activeAgents) {
         if (await shouldSkipAgent(activeAgent, selectedAgent)) continue;

         const isValidTime = new BigNumber(now).minus(activeAgent.timestamp).gt(TIME_TO_CLEAN);
         const remandTime = new BigNumber(TIME_TO_CLEAN).minus(new BigNumber(now).minus(activeAgent.timestamp))
         console.log('LEON checkInactiveContainers activeAgent: ', getAgentContainerName(activeAgent.agent), {
            isValidTime, 
            remandTimeMinutes: new BigNumber(remandTime).div(60000).toNumber() // Ensure remandTimeMinutes is calculated correctly in minutes
         });

         if (isValidTime) {
            const containerName = getAgentContainerName(activeAgent.agent);
            const matchingContainer = containers.find(container => 
               compareString(container.name, containerName)
            );
            
            if (matchingContainer) {
               try {
                  await stopAgent(activeAgent.agent);
                  removeActiveAgent(activeAgent.agent.agent_id);
                  console.log(`LEON checkInactiveContainers stopped agent: ${activeAgent.agent.agent_name}`);
               } catch (error) {
                  console.error('LEON checkInactiveContainers stopAgent error: ', error);
               }
            }
         }
      }
   };

   const debounceCheckInactiveContainers = debounce(
      useCallback((params: ICheckInactiveContainersParams) => {
         checkInactiveContainers(params);
      }, []),
      5000
   );

   useEffect(() => {
      const cleanup = () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
         }
      };

      cleanup();
      debounceCheckInactiveContainers({ selectedAgent, activeAgents, containers });
      
      intervalRef.current = setInterval(() => {
         debounceCheckInactiveContainers({ selectedAgent, activeAgents, containers });
      }, INTERVAL_TIME_CHECK);

      return cleanup;
   }, [containers, selectedAgent, activeAgents, debounceCheckInactiveContainers]);

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
