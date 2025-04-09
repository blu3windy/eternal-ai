import SvgInset from '@components/SvgInset';
import { CustomComponentProps } from '../types';
import s from './styles.module.scss';
import cx from 'clsx';
import { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';

function DeepThinking({
   node,
   children,
   status = "waiting",
}: CustomComponentProps & {
   status?: string;
}) {
   const [isExpanded, setIsExpanded] = useState(status === "receiving");
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
               <p className={s.thinkText}>{children}</p>
            </div>
         )}
      </div>
   )
}

export default DeepThinking;
