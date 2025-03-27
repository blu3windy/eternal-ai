import { AgentType } from '@pages/home/list-agent/constants';
import { IAgentToken } from '@services/api/agents-token/interface';
import { Content } from 'agent-server-definition';

export type TaskItem = {
   id: string;
   status: 'processing' | 'done' | 'failed';
   message: Content;
   title: string;
   createdAt: string;
   updatedAt?: string;
   agent: IAgentToken;
   agentType?: AgentType;
};

export type AgentChatState = {
   agentTasks: Record<string, TaskItem[]>;
};
