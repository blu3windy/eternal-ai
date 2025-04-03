import { AgentInfo, ChatCompletionPayload, ChatCompletionStreamHandler } from "./types.ts";
import { RequestPromptPayload } from 'agent-server-definition'
import { IMAGINE_URL } from "../../../config.ts";
import { THINK_TAG_REGEX } from "@components/CustomMarkdown/constants.ts";
import { parseStreamAIResponse } from "@utils/api.ts";
import { getClientHeaders } from "../http-client.ts";
import CApiClient from "../agents-token/apiClient.ts";
import { IAgentToken } from "../agents-token/interface.ts";

import qs from 'query-string';

// Utility function to handle API responses
const handleStreamResponse = async (
   response: Response,
   streamHandlers: ChatCompletionStreamHandler
): Promise<any> => {
   if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
   }

   const contentType = response.headers.get('content-type');
   
   if (contentType?.includes('text/event-stream')) {
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
         throw new Error('No reader available for stream response');
      }
      return await parseStreamAIResponse(reader, streamHandlers);
   } else if (contentType?.includes('application/json')) {
      // Handle non-streaming response
      const data = await response.json();
      
      // Check if the response has the expected structure
      if (data && data.choices && data.choices[0] && data.choices[0].message) {
         // Standard OpenAI format
         return {
            success: true,
            data,
            isStream: false
         };
      } else if (data && data.data && data.data.choices && data.data.choices[0] && data.data.choices[0].message) {
         // Nested data format
         return {
            success: true,
            data: data.data,
            isStream: false
         };
      } else if (data && typeof data === 'string') {
         // Simple string response
         return {
            success: true,
            data: {
               choices: [{
                  message: {
                     content: data
                  }
               }]
            },
            isStream: false
         };
      } else {
         // Unknown format, try to extract content
         console.warn('Unexpected response format:', data);
         return {
            success: true,
            data: {
               choices: [{
                  message: {
                     content: JSON.stringify(data)
                  }
               }]
            },
            isStream: false
         };
      }
   } else {
      throw new Error(`Unsupported content type: ${contentType}`);
   }
};

const AgentAPI = {
   getAuthenToken: async ({
      signature,
      message,
      address,
   } : {
    signature: string,
    message: string,
    address: string
                         }
   ) : Promise<string> => {
      try {
         const query = qs.stringify({
            signature: signature.startsWith('0x')
               ? signature.replace('0x', '')
               : signature,
            address,
         });

         const res: string = await (new CApiClient()).api.post(
            `${IMAGINE_URL}/api/auth/verify`,
            {
               signature: signature, message: message, address: address
            }
         );

         // const authenCode: string = await this.api.post('auth/verify', {
         //    signature: _signature, message: _message, address: _signer.address
         // });
         // return authenCode;

         return res;
      } catch (e) {
         return '';
      }
   },
   getAgent: async (agentID: string): Promise<AgentInfo | undefined> => {
      // https://imagine-backend.dev.bvm.network/api/agent/671b39e41a57fd90616013e2
      try {
         const res: AgentInfo = await (new CApiClient()).api.get(
            `${IMAGINE_URL}/api/agent/${agentID}`,
         );
         return res;
      } catch (e) {
         return undefined;
      }
   },
   chatAgentModelStreamCompletions: async ({
      payload,
      streamHandlers,
   }: {
      payload: ChatCompletionPayload;
      streamHandlers: ChatCompletionStreamHandler;
   }): Promise<any> => {
      try {
         const headers = await getClientHeaders();
         const messages = payload.messages.map((item) => ({
            ...item,
            content: `${item.content}`.replace(THINK_TAG_REGEX, ''),
         }));
         
         // Try with stream first
         const response = await fetch(`http://localhost:65534/v1/chat/completions`, {
            method: 'POST',
            headers: {
               ...headers,
            },
            body: JSON.stringify({ messages: messages, stream: true, seed: 0 })
         });

         return await handleStreamResponse(response, streamHandlers);
      } catch (error) {
         console.error('Error in chatAgentModelStreamCompletions:', error);
         return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            isStream: false
         };
      }
   },
   chatAgentModel: async ({
      payload,
   }: {
      payload: ChatCompletionPayload;
   }): Promise<any> => {
      const headers = await getClientHeaders();
      const messages = payload.messages.map((item) => ({
         ...item,
         content: `${item.content}`.replace(THINK_TAG_REGEX, ''),
      }));
      const response = await fetch(`http://localhost:65534/v1/chat/completions`, {
         method: 'POST',
         headers: {
            ...headers,
         },
         body: JSON.stringify({ messages: messages })
      });

      if (response.status === 200) {
         return await response.json();
      }

      throw 'API error';
   },
   chatAgentUtility: async ({ id, agent, prvKey, messages }: { id?: string; agent: IAgentToken, prvKey?: string, messages: any[]}): Promise<any> => {
      try {
         const payload = {
            id,
            "messages": messages,
            "privateKey": prvKey,
            "chainId": agent?.network_id as any
         } satisfies RequestPromptPayload;
         const res: AgentInfo = await (new CApiClient()).api.post(
            `http://localhost:33030/${agent?.network_id}-${agent?.agent_name?.toLowerCase()}/prompt`, payload
         );
         console.log('res>>>AgentInfo', res);

         return res;
      } catch (e) {
         throw e;
      }
   },
   chatAgentUtilityStreamCompletions: async ({
      agent,
      payload,
      streamHandlers,
   }: {
      agent: IAgentToken,
      payload: ChatCompletionPayload;
      streamHandlers: ChatCompletionStreamHandler;
   }): Promise<any> => {
      try {
         const headers = await getClientHeaders();
         const messages = payload.messages.map((item) => ({
            ...item,
            content: `${item.content}`.replace(THINK_TAG_REGEX, ''),
         }));
         
         // Try with stream first
         const response = await fetch(`http://localhost:33030/${agent?.network_id}-${agent?.agent_name?.toLowerCase()}/prompt`, {
            method: 'POST',
            headers: {
               ...headers,
            },
            body: JSON.stringify({ messages: messages, stream: true, seed: 0 })
         });

         return await handleStreamResponse(response, streamHandlers);
      } catch (error) {
         console.error('Error in chatAgentUtilityStreamCompletions:', error);
         return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            isStream: false
         };
      }
   },
   chatStreamCompletions: async ({
      payload,
      streamHandlers,
   }: {
    payload: ChatCompletionPayload;
    streamHandlers: ChatCompletionStreamHandler;
  }): Promise<any> => {
      const headers = await getClientHeaders();
      const messages = payload.messages.map((item) => ({
         ...item,
         content: typeof item.content === 'string' ? `${item.content}`.replace(THINK_TAG_REGEX, '') : item.content,
      }));
      console.log('chatStreamCompletions messages', messages);
      const response = await fetch(`${IMAGINE_URL}/api/agent/preview/v1`, {
         method: 'POST',
         headers: {
            ...headers,
         },
         body: JSON.stringify({
            messages: JSON.stringify(messages),
            agent_id: payload.agentId,
            kb_id: payload.kb_id,
            model_name: payload.model_name,
            stream: true,
         }),
      });

      if (response.status === 200) {
         const reader = response.body?.getReader();
         if (!reader) {
            throw 'No reader';
         }
         return parseStreamAIResponse(reader, streamHandlers);
      }
      throw 'API error';
   },
}

export default AgentAPI;