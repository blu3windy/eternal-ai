import React, { createContext, useContext, useEffect } from 'react';
import { Provider, ErrorBoundary } from '@rollbar/react';
import Rollbar from 'rollbar';
import { ErrorManagerContextType, ErrorManagerProviderProps } from './types';
import { setErrorManager } from '@utils/error-handler';

const ErrorManagerContext = createContext<ErrorManagerContextType | undefined>(undefined);

export const useErrorManager = () => {
    const context = useContext(ErrorManagerContext);
    if (!context) {
        throw new Error('useErrorManager must be used within an ErrorManagerProvider');
    }
    return context;
};

const ErrorFallback = ({ error, resetError }: { error: Error | null; resetError: () => void }) => {
    if (!error) return null;
    
    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre>{error.message}</pre>
            <button onClick={resetError}>Try again</button>
        </div>
    );
};

export const ErrorManagerProvider: React.FC<ErrorManagerProviderProps> = ({ children }) => {
    const rollbar = new Rollbar({
        accessToken: '0b1d40e4a6c94f19b9c39a7b8cc5cea184130e2685cb6e38689a17843c0765e9228dd3b611b559e3ae5176dfe3ab7f12',
        environment: process.env.NODE_ENV,
        captureUncaught: true,
        captureUnhandledRejections: true,
    });

    const logError = (error: Error, context?: Record<string, any>) => {
        console.error('Error:', error, context);
        rollbar.error(error, context);
    };

    const logInfo = (message: string, context?: Record<string, any>) => {
        console.info('Info:', message, context);
        rollbar.info(message, context);
    };

    const logWarning = (message: string, context?: Record<string, any>) => {
        console.warn('Warning:', message, context);
        rollbar.warning(message, context);
    };

    const errorManager = { logError, logInfo, logWarning };

    useEffect(() => {
        setErrorManager(errorManager);
    }, []);

    return (
        <ErrorManagerContext.Provider value={errorManager}>
            <ErrorBoundary fallbackUI={ErrorFallback}>
                {children}
            </ErrorBoundary>
        </ErrorManagerContext.Provider>
    );
};
