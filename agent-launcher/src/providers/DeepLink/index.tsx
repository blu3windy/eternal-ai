import React, { createContext, useContext, useEffect, useState } from 'react';
import { DeepLinkContextType, DeepLinkParams } from './types';

// Add type definitions for electron window
declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                on: (channel: string, func: (...args: any[]) => void) => void;
                removeListener: (channel: string, func: (...args: any[]) => void) => void;
            };
        };
    }
}

const DeepLinkContext = createContext<DeepLinkContextType | undefined>(undefined);

export const useDeepLink = () => {
    const context = useContext(DeepLinkContext);
    if (!context) {
        throw new Error('useDeepLink must be used within a DeepLinkProvider');
    }
    return context;
};

export const DeepLinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [deepLinkData, setDeepLinkData] = useState<DeepLinkParams | null>(null);

    useEffect(() => {
        // Listen for deep link events from the main process
        const handleDeepLinkEvent = (_event: any, data: DeepLinkParams) => {
            handleDeepLink(data);
        };

        // Add listener when component mounts
        globalThis.electronAPI.onDeepLink(handleDeepLinkEvent);

    }, []);

    const handleDeepLink = (data: DeepLinkParams) => {
        setDeepLinkData(data);
        // You can add additional handling logic here
        console.log('Deep link received:', data);
    };

    return (
        <DeepLinkContext.Provider value={{ deepLinkData, handleDeepLink }}>
            {children}
        </DeepLinkContext.Provider>
    );
}; 