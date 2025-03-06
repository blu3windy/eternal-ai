import {Button, Divider, Flex, Text} from '@chakra-ui/react';
import React, { useContext } from 'react';
import AutosizeTextarea from 'react-autosize-textarea';
import { useChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import useFundAgent from "../../../../../../providers/FundAgent/useFundAgent.ts";
import { AgentContext } from "@pages/home/provider";
import s from "./styles.module.scss";
import AgentWalletInfo from "@pages/home/chat-agent/AgentWalletInfo";

interface IProps {
  inputRef?: any;
  onFocus?: () => void;
  btnSubmit?: React.ReactElement;
  isSending?: boolean;
}

const InputText = ({ onFocus, btnSubmit, isSending }: IProps) => {
   const {
      publishEvent,
      loading,
      setIsFocusChatInput,
      chatInputRef,
      isFocusChatInput,
      isStopReceiving,
      isAllowChat,
   } = useChatAgentProvider();

   const { setDepositAgentID } = useFundAgent();
    const {
      selectedAgent,
      stopAgent,
      isStopping,
      isRunning,
      isStarting,
      startAgent,
      isCanChat,
      agentWallet,
    } = useContext(AgentContext);

    const handleStartAgent = () => {
      startAgent(selectedAgent);
    };

    const handleStopAgent = () => {
      stopAgent(selectedAgent);
   };

   const [message, setMessage] = React.useState('');

   const isSend = React.useMemo(() => {
      return !!message;
   }, [message]);

   const onSendMessage = (_message: string) => {
      if (isSend && !loading) {
         publishEvent(_message);
         setMessage('');
      }
   };

   const handleDeposit = () => {
      setDepositAgentID(selectedAgent?.agent_id);
   }

   return (
      <Flex
         direction={'column'}
         // left="12px"
         // right="12px"
         // position={'absolute'}
         // bottom={'10px'}
         paddingBottom={'10px'}
      // paddingLeft={'10px'}
      // paddingRight={'10px'}
      // background="#101216"
        className={s.container}
      >
         <Flex
            w={{ base: '100%' }}
            padding="1px"
            // minHeight={'48px'}
            direction={'row'}
            gap={'12px'}
         >
            <Flex
               // border="1px solid #5400FB33"
               borderRadius="16px"
               flex={1}
               // backgroundColor="#000000"
               // boxShadow={'0px 0px 24px -6px #5400FB1F'}
               minHeight={'60px'}
               overflow="hidden"
               position="relative"
               className={isRunning ? s.runningWrapper : s.stopWrapper}
            >
               <AutosizeTextarea
                  type="text"
                  ref={chatInputRef}
                  value={message}
                  style={{
                     border: 'none',
                     width: '100%',
                     height: '100%',
                     outline: 'none',
                     padding: '16px 20px',
                     backgroundColor: 'transparent',
                     color: '#000',
                     fontSize: '16px',
                     fontWeight: '400',
                     transform: 'height 0.2s ease',
                  }}
                  // disabled={loading}
                  onChange={(event: any) => {
                     const value = event?.target?.value || '';
                     setMessage(value);
                  }}
                  placeholder={isRunning ? `Ask something` : `${selectedAgent?.agent_name} is ready!`}
                  // onEnter
                  onKeyDown={(event) => {
                     if (event.key === 'Enter' && isCanChat) {
                        event.preventDefault();
                        event.stopPropagation();
                        onSendMessage(message);
                     }
                  }}
                  onFocus={() => {
                     setIsFocusChatInput(true);
                     // onFocus && onFocus();
                  }}
                  onBlur={() => setIsFocusChatInput(false)}
                  onPointerEnterCapture={undefined}
                  onPointerLeaveCapture={undefined}
                  autoFocus={true}
               />
              {
                isRunning ? (
                  <>
                    <Divider color={'#E2E4E8'} my={'0px'} />
                    <Flex justifyContent={"space-between"}>
                      <Button
                        className={s.btnStop}
                        onClick={handleStopAgent}
                        isLoading={isStopping}
                        isDisabled={isStopping}
                        loadingText={'Stopping...'}
                      >
                        <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 15.5V5.5H15V15.5H5Z" fill="black"/>
                        </svg>
                        Stop running {selectedAgent?.agent_name}
                      </Button>
                      {
                        agentWallet && (
                          <AgentWalletInfo />
                        )
                      }
                    </Flex>
                  </>
                ) : (
                  <Button
                    className={s.btnStart}
                    onClick={handleStartAgent}
                    isLoading={isStarting}
                    isDisabled={isStarting}
                    loadingText={'Starting...'}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16.147 10.3468L7.31449 16.2351C7.25175 16.2769 7.17885 16.3008 7.10357 16.3044C7.02829 16.308 6.95344 16.2911 6.88699 16.2555C6.82055 16.22 6.765 16.167 6.72625 16.1024C6.68751 16.0377 6.66703 15.9638 6.66699 15.8884V4.11176C6.66703 4.0364 6.68751 3.96245 6.72625 3.8978C6.765 3.83315 6.82055 3.78022 6.88699 3.74465C6.95344 3.70907 7.02829 3.69219 7.10357 3.69579C7.17885 3.69939 7.25175 3.72334 7.31449 3.7651L16.147 9.65343C16.2041 9.69148 16.2508 9.74303 16.2832 9.80351C16.3156 9.86398 16.3325 9.93151 16.3325 10.0001C16.3325 10.0687 16.3156 10.1362 16.2832 10.1967C16.2508 10.2572 16.2041 10.3087 16.147 10.3468Z" fill="white"/>
                    </svg>
                    Start running {selectedAgent?.agent_name}
                  </Button>
                )
              }
               {/*<Flex
                  position="absolute"
                  top="0"
                  bottom="0"
                  right="0"
                  // paddingRight="10px"
                  cursor="pointer"
                  justifyContent="center"
                  alignItems="center"
                  width="50px"
                  backgroundColor="#FFF"
                  opacity={isSending || isStopReceiving ? 0.2 : 1}
                  onClick={() => {
                     if (isSending || isStopReceiving || !isAllowChat) {
                        return;
                     }
                     if (isSend) {
                        onSendMessage(message);
                     }
                  }}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     width="20"
                     height="20"
                     viewBox="0 0 20 20"
                     fill="none"
                  >
                     <path
                        d="M15.3724 2.55248L4.44486 5.28416C1.83403 5.93666 1.85986 9.65666 4.47986 10.2733L7.87911 11.0733C7.96328 11.0933 8.05245 11.0683 8.11328 11.0067L12.0616 7.05832C12.3033 6.81665 12.7032 6.81665 12.9448 7.05832C13.1865 7.29999 13.1865 7.69999 12.9448 7.94165L8.99483 11.8916C8.934 11.9525 8.9083 12.0416 8.9283 12.1258L9.72746 15.5217C10.3441 18.1417 14.064 18.1675 14.7165 15.5567L17.4482 4.62915C17.7607 3.37415 16.6249 2.23914 15.3724 2.55248Z"
                        fill="#000"
                     />
                  </svg>
               </Flex>*/}
               {/*{
                  !isAllowChat && (
                     <Flex
                        position="absolute"
                        left={'24px'}
                        top={'16px'}
                     >
                        <Text as={"span"} fontSize={"16px"} fontWeight={400} textDecoration={"underline"} cursor={'pointer'} onClick={handleDeposit}>Deposit</Text>&nbsp;
                        <Text as={"span"} fontSize={"16px"} fontWeight={400} opacity={0.7}>to chat (cost 1 EAI/chat)</Text>
                     </Flex>
                  )
               }*/}
            </Flex>
         </Flex>
      </Flex>
   );
};

export default InputText;
