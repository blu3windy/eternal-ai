import { Provider, ErrorBoundary } from '@rollbar/react';

export interface ErrorManagerContextType {
    logError: (error: Error, context?: Record<string, any>) => void;
    logInfo: (message: string, context?: Record<string, any>) => void;
    logWarning: (message: string, context?: Record<string, any>) => void;
}

export interface ErrorManagerProviderProps {
    children: React.ReactNode;
} 