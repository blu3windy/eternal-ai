'use client';

import axios, {Axios, AxiosError, AxiosRequestConfig, AxiosResponse,} from 'axios';
import {BASE_CHAIN_ID, IMAGINE_URL} from "../../../config.ts";
import localStorageService from "../../../storage/LocalStorageService.ts";
import STORAGE_KEYS from "@constants/storage-key.ts";
import {getAuthenToken} from "@services/api/http-client.ts";

export const IGNORE_ADDRESS_TEXT = '';

class CApiClient {
  private address = localStorageService.getItem(STORAGE_KEYS.WALLET_ADDRESS);
   protected requestConfig: AxiosRequestConfig = {
      baseURL: `${IMAGINE_URL}/api`,
      timeout: 5 * 60000,
      headers: {
         'Content-Type': 'application/json',
      },
   };

   api: Axios;

   constructor() {
      // const wallet = store.getState().wallet.wallet;
     this.api = axios.create(this.requestConfig);

      this.api.interceptors.request.use(
         (config: any) => {
            const _config = config;

           const authToken = getAuthenToken();
           if (authToken) {
             _config.headers.Authorization = `${authToken}`;
           }
            let params = _config?.params;
            if (!params) {
               params = {};
            }
            if (!params?.network) {
               params.network = BASE_CHAIN_ID;
            }
            if (!params?.address) {
               params.address = this.address;
            }

            if (params?.ignoreAddress) {
               params.address = '';
            }

            return {
               ..._config,
               params,
            };
         },
         (error: AxiosError) => {
            Promise.reject(error);
         },
      );

      this.api.interceptors.response.use(
         (res: AxiosResponse) => {
            console.log('result', res);
            
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
            if (!error.response) {
               return Promise.reject(error);
            } else {
               const response = error?.response?.data || error;
               const errorMessage
            = response?.error || error?.Message || JSON.stringify(error);
               return Promise.reject(errorMessage);
            }
         },
      );
   }
}

export default CApiClient;
