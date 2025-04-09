/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosHeaders } from 'axios';
import localStorageService from "../../storage/LocalStorageService.ts";
import STORAGE_KEYS from "@constants/storage-key.ts";

export const TIMEOUT = 120 * 60000;
export const HEADERS = { 'Content-Type': 'application/json' };

export const getAuthenToken = async () => {
   const authToken = await localStorageService.getItem(STORAGE_KEYS.AUTHEN_TOKEN);
   if (authToken) {
      return authToken;
   }
   return '';
};

export const getClientHeaders = async () => {
   const headers = {
      ...HEADERS,
   } as Partial<AxiosHeaders>;
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
            // return Promise.resolve(camelCaseKeys(result));
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
