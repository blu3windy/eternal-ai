import localStorageService from "@storage/LocalStorageService";
import { CHAT_AGENT_TASKS_STATE_STORAGE_KEY } from "@stores/states/agent-chat/constants";
import { initTaskItems } from "@stores/states/agent-chat/reducer";
import { tryToParseJsonString } from "@utils/string";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function SyncTaskFromStorage() {
   const dispatch = useDispatch();
   useEffect(() => { 
      const loadInitProcessingTasks = () => {
         localStorageService.getItem(CHAT_AGENT_TASKS_STATE_STORAGE_KEY).then((str) => {
            const storageAgentTasks = tryToParseJsonString(str, {});

            const data = Object.keys(storageAgentTasks).reduce((acc, key) => ({
               ...acc,
               [key]: (storageAgentTasks || []).filter(item => item.status === 'processing').filter(item => !!item.id)
            }), {})

            dispatch(initTaskItems({
               data: data,
            }));
         })
      }

      loadInitProcessingTasks();
   }, [])
   return (<></>);
}

export default SyncTaskFromStorage;