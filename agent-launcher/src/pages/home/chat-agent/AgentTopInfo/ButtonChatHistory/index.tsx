import { Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, VStack, Text, Box, Flex, IconButton } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AgentContext } from "@pages/home/provider/AgentContext";
import chatAgentDatabase, { ChatSession } from "../../../../../database/chatAgentDatabase";
import { DeleteIcon } from "@chakra-ui/icons";
import { useDisclosure } from "@chakra-ui/react";
import {  useChatAgentProvider } from "../../ChatAgent/provider";
import { useSelector } from "react-redux";
import { commonSelector } from "@stores/states/common/selector";

const ButtonChatHistory = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const { threadId, setSessionId } = useChatAgentProvider();
    const { needReload } = useSelector(commonSelector);
    

    useEffect(() => {
        if (threadId) {
            loadSessions();
        }
    }, [threadId, needReload]);

    const loadSessions = async () => {
        if (!threadId) return;
        const sessions = await chatAgentDatabase.getSessions(threadId);
        console.log('sessions', sessions);
        
        setSessions(sessions);
    };

    const handleDeleteSession = async (sessionId: string) => {
        await chatAgentDatabase.deleteSession(sessionId);
        loadSessions();
    };

    if (sessions?.length < 2) {
        return null;
    }

    return (
        <>
            <IconButton
                aria-label="Chat history"
                icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.125 12.125C2.125 17.6479 6.60215 22.125 12.125 22.125C17.6479 22.125 22.125 17.6479 22.125 12.125C22.125 6.60215 17.6479 2.125 12.125 2.125C8.02435 2.125 4.5002 4.59319 2.95708 8.125L3.03351 7.95445" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2.625 3.125V8.125H7.625" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12.125 6.125V12.125L17.125 17.125" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>}
                size="sm"
                variant="ghost"
                onClick={onOpen}
            />
            <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>Chat History</DrawerHeader>

                    <DrawerBody>
                        <VStack spacing={2} align="stretch">
                            {sessions.map((session) => (
                                <Flex
                                    key={session.id}
                                    p={3}
                                    bg="gray.50"
                                    borderRadius="md"
                                    align="center"
                                    justify="space-between"
                                    cursor="pointer"
                                >
                                    <Box flex={1} onClick={() =>{
                                         setSessionId(session.id);
                                         onClose();
                                    }}>
                                        <Text fontWeight="medium" noOfLines={1}>
                                            {session.name}
                                        </Text>
                                        {session.lastMessage && (
                                            <Text fontSize="sm" color="gray.500" noOfLines={1}>
                                                {session.lastMessage}
                                            </Text>
                                        )}
                                    </Box>
                                    <IconButton
                                        aria-label="Delete chat"
                                        icon={<DeleteIcon />}
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleDeleteSession(session.id)}
                                    />
                                </Flex>
                            ))}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default ButtonChatHistory;
