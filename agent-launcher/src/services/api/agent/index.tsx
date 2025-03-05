import { AgentInfo, ChatCompletionPayload, ChatCompletionStreamHandler } from "./types.ts";
import { IMAGINE_URL } from "../../../config.ts";
import { THINK_TAG_REGEX } from "@components/CustomMarkdown/constants.ts";
import { parseStreamAIResponse } from "@utils/api.ts";
import { getClientHeaders } from "../http-client.ts";
import CApiClient from "../agents-token/apiClient.ts";
import { IAgentToken } from "../agents-token/interface.ts";

const AgentAPI = {
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
  chatAgentUtility: async ({agent, prvKey}: { agent: IAgentToken, prvKey?: string}): Promise<any> => {
    try {
      const res: AgentInfo = await (new CApiClient()).api.post(
        `http://localhost:33033/${agent?.network_id}-${agent?.agent_name}/prompt`, {
          "messages": [],
          "privateKey": prvKey,
          "chainId": agent?.network_id
        }
      );
      return res;
    } catch (e) {
      return undefined;
    }
  },
   chatStreamCompletions: async ({
      payload,
      streamHandlers,
   }: {
    payload: ChatCompletionPayload;
    streamHandlers: ChatCompletionStreamHandler;
  }): Promise<any> => {
      const messages = payload.messages.map((item) => ({
         ...item,
         content: `${item.content}`.replace(THINK_TAG_REGEX, ''),
      }));
      const response = await fetch(`${IMAGINE_URL}/api/agent/preview/v1`, {
         method: 'POST',
         headers: {
            ...getClientHeaders(),
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