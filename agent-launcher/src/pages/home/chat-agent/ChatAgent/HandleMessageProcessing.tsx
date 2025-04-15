import { AgentType } from "@pages/home/list-agent/constants";
import AgentAPI from "@services/api/agent";
import { IChatMessage } from "@services/api/agent/types";
import { useContext, useEffect, useMemo, useRef } from "react";
import { useChatAgentProvider } from "./provider";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { IAgentToken } from "@services/api/agents-token/interface";
import CAgentTokenAPI from "@services/api/agents-token";
import { useDispatch } from "react-redux";
import { removeTaskItem, removeTaskItemByItemId } from "@stores/states/agent-chat/reducer";

function HandleProcessingMessage({
   data,
   updateMessage,
   agent,
}: {
   data: IChatMessage;
   updateMessage: (id: string, data: Partial<IChatMessage>) => void;
   agent: IAgentToken | undefined;
}) {
   const dispatch = useDispatch();
   const cPumpAPI = new CAgentTokenAPI();
   const isPongRef = useRef<boolean>(false);
   const threadId = `${agent?.id}-${agent?.agent_name}`;

   useEffect(() => {
      let timeout: NodeJS.Timeout;
      const checkProcessingTask = async () => {
         if (data.id) {
            if ([AgentType.Infra, AgentType.CustomPrompt].includes(agent?.agent_type as any)) {
               // try to ping first
               // if error, try to start agent
               try {
                  if (!isPongRef.current) {
                     await cPumpAPI.checkAgentServiceRunning({
                        agent,
                     } as any);
                     isPongRef.current = true;
                  }

                  try {
                     const res = await AgentAPI.chatAgentUtility({
                        id: data.id,
                        agent: agent,
                     } as any);

                     if (res?.status !== 102) {
                        console.log('__________res__________', res);
                        try {
                           if (res.choices[0].message.content) {
                              if (!data.msg || (res.choices[0].message.content as string).includes(data.msg)) {
                                 updateMessage(data.id, {
                                    status: "received",
                                    msg: res.choices[0].message.content
                                 });
                              } else {
                                 updateMessage(data.id, {
                                    status: "received",
                                 });
                              }
                           } else {
                              updateMessage(data.id, {
                                 status: "received",
                              });
                           }
                        } catch (e) {
                           updateMessage(data.id, {
                              status: "received",
                           });
                           console.log('__________e__________', e);
                        }

                        dispatch(
                           removeTaskItemByItemId({
                              id: threadId,
                              itemId: data.id,
                           })
                        );
                     } else {
                        setTimeout(() => {
                           checkProcessingTask();
                        }, 10000);
                     }
                  } catch (e) {
                     console.log('__________e__________', e);
                     let errorMessage = (e as any)?.response?.data?.error;
                     if (!errorMessage && (e as any)?.response?.data && typeof (e as any)?.response?.data === "string") {
                        errorMessage = (e as any)?.response?.data;
                     }
                     if (!errorMessage) {
                        errorMessage = "Something went wrong!";
                     }
                     if (!data.msg) {
                        updateMessage(data.id, {
                           status: "failed",
                           msg: errorMessage,
                        });
                     }

                     dispatch(
                        removeTaskItemByItemId({
                           id: threadId,
                           itemId: data.id,
                        })
                     );
                  }
               } catch (e) {
                  timeout = setTimeout(() => {
                     checkProcessingTask();
                  }, 10000);
               }
            }
         }
      };
      timeout = setTimeout(() => {
         checkProcessingTask();
      }, 1000);

      return () => {
         if (timeout) {
            clearTimeout(timeout);
         }
      }
   }, [data.msg]);

   return <></>;
}

function HandleMessageProcessing({ updateMessage }: { updateMessage: (id: string, data: Partial<IChatMessage>) => void }) {
   const { selectedAgent } = useContext(AgentContext);
   const { messages } = useChatAgentProvider();

   // const processingMessages = useMemo(() => {
   //    return messages.filter((item) => item.status === "waiting" || item.status === "receiving" || item.status === "sync-waiting" || item.status === "sync-receiving");
   // }, [messages]);
   const processingMessages = useMemo(() => {
      return messages.filter((item) => item.status === "sync-waiting" || item.status === "sync-receiving");
   }, [messages]);

   const renderTasks = () => {
      if (selectedAgent) {
         return processingMessages.map((message) => <HandleProcessingMessage key={`task_${message.id}`} data={message} updateMessage={updateMessage} agent={selectedAgent} />);
      }
      return <></>;
   };

   return <>{renderTasks()}</>;
}

export default HandleMessageProcessing;
