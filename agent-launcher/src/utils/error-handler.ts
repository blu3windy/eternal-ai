import { ErrorManagerContextType } from '@providers/ErrorManager/types';

let errorManager: ErrorManagerContextType | null = null;

export const setErrorManager = (manager: ErrorManagerContextType) => {
    errorManager = manager;
};

export const logError = (error: Error, context?: Record<string, any>) => {
    console.log('logError', error, context, errorManager);
    if (errorManager) {
        errorManager.logError(error, context);
    } else {
        console.error('Error:', error, context);
    }
};

export const logInfo = (message: string, context?: Record<string, any>) => {
    if (errorManager) {
        errorManager.logInfo(message, context);
    } else {
        console.info('Info:', message, context);
    }
};

export const logWarning = (message: string, context?: Record<string, any>) => {
    if (errorManager) {
        errorManager.logWarning(message, context);
    } else {
        console.warn('Warning:', message, context);
    }
}; 