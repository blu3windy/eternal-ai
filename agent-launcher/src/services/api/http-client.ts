/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosHeaders } from 'axios';
import localStorageService from "../../storage/LocalStorageService.ts";
import STORAGE_KEYS from "@constants/storage-key.ts";
import { logError } from '@utils/error-handler';
import { v4 as uuidv4 } from 'uuid';
export const TIMEOUT = 120 * 60000;

const HEADERS = {
   'Content-Type': 'application/json',
   Accept: 'application/json',
} as unknown as AxiosHeaders;

export const getAuthenToken = async () => {
   return await localStorageService.getItem(STORAGE_KEYS.AUTHEN_TOKEN);
};

export const getClientHeaders = async () => {
   const requestId = uuidv4();
   const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Request-ID': requestId,
   };
   const authToken = await getAuthenToken();

   if (authToken) {
      headers.Authorization = `${authToken}`;
   }
   return headers;
};

const createAxiosInstance = ({ baseURL = '' }: { baseURL: string }) => {
   const instance = axios.create({
      baseURL,
      timeout: TIMEOUT,
      headers: {
         ...HEADERS,
         'X-Request-ID': crypto.randomUUID(),
      },
   });

   instance.interceptors.request.use(
      async (config) => {
         const authToken = await getAuthenToken();

         if (authToken) {
            config.headers.Authorization = `${authToken}`;
         }
         return config;
      },
      (error) => {
         logError(error, {
            type: 'REQUEST_ERROR',
            context: 'request_interceptor',
            url: error.config?.url,
            method: error.config?.method,
         });
         return Promise.reject(error);
      },
   );

   instance.interceptors.response.use(
      (res) => {
         const result = res?.data?.data || res?.data?.result;
         if (res?.data?.count !== undefined) {
            result.count = res.data.count;
         }
         const error = res?.data?.error;
         if (error && Object.keys(error).length) {
            logError(new Error(JSON.stringify(error)), {
               type: 'API_ERROR',
               context: 'response_validation',
               status: res.status,
               url: res.config.url,
               requestId: res.config.headers['X-Request-ID']
            });
            return Promise.reject(error);
         }

         if (!result) {
            return Promise.resolve(result);
         }
         if (typeof result === 'object') {
            return result;
         }
         return Promise.resolve(result);
      },
      (error: any) => {
         if (!error.response) {
            logError(error, {
               type: 'NETWORK_ERROR',
               context: 'network_failure',
               url: error.config?.url,
               requestId: error.config?.headers['X-Request-ID']
            });
            return Promise.reject(error);
         }
         const response = error?.response?.data || error;
         const errorMessage = response?.error || error?.Message || JSON.stringify(error);
         logError(new Error(errorMessage), {
            type: 'API_ERROR',
            context: 'response_error',
            status: error.response?.status,
            url: error.config?.url,
            requestId: error.config?.headers['X-Request-ID'],
            responseData: response
         });
         return Promise.reject(errorMessage);
      },
   );

   return instance;
};

export const createCustomAxiosInstance = ({
   baseURL = '',
}: {
  baseURL: string;
}) => {
   const instance = axios.create({
      baseURL,
      timeout: TIMEOUT,
      headers: {
         ...HEADERS,
      },
   });

   instance.interceptors.request.use(
      async (config) => {
         const authToken = await getAuthenToken();
         if (authToken) {
            config.headers.Authorization = `Bearer ${authToken}`;
         }
         return config;
      },
      (error) => {
         Promise.reject(error);
      },
   );

   instance.interceptors.response.use(
      (res) => {
         const result = res?.data?.data || res?.data?.result;
         if (res?.data?.count !== undefined) {
            result.count = res.data.count;
         }
         const error = res?.data?.error;
         if (error && Object.keys(error).length) {
            return Promise.reject(error);
         }

         if (!result) {
            return Promise.resolve(result);
         }
         if (typeof result === 'object') {
            return result;
         }
         return Promise.resolve(result);
      },
      (error: any) => {
         if (!error.response) {
            return Promise.reject(error);
         }
         const response = error?.response?.data || error;
         const errorMessage
        = response?.error || error?.Message || JSON.stringify(error);
         return Promise.reject(errorMessage);
      },
   );

   return instance;
};

export default createAxiosInstance;
