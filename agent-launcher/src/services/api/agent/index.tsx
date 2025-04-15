import { AgentInfo, ChatCompletionPayload, ChatCompletionStreamHandler } from "./types.ts";
import { RequestPromptPayload, Content } from 'agent-server-definition'
import { IMAGINE_URL } from "../../../config.ts";
import { THINK_TAG_REGEX } from "@components/CustomMarkdown/constants.ts";
import { parseStreamAIResponse } from "@utils/api.ts";
import { getClientHeaders } from "../http-client.ts";
import CApiClient from "../agents-token/apiClient.ts";
import { IAgentToken } from "../agents-token/interface.ts";
import { v4 as uuidv4 } from 'uuid';
import qs from 'query-string';
import { logError } from '@utils/error-handler';

const normalizedContent = (content: Content) => {
   if (typeof content === 'string') {
      return content.replace(THINK_TAG_REGEX, '');
   }
   if (Array.isArray(content)) {
      return content.map((item) => {
         if (item.type === 'text') {
            return {
               ...item,
               text: item.text.replace(THINK_TAG_REGEX, ''),
            };
         }
         return item;
      });
   }
   return content;
}

// Utility function to handle API responses
const handleStreamResponse = async (
   response: Response,
   streamHandlers: ChatCompletionStreamHandler,
   body: any
): Promise<any> => {
   if (!response.ok) {
      const errorData = await response.text();
      logError(new Error(`HTTP error! status: ${response.status}`), {
         type: 'STREAM_ERROR',
         context: 'response_validation',
         status: response.status,
         errorData
      });
      throw new Error(`HTTP error! status: ${response.status}`);
   }

   const contentType = response.headers.get('content-type');
   
   if (contentType?.includes('text/event-stream')) {
      const reader = response.body?.getReader();
      if (!reader) {
         logError(new Error('No reader available for stream response'), {
            type: 'STREAM_ERROR',
            context: 'stream_setup',
            reqeustData: body
         });
         throw new Error('No reader available for stream response');
      }
      return await parseStreamAIResponse(reader, {
         ...streamHandlers,
         onFail: (err) => {
            logError(err, {
               type: 'STREAM_ERROR',
               context: 'stream_processing',
               reqeustData: body
            });
            streamHandlers.onFail(err);
         }
      });
   } else if (contentType?.includes('application/json')) {
      const data = await response.json();
      if (data.success === false) {
         logError(new Error(data.error || 'Unknown error'), {
            type: 'API_ERROR',
            context: 'json_response',
            errorData: data,
            reqeustData: body
         });
         return {
            success: false,
            error: data.error || 'Unknown error occurred',
            isStream: false
         };
      }

      // Check for different response structures
      if (data.choices?.[0]?.message?.content) {
         return {
            success: true,
            data: data,
            isStream: false
         };
      } else if (data.data?.choices?.[0]?.message?.content) {
         return {
            success: true,
            data: data.data,
            isStream: false
         };
      } else if (typeof data === 'string') {
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
         return {
            success: true,
            data: data,
            isStream: false
         };
      }
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
            content: normalizedContent(item.content)
         }));

         const body = JSON.stringify({ 
            messages, 
            stream: true, 
            seed: 0, 
            name: payload.name, 
            description: payload.description 
         })
         
         const response = await fetch(`http://localhost:65534/v1/chat/completions`, {
            method: 'POST',
            headers,
            body
         });

         return await handleStreamResponse(response, streamHandlers, body);
      } catch (error) {
         console.log('chatAgentModelStreamCompletions error', error);
         logError(error instanceof Error ? error : new Error(String(error)), {
            type: 'CHAT_COMPLETION_ERROR',
            context: 'stream_completion',
            payload: {
               name: payload.name,
               description: payload.description
            },
            chatAgentModel: {
               messages: payload?.messages
            }
         });
         
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
      try {
         const headers = await getClientHeaders();
         const messages = payload.messages.map((item) => ({
            ...item,
            content: normalizedContent(item.content)
         }));
         
         const response = await fetch(`http://localhost:65534/v1/chat/completions`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ 
               messages, 
               name: payload.name, 
               description: payload.description 
            })
         });

         if (response.status === 200) {
            return await response.json();
         }

         const errorData = await response.text();
         logError(new Error(`API error: ${response.status}`), {
            type: 'API_ERROR',
            context: 'chat_completion',
            status: response.status,
            errorData
         });
         throw new Error('API error');
      } catch (error) {
         logError(error instanceof Error ? error : new Error(String(error)), {
            type: 'CHAT_COMPLETION_ERROR',
            context: 'completion',
            payload: {
               name: payload.name,
               description: payload.description
            },
            chatAgentUtility: {
               messages: payload?.messages
            }
         });
         throw error;
      }
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
         return res;
      } catch (error) {
         logError(error instanceof Error ? error : new Error(String(error)), {
            type: 'AGENT_UTILITY_ERROR',
            context: 'prompt',
            agent: {
               network_id: agent?.network_id,
               agent_name: agent?.agent_name
            },
            chatAgentUtility: {
               id,
               messages
            }
         });
         throw error;
      }
   },
   chatAgentUtilityStreamCompletions: async ({
      agent,
      payload,
      streamHandlers,
      id,
      prvKey,
   }: {
      agent: IAgentToken,
      payload: ChatCompletionPayload;
      streamHandlers: ChatCompletionStreamHandler;
      id?: string;
      prvKey?: string;
   }): Promise<any> => {
      try {
         const headers = await getClientHeaders();
         const messages = payload.messages.map((item) => ({
            ...item,
            content: normalizedContent(item.content)
         }));

         const body = JSON.stringify({ 
            id,
            messages, 
            stream: true, 
            seed: 0,
            privateKey: prvKey,
            chainId: agent?.network_id,
            name: payload?.name,
            description: payload?.description
         });
         
         const response = await fetch(`http://localhost:33030/${agent?.network_id}-${agent?.agent_name?.toLowerCase()}/prompt`, {
            method: 'POST',
            headers,
            body
         });

         return await handleStreamResponse(response, streamHandlers, body);
      } catch (error) {
         logError(error instanceof Error ? error : new Error(String(error)), {
            type: 'AGENT_UTILITY_ERROR',
            context: 'stream_completion',
            agent: {
               network_id: agent?.network_id,
               agent_name: agent?.agent_name
            },
            payload: {
               name: payload?.name,
               description: payload?.description,
            },
            chatAgentUtility: {
               id,
               messages: payload?.messages
            }
         });
         
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
         content: normalizedContent(item.content)
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
            name: payload.name,
            description: payload.description,
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