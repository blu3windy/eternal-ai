'use client';

import axios, { Axios, AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { BASE_CHAIN_ID, IMAGINE_URL } from "../../../config.ts";
import localStorageService from "@storage/LocalStorageService.ts";
import STORAGE_KEYS from "@constants/storage-key.ts";
import { getAuthenToken } from "@services/api/http-client.ts";

export const IGNORE_ADDRESS_TEXT = '';

class CApiClient {
   private address: string | undefined = undefined; // Initialize as null
   protected requestConfig: AxiosRequestConfig = {
      baseURL: `${IMAGINE_URL}/api`,
      timeout: 30 * 60000,
      headers: {
         'Content-Type': 'application/json',
      } as any,
   };

   api: Axios;

   constructor() {
      this.api = axios.create(this.requestConfig);

      this.api.interceptors.request.use(
         async (config: any) => {
            const _config = config;

            // Fetch the wallet address asynchronously
            this.address = await localStorageService.getItem(STORAGE_KEYS.WALLET_ADDRESS);
            console.log('Wallet Address:', this.address); // Log the retrieved address

            // Fetch the auth token asynchronously
            const authToken = await getAuthenToken();
            if (authToken) {
               // Ensure headers is defined
               _config.headers = _config.headers || {};
               _config.headers.Authorization = `${authToken}`;
            }

            const params = _config?.params || {};
            params.network = params.network || BASE_CHAIN_ID;
            params.address = params.address || this.address || '';

            if (params.ignoreAddress) {
               params.address = '';
            }

            return {
               ..._config,
               params,
            };
         },
         (error: AxiosError) => {
            return Promise.reject(error);
         },
      );

      this.api.interceptors.response.use(
         (res: AxiosResponse) => {
            let result = res?.data?.data || res?.data?.result || res?.data;
            const error = res?.data?.error;
            if (error) {
               return Promise.reject(error);
            }
            if (res?.data?.count !== undefined) {
               result = {
                  rows: result,
                  count: res?.data?.count,
               };
            }
            return Promise.resolve(result);
         },
         (error: any) => {
            // if (!error.response) {
            //    return Promise.reject(error);
            // } else {
            //    const response = error?.response?.data || error;
            //    const errorMessage = response?.error || error?.Message || JSON.stringify(error);
            //    return Promise.reject(errorMessage);
            // }
            return Promise.reject(error);
         },
      );
   }
}

export default CApiClient;