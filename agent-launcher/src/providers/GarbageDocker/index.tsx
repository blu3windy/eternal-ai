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

const TIME_TO_CLEAN = 10 * 60 * 1000;
const INTERVAL_TIME_CHECK = 2 * 60 * 1000;

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
   }, [pendingTasks]);

   const checkInactiveContainers = async (params: ICheckInactiveContainersParams) => {
      const { selectedAgent, activeAgents, containers } = params;

      if (!selectedAgent) return;
      const now = Date.now();
      const timeToClean = TIME_TO_CLEAN;
      console.log('containers', containers);

      const activeModel = await storageModel.getActiveModel();

      const whiteListContainerNames = [
         ...WHITE_LIST_CONTAINER_NAMES,
         activeModel ? getAgentContainerName(activeModel) : '',
      ];

      console.log('LEON checkInactiveContainers: ', { 
         whiteListContainerNames, 
         selectedAgent, 
         activeAgents,
         activeAgentNames: Array.from(activeAgents.values()).map((agent) => agent.agent.agent_name) 
      });

      // Check each active agent's timestamp
      activeAgents.forEach(async (activeAgent) => {
         const isValidTime = new BigNumber(now).minus(activeAgent.timestamp).gt(timeToClean);
         const remandTimeMinutes = new BigNumber(now).minus(activeAgent.timestamp).div(60).toNumber();
         console.log('LEON checkInactiveContainers activeAgent: ', getAgentContainerName(activeAgent.agent), {
            isValidTime, 
            remandTimeMinutes
         });
         if (whiteListContainerNames.includes(getAgentContainerName(activeAgent.agent))) return;
         if (compareString(activeAgent.agent.agent_id, selectedAgent?.agent_id)) return;
         if (pendingTasksRef.current.find(task => compareString(task.agent.agent_id, activeAgent.agent.agent_id))) return;

         // Check if agent hasn't been active for 15 seconds
         if (isValidTime) {
            // Find the container that matches this agent
            const containerName = getAgentContainerName(activeAgent.agent);
            const matchingContainer = containers.find(container => compareString(container.name, containerName));
            console.log(`LEON checkInactiveContainers inactive agent found: ${activeAgent.agent.agent_name}`, { containerName, containers, matchingContainer });
            
            if (matchingContainer) {
               try {
                  await stopAgent(activeAgent.agent);
               } catch (error) {
                  console.error('LEON checkInactiveContainers stopAgent error: ', error);
               }
               removeActiveAgent(activeAgent.agent.agent_id);
            }
         }
      });
   };

   const debounceCheckInactiveContainers = debounce(useCallback((params: ICheckInactiveContainersParams) => {
      checkInactiveContainers(params);
   }, []), 5000);

   // Set up interval to check inactive containers every second
   useEffect(() => {
      if (intervalRef.current) {
         clearInterval(intervalRef.current);
      }
      debounceCheckInactiveContainers({ selectedAgent, activeAgents, containers });
      intervalRef.current = setInterval(() => {
         debounceCheckInactiveContainers({ selectedAgent, activeAgents, containers });
      }, INTERVAL_TIME_CHECK);
      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      }
   }, [containers, selectedAgent, activeAgents]);

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
