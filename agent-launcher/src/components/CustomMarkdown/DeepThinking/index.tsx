import SvgInset from '@components/SvgInset';
import { CustomComponentProps } from '../types';
import s from './styles.module.scss';
import cx from 'clsx';
import { useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { TASK_TAG_REGEX } from '../constants';
import Task, { TaskType } from './Task';
import { v4 as uuidv4 } from 'uuid';
import { AnimatePresence, motion } from 'framer-motion';

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks'

type TaskItem = TaskType | string;

const parseJsonString = (str: string): TaskItem=> {
   try {
      const result = JSON.parse(str) as TaskType;
      if (!result.id) {
         result.id = uuidv4();
      }
      return result;
   } catch (error) {
      return str;
   }
};

function DeepThinking({
   status = "waiting",
   content,
}: CustomComponentProps & {
   status?: string;
   content: string;
}) {
   const [isExpanded, setIsExpanded] = useState(status === "receiving");

   const tasks = useMemo(() => {
      try {
         const parserTasks = content
            .match(TASK_TAG_REGEX)
            ?.map(task => task.replace(/<\/?task>/g, ''))
            ?.map(task => parseJsonString(task as string))
            ?.filter(task => !!task) as TaskItem[];

         const mergedTasks = parserTasks?.reduce((acc: TaskItem[], curr: TaskItem) => {
            if (typeof curr === 'string') {
               return [...acc, curr.replace(/<task>/g, '').replace(/<\/task>/g, '')];
            }
            const existingTask = acc.find(task => (task as TaskType).id === (curr as TaskType).id);
            if (existingTask) {
               // Merge the tasks if they have the same id
               return acc.map(task => 
                  (task as TaskType).id === (curr as TaskType).id 
                     ? { ...(task as TaskType), ...(curr as TaskType) }
                     : task
               );
            }
            return [...acc, curr];
         }, []);
         return mergedTasks;
      } catch (error) {
         return [];
      }
   }, [content]);

   const renderTasks = () => {
      if (!tasks?.length) {
         return (
            <Markdown
               remarkPlugins={[remarkGfm, remarkBreaks]}
               children={content as string}
            />
         )
      }
      return tasks?.map(task => {
         if (!!task && typeof task === 'string') {
            return (
               <Markdown
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  children={task as string}
               />
            )
         }
         return <Task data={task} />
      })
      
   };

   return (
      <div className={cx(s.deepthinking)}>
         <div className={s.title} onClick={() => setIsExpanded(!isExpanded)}>
            {(status === "receiving" || status === "sync-receiving") ? (
               <span className={cx(s.titleText, s.thinking)}>Thinking...</span>
            ) : (
               <span className={s.titleText}>Think</span>
            )}
            <Box
               transform={!isExpanded ? "rotate(-90deg)" : "rotate(0deg)"}
               transition="transform 0.3s ease"
            >
               <SvgInset svgUrl="icons/ic-cheron-down.svg" size={10} />
            </Box>
         </div>
         <AnimatePresence>
            {!!isExpanded && (
               <motion.div
                  className={s.content}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
               >
                  {renderTasks()}
               </motion.div>
            )}
         </AnimatePresence>
      </div>
   )
}

export default DeepThinking;
