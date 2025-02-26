import {Flex, Text} from '@chakra-ui/react';
import React from 'react';
import AutosizeTextarea from 'react-autosize-textarea';
import {useChatAgentProvider} from "@pages/home/chat-agent/ChatAgent/provider.tsx";

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
    alert('Deposit')
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
    >
      <Flex
        w={{ base: '100%' }}
        padding="1px"
        // minHeight={'48px'}
        direction={'row'}
        gap={'12px'}
      >
        <Flex
          border="1px solid #5400FB33"
          borderRadius="10000px"
          flex={1}
          // backgroundColor="#000000"
          boxShadow={'0px 0px 24px -6px #5400FB1F'}
          minHeight={'60px'}
          overflow="hidden"
          position="relative"
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
            placeholder={isAllowChat ? `Write a message...` : ''}
            // onEnter
            onKeyDown={(event) => {
              if (event.key === 'Enter' && isAllowChat) {
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
          <Flex
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
          </Flex>
          {
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
          }
        </Flex>
        {btnSubmit && btnSubmit}
      </Flex>
    </Flex>
  );
};

export default InputText;
