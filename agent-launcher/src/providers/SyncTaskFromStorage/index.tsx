import localStorageService from "@storage/LocalStorageService";
import { CHAT_AGENT_TASKS_STATE_STORAGE_KEY } from "@stores/states/agent-chat/constants";
import { initTaskItems } from "@stores/states/agent-chat/reducer";
import { tryToParseJsonString } from "@utils/string";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ProcessingTaskHandler from "./ProcessingTaskHandler";
import { TaskItem } from "@stores/states/agent-chat/type";

function SyncTaskFromStorage() {
   const dispatch = useDispatch();
   useEffect(() => {
      const loadInitProcessingTasks = () => {
         localStorageService.getItem(CHAT_AGENT_TASKS_STATE_STORAGE_KEY).then((str) => {
            const storageAgentTasks = tryToParseJsonString<Record<string, TaskItem[]>>(str, {});

            const data = Object.keys(storageAgentTasks).reduce(
               (acc, key) => ({
                  ...acc,
                  [key]: (storageAgentTasks[key] || []).filter((item) => !!item.id),
               }),
               {}
            );

            dispatch(
               initTaskItems({
                  data: data,
               })
            );
         });
      };

      loadInitProcessingTasks();
   }, []);

   return (
      <>
         <ProcessingTaskHandler />
      </>
   );
}

export default SyncTaskFromStorage;
