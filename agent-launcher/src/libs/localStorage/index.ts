import { isBrowser } from '@utils/common';
import STORAGE_KEYS from "@constants/storage-key.ts";

export const STORE_KEY = 'CLEAR_STORAGE_VERSION';

const whiteListStorageClear = [STORE_KEY];

function isJsonString(str: any) {
   try {
      JSON.parse(str);
   } catch (e) {
      return false;
   }
   return true;
}

class LocalStorage {
   public static getItem(key: any) {
      if (!isBrowser()) {
         return null;
      }

      const data: any = localStorage.getItem(key);
      if (data && isJsonString(data)) {
         return JSON.parse(data);
      }
      return data;
   }

   public static setItem(key: STORAGE_KEYS, data: unknown) {
      if (!isBrowser()) {
         return;
      }

      if (isJsonString(data)) {
         const json = JSON.stringify(data);
         localStorage.setItem(key, json);
      }
      localStorage.setItem(key, data as any);
   }

   public static removeItem(key: STORAGE_KEYS) {
      if (!isBrowser()) {
         return;
      }

      localStorage.removeItem(key);
   }

   public static clear() {
      if (!isBrowser()) {
         return;
      }
      // only clear key not in white list
      Object.keys(localStorage).forEach((key) => {
         if (!whiteListStorageClear.includes(key)) {
            localStorage.removeItem(key);
         }
      });
   }
}

export default LocalStorage;
