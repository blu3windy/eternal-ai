import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import s from './ChatMessage.module.scss';
import cs from 'classnames';
import { INIT_WELCOME_MESSAGE } from '../../constants';
import SvgInset from '@components/SvgInset';
// import {WaitingAnimation} from '@/modules/chat/components/ChatMessage/WaitingForGenerate/WaitingForGenerateText';
import { formatLongAddress } from '@utils/format';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { IChatMessage } from 'src/services/api/agent/types.ts';
import { AgentContext } from '@pages/home/provider/AgentContext';
import CustomMarkdown from '@components/CustomMarkdown';
import { compareString } from '@utils/string.ts';
import { getExplorerByChain } from '@utils/helpers.ts';
import { WaitingAnimation } from '@components/ChatMessage/WaitingForGenerate/WaitingForGenerateText';

dayjs.extend(duration);

type Props = {
   message: IChatMessage;
   ref: any;
   isLast: boolean;
   onRetryErrorMessage: (messageId: string) => void;
   isSending: boolean;
   initialMessage?: boolean;
};

const ChatMessage = ({
   message,
   ref,
   isLast,
   onRetryErrorMessage,
   isSending,
   initialMessage,
}: Props) => {
   const { selectedAgent } = useContext(AgentContext);

   const [hours, setHours] = useState<number | null>(0);
   const [minutes, setMinutes] = useState<number | null>(0);
   const [seconds, setSeconds] = useState<number | null>(0);

   const calcTime = () => {
      const diff = dayjs.duration(dayjs(message?.updatedAt).diff(dayjs(message?.createdAt)));
      if (diff.milliseconds() <= 0) {
         setHours(null);
         setMinutes(null);
         setSeconds(null);
         return;
      }
      setHours(diff.hours());
      setMinutes(diff.minutes());
      setSeconds(diff.seconds());
   };

   useEffect(() => {
      if (message?.createdAt && message?.updatedAt) {
         calcTime();
      }
   }, [message]);

   const renderContent = () => {
      return (
         <>
            {renderMarkdown()}
            {message.attachments?.map((attachment, index) => (
               <Box key={index} mt={2}>
                  <Image
                     src={attachment.url}
                     alt="Attached image"
                     maxW="300px"
                     borderRadius="md"
                     loading="lazy"
                     fallback={
                        <Box
                           w="300px"
                           h="200px"
                           bg="gray.100"
                           display="flex"
                           alignItems="center"
                           justifyContent="center"
                        >
                           <Text color="gray.500">Loading image...</Text>
                        </Box>
                     }
                  />
               </Box>
            ))}
         </>
      );
   };

   const renderMarkdown = () => {
      if (message.status === 'waiting' || message.status === 'sync-waiting') {
         return <WaitingAnimation color={message?.is_reply ? 'black' : 'white'} />;
      }

      if (message.status === 'failed') {
         return (
            <div
               className={cs(s.markdown, {
                  [s.markdown__failed]: message.status === 'failed',
               })}
            >
               <span>{message.msg || 'Something went wrong!'}</span>
               {!isSending && (
                  <span
                     className={s.retry}
                     onClick={() => {
                        message.replyTo && onRetryErrorMessage(message.replyTo);
                     }}
                  >
                     <SvgInset size={18} svgUrl="/svg/ic-retry-v2.svg" />
                  </span>
               )}
            </div>
         );
      }

      return (
         <div className={cs(s.markdown, 'markdown')}>
            <CustomMarkdown content={message?.msg} isLight={false} removeThink={initialMessage} />
         </div>
      );
   };

   const isMessageInitial = useMemo(
      () => !message?.is_reply && message?.msg === INIT_WELCOME_MESSAGE,
      [message]
   );

   if (isMessageInitial) {
      return <></>;
   }

   return (
      <div className={s.wrapper} ref={ref}>
         {message?.is_reply && (
            <Flex
               direction="row"
               alignItems="center"
               gap="6px"
               width="100%"
               justifyContent={message?.is_reply ? 'flex-start' : 'flex-end'}
            >
               <Flex
                  gap="8px"
                  alignItems="center"
                  width="100%"
                  flexDirection={message?.is_reply ? 'row' : 'row-reverse'}
               >
                  {message?.is_reply && selectedAgent?.token_image_url && (
                     <Image
                        src={selectedAgent.token_image_url}
                        width="24px"
                        height="24px"
                        borderRadius="24px"
                     />
                  )}
                  <Text fontSize="15px" fontWeight="600" width="fit-content">
                     {message.name}
                  </Text>
               </Flex>
            </Flex>
         )}
         <Box
            className={cs(
               s.content,
               { [s.question]: !message?.is_reply },
               { [s.reply]: message?.is_reply },
               { [s.failed]: message?.status === 'failed' }
            )}
            alignSelf={message?.is_reply ? 'flex-start' : 'flex-end'}
         >
            {renderContent()}
         </Box>

         {(message.status === 'receiving' || message.status === 'waiting') &&
            message.queryMessageState &&
            !compareString(message.queryMessageState, 'DONE') && (
               <Box paddingLeft={'12px'}>
                  <Text
                     opacity={'0.6'}
                     color="#fff"
                     fontSize={'12px'}
                     fontWeight={'400'}
                     lineHeight={'120%'}
                  >
                     {message.queryMessageState}
                  </Text>
               </Box>
            )}
         {message?.tx_hash && (
            <Box
               display={'flex'}
               alignItems={'center'}
               gap={'12px'}
               justifyContent={message?.is_reply ? 'flex-start' : 'flex-end'}
               mt={message?.is_reply ? '0px' : '-20px'}
            >
               {message?.is_reply && !!message?.createdAt && !!message?.updatedAt && (
                  <>
                     <Text className={s.txLink}>{`${minutes && minutes > 0 ? `${minutes}m` : ''} ${
                        seconds && seconds > 0 ? `${seconds}s` : ''
                     }`}</Text>
                     <svg
                        width="4"
                        height="4"
                        viewBox="0 0 4 4"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <circle cx="2" cy="2" r="2" fill="white" fill-opacity="0.6" />
                     </svg>
                  </>
               )}
               <a
                  className={s.txLink}
                  href={
                     getExplorerByChain({
                        chainId: selectedAgent?.network_id as any,
                        address: message?.tx_hash,
                        type: 'tx',
                     }) as any
                  }
                  target="_blank"
                  rel="noopener noreferrer"
               >
                  {formatLongAddress(message?.tx_hash)}
                  <Image src="/svg/ic-arrow-top-right-gray.svg" />
               </a>
            </Box>
         )}
      </div>
   );
};

export default memo(ChatMessage);
