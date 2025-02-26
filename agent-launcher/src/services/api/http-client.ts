/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosHeaders } from 'axios';

export const TIMEOUT = 5 * 60000;
export const HEADERS = { 'Content-Type': 'application/json' };

export const getAuthenToken = () => {
  // const authToken = LocalStorage.getItem(
  //   STORAGE_KEYS.NAKA_WALLET_API_ACCESS_TOKEN,
  // );
  // if (authToken) {
  //   return authToken;
  // }
  // const anonymousAuthToken = LocalStorage.getItem(
  //   STORAGE_KEYS.ANONYMOUS_AUTH_TOKEN,
  // );
  // if (anonymousAuthToken) {
  //   return anonymousAuthToken;
  // }
  return '';
};

export const getClientHeaders = () => {
  const headers = {
    ...HEADERS,
  } as Partial<AxiosHeaders>;
  // const authToken =
  //   LocalStorage.getItem(STORAGE_KEYS.NAKA_WALLET_API_ACCESS_TOKEN) ||
  //   LocalStorage.getItem(STORAGE_KEYS.NAKA_WALLET_AUTHEN);
  // if (authToken) {
  //   headers.Authorization = `${authToken}`;
  // }
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
    (config) => {
      // const authToken =
      //   LocalStorage.getItem(STORAGE_KEYS.NAKA_WALLET_API_ACCESS_TOKEN) ||
      //   LocalStorage.getItem(STORAGE_KEYS.NAKA_WALLET_AUTHEN);
      // if (authToken) {
      //   config.headers.Authorization = `${authToken}`;
      // }
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
      const errorMessage =
        response?.error || error?.Message || JSON.stringify(error);
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
    (config) => {
      // const authToken = LocalStorage.getItem(STORAGE_KEYS.NAKA_WALLET_AUTHEN);
      // if (authToken) {
      //   config.headers.Authorization = `Bearer ${authToken}`;
      // }
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
      const errorMessage =
        response?.error || error?.Message || JSON.stringify(error);
      return Promise.reject(errorMessage);
    },
  );

  return instance;
};

export default createAxiosInstance;
