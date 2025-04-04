import {
   Box,
   Flex,
   Text,
   useClipboard,
   useDisclosure,
   useToast,
   Menu,
   MenuButton,
   MenuList,
   MenuItem,
   Divider,
   Popover,
   PopoverTrigger,
   PopoverContent,
   PopoverBody,
   Button,
} from "@chakra-ui/react";
import { useAuth } from "@pages/authen/provider";
import { formatAddressCenter } from "@utils/format";
import { useContext, useMemo, useRef, useState } from "react";
import { AgentContext } from "@pages/home/provider/AgentContext";
import s from "./styles.module.scss";
import BaseModal from "@components/BaseModal";
import { FilterOption } from "../constants";
import AddTestAgent from "../AddTestAgent";
import AgentMonitor from "../AgentMonitor";
import FundAgentProvider from "@providers/FundAgent";
import Loaders from "@components/Loaders";
import { useSelector } from "react-redux";
import { RootState } from "@stores/index";
import { totalPendingTasksSelector } from "@stores/states/agent-chat/selector";
import ProcessingTaskModal from "./ProcessingTaskModal";
import ROUTERS from "@constants/route-path";
import { useNavigate } from "react-router-dom";

const ProcessingTaskIcon = () => {
   return (
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
         <g clip-path="url(#clip0_54310_4573)">
            <path
               d="M18.125 23.125H6.125C4.74428 23.125 3.625 22.0064 3.625 20.6257V4.62096C3.625 3.24025 4.74428 2.125 6.125 2.125H18.125C19.5057 2.125 20.625 3.23824 20.625 4.61896V20.6311C20.625 22.0118 19.5057 23.125 18.125 23.125Z"
               stroke="white"
               stroke-width="2"
               stroke-linecap="round"
               stroke-linejoin="round"
            />
            <path d="M6.625 6.125L8.625 8.125L11.625 5.125" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.625 12.125L8.625 14.125L11.625 11.125" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M6.625 19.125H10.625" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.125 7.625H17.625" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.125 13.625H17.625" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M15.125 19.125H17.625" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
         </g>
         <defs>
            <clipPath id="clip0_54310_4573">
               <rect width="24" height="24" fill="white" transform="translate(0 0.5)" />
            </clipPath>
         </defs>
      </svg>
   );
};

const BottomBar = ({ onAddAgentSuccess }: { onAddAgentSuccess: (address: string) => void }) => {
   const toast = useToast();
   const { signer } = useAuth();
   const { onCopy } = useClipboard(signer?.address || "");
   const [isOpen, setIsOpen] = useState(false);
   const navigate = useNavigate();

   const [isOpenProcessingTask, setIsOpenProcessingTask] = useState(false);

   const totalPendingTasks = useSelector(totalPendingTasksSelector);

   // get wallet balance

   const handleCopy = () => {
      onCopy();
      toast({
         description: "Address copied to clipboard",
         status: "success",
         duration: 2000,
         isClosable: true,
         position: "bottom",
      });
   };

   return (
      <Box className={s.bottomBar}>
         <Flex className={s.addressContainer}>
            <Text className={s.addressText}>{formatAddressCenter(signer?.address || "")}</Text>
            <Box className={s.copyIcon} onClick={handleCopy}>
               <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                     d="M12.25 4.16667H6.41667C4.96533 4.16667 4.16667 4.96533 4.16667 6.41667V12.25C4.16667 13.7013 4.96533 14.5 6.41667 14.5H12.25C13.7013 14.5 14.5 13.7013 14.5 12.25V6.41667C14.5 4.96533 13.7013 4.16667 12.25 4.16667ZM13.5 12.25C13.5 13.138 13.138 13.5 12.25 13.5H6.41667C5.52867 13.5 5.16667 13.138 5.16667 12.25V6.41667C5.16667 5.52867 5.52867 5.16667 6.41667 5.16667H12.25C13.138 5.16667 13.5 5.52867 13.5 6.41667V12.25ZM2.5 3.74666V9.58667C2.5 10.3853 2.82206 10.582 2.92806 10.6473C3.16406 10.7913 3.23726 11.0993 3.09326 11.3347C2.9986 11.4887 2.83468 11.5733 2.66602 11.5733C2.57735 11.5733 2.48661 11.5493 2.40527 11.5C1.80461 11.132 1.5 10.4887 1.5 9.58667V3.74666C1.5 2.31866 2.31941 1.5 3.74674 1.5H9.58659C10.7099 1.5 11.2467 1.99265 11.5 2.40531C11.644 2.64065 11.57 2.94865 11.3346 3.09265C11.0986 3.23732 10.792 3.16266 10.6473 2.92733C10.5826 2.82133 10.3853 2.49935 9.58659 2.49935H3.74674C2.86141 2.50002 2.5 2.86133 2.5 3.74666Z"
                     fill="#5B5B5B"
                  />
               </svg>
            </Box>
         </Flex>
         <Flex gap={"12px"}>
            {!!totalPendingTasks && (
               <Flex
                  gap="4px"
                  alignItems={"center"}
                  borderRadius={"12px"}
                  bg="rgba(255, 255, 255, 0.30)"
                  px="8px"
                  py="4px"
                  onClick={() => {
                     setIsOpenProcessingTask((prev) => !prev);
                  }}
                  cursor={"pointer"}
               >
                  <Loaders.Spinner size={16} color="#000" />
                  <Text fontSize={"12px"} fontWeight={400} lineHeight={"120%"}>
                     {totalPendingTasks} {totalPendingTasks === 1 ? "task" : "tasks"}
                  </Text>
               </Flex>
            )}

            <Box>
               <Popover placement="top-start">
                  <PopoverTrigger>
                     <Box cursor={"pointer"} className={s.settingsContainer}>
                        <Box className={s.settingsIcon}>
                           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                 d="M11.8867 9.73333C11.2667 9.37333 10.8867 8.71333 10.8867 8C10.8867 7.28667 11.2667 6.62667 11.8867 6.26667C11.9933 6.2 12.0333 6.06667 11.9667 5.96L10.8533 4.04C10.8133 3.96667 10.74 3.92668 10.6667 3.92668C10.6267 3.92668 10.5867 3.94 10.5533 3.96C10.2467 4.13334 9.9 4.22666 9.55333 4.22666C9.2 4.22666 8.85333 4.13333 8.54 3.95333C7.92 3.59333 7.54 2.94 7.54 2.22666C7.54 2.1 7.44 2 7.32 2H4.68C4.56 2 4.46 2.1 4.46 2.22666C4.46 2.94 4.08 3.59333 3.46 3.95333C3.14667 4.13333 2.80001 4.22666 2.44668 4.22666C2.10001 4.22666 1.75334 4.13334 1.44668 3.96C1.34001 3.89333 1.20667 3.93333 1.14667 4.04L0.0266724 5.96C0.00667236 5.99334 0 6.03333 0 6.06667C0 6.14667 0.0400097 6.22 0.113343 6.26667C0.733343 6.62667 1.11334 7.28 1.11334 7.99333C1.11334 8.71333 0.733329 9.37333 0.12 9.73333H0.113343C0.00667572 9.8 -0.0333415 9.93333 0.0333252 10.04L1.14667 11.96C1.18667 12.0333 1.26 12.0733 1.33333 12.0733C1.37333 12.0733 1.41334 12.06 1.44668 12.04C2.07334 11.6867 2.84 11.6867 3.46 12.0467C4.07333 12.4067 4.45333 13.06 4.45333 13.7733C4.45333 13.9 4.55333 14 4.68 14H7.32C7.44 14 7.54 13.9 7.54 13.7733C7.54 13.06 7.92 12.4067 8.54 12.0467C8.85333 11.8667 9.2 11.7733 9.55333 11.7733C9.9 11.7733 10.2467 11.8667 10.5533 12.04C10.66 12.1067 10.7933 12.0667 10.8533 11.96L11.9733 10.04C11.9933 10.0067 12 9.96667 12 9.93333C12 9.85333 11.96 9.78 11.8867 9.73333ZM6 10C4.89333 10 4 9.10667 4 8C4 6.89333 4.89333 6 6 6C7.10667 6 8 6.89333 8 8C8 9.10667 7.10667 10 6 10Z"
                                 fill="#5B5B5B"
                              />
                           </svg>
                        </Box>
                     </Box>
                  </PopoverTrigger>
                  <PopoverContent bg={"rgba(12, 0, 99, 0.90) !important"}>
                     <PopoverBody padding={0} className={s.menuList1}>
                        <AgentMonitor />
                        <Button width="100%" height="45px" display="flex" alignItems="center" padding="10px 20px" gap="12px" onClick={() => setIsOpen(true)} className={s.menuItem}>
                           <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path
                                 d="M9.25 3.75H4.25C3.69772 3.75 3.25 4.19772 3.25 4.75V9.75C3.25 10.3023 3.69772 10.75 4.25 10.75H9.25C9.80228 10.75 10.25 10.3023 10.25 9.75V4.75C10.25 4.19772 9.80228 3.75 9.25 3.75Z"
                                 stroke="white"
                                 stroke-width="2"
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                              />
                              <path
                                 d="M20.25 3.75H15.25C14.6977 3.75 14.25 4.19772 14.25 4.75V9.75C14.25 10.3023 14.6977 10.75 15.25 10.75H20.25C20.8023 10.75 21.25 10.3023 21.25 9.75V4.75C21.25 4.19772 20.8023 3.75 20.25 3.75Z"
                                 stroke="white"
                                 stroke-width="2"
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                              />
                              <path
                                 d="M9.25 14.75H4.25C3.69772 14.75 3.25 15.1977 3.25 15.75V20.75C3.25 21.3023 3.69772 21.75 4.25 21.75H9.25C9.80228 21.75 10.25 21.3023 10.25 20.75V15.75C10.25 15.1977 9.80228 14.75 9.25 14.75Z"
                                 stroke="white"
                                 stroke-width="2"
                                 stroke-linecap="round"
                                 stroke-linejoin="round"
                              />
                              <path d="M17.75 14.75V21.75" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                              <path d="M21.25 18.25H14.25" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                           </svg>
                           Add test agent
                        </Button>

                        <Button
                           width="100%"
                           height="45px"
                           display="flex"
                           alignItems="center"
                           padding="10px 20px"
                           gap="12px"
                           onClick={() => {
                              setIsOpenProcessingTask((prev) => !prev);
                           }}
                           className={s.menuItem}
                        >
                           <ProcessingTaskIcon />
                           Task processing {totalPendingTasks ? `(${totalPendingTasks})` : ""}
                        </Button>
                     </PopoverBody>
                  </PopoverContent>
               </Popover>
               <BaseModal
                  isShow={isOpen}
                  onHide={() => {
                     setIsOpen(false);
                  }}
                  size="small"
               >
                  <AddTestAgent
                     onAddAgentSuccess={(address: string) => {
                        onAddAgentSuccess(address);
                        setIsOpen(false);
                     }}
                  />
               </BaseModal>

               <ProcessingTaskModal
                  key={`processing-task-${isOpenProcessingTask}`}
                  isOpen={isOpenProcessingTask}
                  setIsOpen={() => {
                     setIsOpenProcessingTask((prev) => !prev);
                  }}
               />
            </Box>
         </Flex>
      </Box>
   );
};

export default BottomBar;
