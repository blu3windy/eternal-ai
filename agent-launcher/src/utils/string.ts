import { ethers } from "ethers";

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

const tryToParseJsonString = (str: string): Record<string, unknown> & any => {
   try {
      return JSON.parse(str);
   } catch (error) {
      return {};
   }
};

const getFileExtension = (filename: string) => {
    return filename.slice(filename.lastIndexOf('.') + 1);
}


const isBase64 = (str: string) => {
   if (!str || typeof str !== 'string') return false;
   if (str.length % 4 !== 0) return false;
   const base64Regex = /^[A-Za-z0-9+/]+={0,2}$/;
   return base64Regex.test(str);
};


const splitBase64 = (content: string) => {
   return content
      .split(/\n+/)
      .map(line => line.trim())
      .filter(line => line.length > 0);
};

export {
   compareString,
   getAvatarName,
   addressFormater,
   tryToParseJsonString,
   getFileExtension,
   isBase64,
   splitBase64
};
