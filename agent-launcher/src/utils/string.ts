import tokenIcons from "@constants/tokenIcons";
import { IToken } from "@interfaces/token";
import { ethers } from "ethers";
import clone from "lodash/clone";
export const TOKEN_ICON_DEFAULT
  = "https://cdn.trustless.computer/upload/1683530065704444020-1683530065-default-coin.svg";

const compareString = (a: unknown, b: unknown): boolean => {
   return a?.toString?.()?.toLowerCase?.() === b?.toString?.()?.toLowerCase?.();
};

const getAvatarName = (name: string): string => {
   let words = "";
   if (name && name.split(" ").length > 0) {
      name.split(" ").length = 21;
      const arrName = name.split(" ");
      if (arrName[0]) {
         words = arrName[0].charAt(0);
         if (arrName[1]) {
            words += arrName[1].charAt(0);
         } else if (arrName[0].charAt(1)) {
            words += arrName[0].charAt(1);
         }
         words = words.toUpperCase();
      }
   }
   return words;
};

const addressFormater = (address?: string, sliceLength?: number) => {
   if (!address) return;
   // is EVM
   const _sliceLength = sliceLength || 7;
   if (ethers.utils.isAddress(address)) {
      return `${address.slice(2, _sliceLength + 2)}`;
   } else {
      return `${address.slice(0, _sliceLength)}`;
   }
};

const tryToParseJsonString = (str: string, defaultValue = {}): Record<string, unknown> & any => {
   try {
      return JSON.parse(str);
   } catch (error) {
      return defaultValue;
   }
};

const getFileExtension = (filename: string) => {
   return filename.slice(filename.lastIndexOf(".") + 1);
};

const parseSymbolName = (token: IToken | undefined) => {
   const _token = clone(token);
   if (_token && compareString(_token?.symbol, "WBTC")) {
      _token.symbol = "BTC";
   }
   if (_token && compareString(_token?.symbol, "WETH")) {
      _token.symbol = "ETH";
   }
   return _token;
};

const formatName = (name: string, length = 12): string => {
   if (!name) return "";
   if (ethers.utils.isAddress(name)) {
      return name.substring(2, 8);
   } else {
      return name?.length > length ? name.substring(0, length) + "..." : name;
   }
};

const getTokenIconUrl = (token: any) => {
   let url = TOKEN_ICON_DEFAULT;

   if (token?.logo) {
      url = token?.logo;
   } else if (token?.icon) {
      url = token?.icon;
   } else if (token?.image_url) {
      url = token?.image_url;
   } else if (tokenIcons?.[token?.symbol?.toLowerCase()]) {
      url = tokenIcons?.[token?.symbol?.toLowerCase()];
   } else if (token?.thumbnail) {
      url = token?.thumbnail;
   } else if ((token as any)?.img) {
      url = (token as any)?.img;
   } else if ((token as any)?.image) {
      url = (token as any)?.image;
   } else if ((token as any)?.meme?.image) {
      url = (token as any)?.meme?.image;
   } else if ((token as any)?.twitter_info?.twitter_avatar) {
      url = (token as any)?.twitter_info?.twitter_avatar;
   } else if ((token as any)?.tmp_twitter_info?.twitter_avatar) {
      url = (token as any)?.tmp_twitter_info?.twitter_avatar;
   }
   return url;
};

const isBase64 = (str: string) => {
   if (!str || typeof str !== "string") return false;
   if (str.length % 4 !== 0) return false;
   const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
   return base64Regex.test(str);
};

const splitBase64 = (content: string) => {
   return content
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
};

export {
   compareString,
   getAvatarName,
   addressFormater,
   tryToParseJsonString,
   getFileExtension,
   parseSymbolName,
   formatName,
   getTokenIconUrl,
   isBase64,
   splitBase64,
};
