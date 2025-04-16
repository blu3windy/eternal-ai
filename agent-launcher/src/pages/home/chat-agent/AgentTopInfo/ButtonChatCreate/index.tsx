import React from 'react';
import { IconButton } from '@chakra-ui/react';
import chatAgentDatabase from "../../../../../database/chatAgentDatabase";
import { useChatAgentProvider } from '../../ChatAgent/provider';

interface ButtonChatCreateProps {
    isDisabled?: boolean;
}

const ButtonChatCreate: React.FC<ButtonChatCreateProps> = ({ isDisabled = false }) => {
    const { threadId, setSessionId, set } = useChatAgentProvider();

    const onCreateSession = async () => {
        try {
            // Create a new session
            const sessionId = await chatAgentDatabase.createSession(threadId);

            // Get the last active session to verify it was created
            const session = await chatAgentDatabase.getLastSessionActive(threadId);

            if (session) {
                setSessionId(sessionId);
                // Reset messages and other state
                set(prev => ({
                    ...prev,
                    messages: [],
                    sessionId: sessionId
                }));
            }
        } catch (error) {
            console.error('Error creating session:', error);
        }
    }

    return (
        <IconButton
            onClick={onCreateSession}
            aria-label="Create chat"
            icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.75 4.25L17.5 4L20.5 7L20.25 6.75" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M8.25 16.2499L12.7116 14.7627L21.7628 5.71152C22.5842 4.89015 22.5842 3.55847 21.7628 2.73711C20.9415 1.91576 19.6098 1.91576 18.7885 2.73711L9.7372 11.7883L8.25 16.2499Z" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    <path d="M13.25 2.75H5.25C3.86929 2.75 2.75 3.86929 2.75 5.25V19.25C2.75 20.6307 3.86929 21.75 5.25 21.75H19.25C20.6307 21.75 21.75 20.6307 21.75 19.25V11.25" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>

            }
            isDisabled={isDisabled}
            variant="ghost"
            size="sm"
            _hover={{ bg: 'gray.100' }}
            _active={{ bg: 'gray.200' }}
        />
    );
};

export default ButtonChatCreate;
