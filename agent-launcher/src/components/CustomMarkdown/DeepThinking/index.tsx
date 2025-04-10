import SvgInset from '@components/SvgInset';
import { CustomComponentProps } from '../types';
import s from './styles.module.scss';
import cx from 'clsx';
import { useState } from 'react';
import { Box } from '@chakra-ui/react';
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks'

function DeepThinking({
   node,
   children,
   status = "waiting",
   thinkTag,
}: CustomComponentProps & {
   status?: string;
   thinkTag?: string;
}) {
   const [isExpanded, setIsExpanded] = useState(status === "receiving");

   const getChildrenContent = () => {
      if (thinkTag) {
         return thinkTag
      }
      try {
         if (Array.isArray(children)) {
            return children.join('')
         }
         return children
      } catch(error){
         return children
      }
   }

   const renderChildren = () => {
      const content = getChildrenContent();

      if (typeof content === 'string') {
         return <Markdown
            remarkPlugins={[remarkGfm, remarkBreaks]}
            children={content as string}
         />
      }
      return content;
   }

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
         {!!isExpanded && (
            <div className={s.content}>
               <p className={s.thinkText}>{renderChildren()}</p>
            </div>
         )}
      </div>
   )
}

export default DeepThinking;
