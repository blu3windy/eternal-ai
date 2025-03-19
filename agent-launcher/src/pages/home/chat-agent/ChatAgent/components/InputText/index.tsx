import { Box, Flex, IconButton } from "@chakra-ui/react";
import React, { useCallback, useContext, useRef, useState } from "react";
import AutosizeTextarea from "react-autosize-textarea";
import { useChatAgentProvider } from "@pages/home/chat-agent/ChatAgent/provider.tsx";
import useFundAgent from "@providers/FundAgent/useFundAgent.ts";
import { AgentContext } from "@pages/home/provider";
import s from "./styles.module.scss";
import localStorageService from "@storage/LocalStorageService.ts";
import STORAGE_KEYS from "@constants/storage-key.ts";
import { compareString } from "@utils/string.ts";
import CAgentTokenAPI from "@services/api/agents-token";
import { useDropzone } from 'react-dropzone';
import cx from "clsx";

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
      isRunning,
      requireInstall,
   } = useContext(AgentContext);

   const [message, setMessage] = useState('');
   const [attachments, setAttachments] = useState<File[]>([]);
   const fileInputRef = useRef<HTMLInputElement>(null);

   const onDrop = useCallback((acceptedFiles: File[]) => {
      const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'));
      setAttachments(prev => [...prev, ...imageFiles]);
   }, []);

   const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
         'image/*': ['.png', '.jpg', '.jpeg', '.gif']
      },
      noClick: true,
      noKeyboard: true
   });

   const cPumpAPI = new CAgentTokenAPI();

   const handleSend = async () => {
      if (!message.trim() && attachments.length === 0) return;
      if (isStopReceiving) return;

      const convertToBase64 = (file: File): Promise<string> => {
         return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = () => {
               const base64String = reader.result as string;
               // Remove the data:image/[type];base64, prefix if needed
               // const base64 = base64String.split(',')[1];
               resolve(base64String);
            };

            reader.onerror = (error) => {
               reject(error);
            };
         });
      };

      const uploadedAttachments = await Promise.all(
         attachments.map(async (file) => {
            // const url = URL.createObjectURL(file);
            const base64 = await convertToBase64(file);
            return {
               type: 'image' as const,
               url: base64,
               previewUrl: base64
            };
         })
      );

      publishEvent(message, uploadedAttachments);
      setMessage('');
      setAttachments([]);

      const agents = await localStorageService.getItem(STORAGE_KEYS.RECENT_AGENTS);
      let recentAgents = JSON.parse(agents || "[]") || [];
      recentAgents = recentAgents.filter(id => !compareString(id, selectedAgent?.id?.toString()));
      recentAgents.unshift(selectedAgent?.id);

      if (recentAgents.length > 10) {
         recentAgents = recentAgents.slice(0, 10);
      }

      await localStorageService.setItem(STORAGE_KEYS.RECENT_AGENTS, JSON.stringify(recentAgents));

      await cPumpAPI.saveRecentAgents({ ids: recentAgents })
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   const handleRemoveAttachment = (index: number) => {
      setAttachments(prev => prev.filter((_, i) => i !== index));
   };

   const handleAttachImage = () => {
      fileInputRef.current?.click();
   };

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      const imageFiles = files.filter(file => file.type.startsWith('image/'));
      setAttachments(prev => [...prev, ...imageFiles]);
   };


   const isSend = React.useMemo(() => {
      return !!message;
   }, [message]);

   // const onSendMessage = (_message: string) => {
   //   if (isSend && !loading) {
   //     publishEvent(_message);
   //     setMessage("");

   //     let recentAgents = JSON.parse(await localStorageService.getItem(STORAGE_KEYS.RECENT_AGENTS)!) || [];
   //     recentAgents = recentAgents.filter(id => !compareString(id, selectedAgent?.id?.toString()));
   //     recentAgents.unshift(selectedAgent?.id);

   //     if (recentAgents.length > 10) {
   //       recentAgents = recentAgents.slice(0, 10);
   //     }

   //     localStorageService.setItem(STORAGE_KEYS.RECENT_AGENTS, JSON.stringify(recentAgents));

   //     cPumpAPI.saveRecentAgents({ ids: recentAgents })
   //   }
   // };

   // const handleDeposit = () => {
   //   setDepositAgentID(selectedAgent?.agent_id);
   // };

   return (
      <Flex
         direction={"column"}
         paddingBottom={"10px"}
         {...getRootProps()}
         className={s.container}
      >
         <Box className={s.attachmentPreview}>
            {attachments.map((file, index) => (
               <Box key={index} position="relative" mr={2}>
                  <img
                     src={URL.createObjectURL(file)}
                     alt="attachment preview"
                     style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                  <IconButton
                     aria-label="Remove attachment"
                     icon={<span>×</span>}
                     size="xs"
                     position="absolute"
                     top="-8px"
                     right="-8px"
                     borderRadius="full"
                     onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveAttachment(index);
                     }}
                  />
               </Box>
            ))}
         </Box>
         <Flex
            w={{ base: "100%" }}
            padding="1px"
            direction={"row"}
            gap={"12px"}
         >
            <Flex
               borderRadius="100px"
               flex={1}
               minHeight={"60px"}
               overflow="hidden"
               position="relative"
               className={cx(s.inputContainer, !requireInstall
                  ? s.runningWrapper
                  : isRunning
                     ? s.runningWrapper
                     : s.stopWrapper)

               }
            >
               <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
               />
               <IconButton
                  aria-label="Attach image"
                  icon={<span>📎</span>}
                  onClick={handleAttachImage}
                  variant="ghost"
                  _hover={{
                     backgroundColor: 'transparent'
                  }}
               />
               <AutosizeTextarea
                  type="text"
                  ref={chatInputRef}
                  value={message}
                  style={{
                     border: "none",
                     width: "100%",
                     height: "100%",
                     outline: "none",
                     padding: "16px 20px",
                     backgroundColor: "transparent",
                     color: "#000",
                     fontSize: "16px",
                     fontWeight: "400",
                     transform: "height 0.2s ease",
                  }}
                  // disabled={loading}
                  onChange={(event: any) => {
                     const value = event?.target?.value || "";
                     setMessage(value);
                  }}
                  placeholder={
                     !requireInstall
                        ? `Ask something`
                        : isRunning
                           ? `Ask something`
                           : `${selectedAgent?.agent_name} is ready!`
                  }
                  // onEnter
                  onKeyDown={handleKeyDown}
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
                  display={"none"}
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
                  onClick={handleSend}
                  // onClick={() => {
                  //   if (isSending || isStopReceiving || !isAllowChat) {
                  //     return;
                  //   }
                  //   if (isSend) {
                  //     onSendMessage(message);
                  //   }
                  // }}
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
            </Flex>
         </Flex>
      </Flex>
   );
};

export default InputText;
