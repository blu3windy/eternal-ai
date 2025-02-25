import * as CryptoJS from 'crypto-js';
import { DecryptParams, EncryptParams } from "@utils/crypto/types.ts";

/**
 * Generates a random private key.
 */
const generatePrivateKey = (): string => {
   const id = CryptoJS.lib.WordArray.random(32);
   return '0x' + id;
}

/**
 * Computes a double SHA-256 hash of the provided key.
 */
export const doubleHash = (key: string): string => {
   const hash = CryptoJS.SHA256(key);
   return CryptoJS.SHA256(hash).toString();
};

/**
 * Encrypts a value using AES encryption with a double-hashed password.
 */
const encryptAES = (params: EncryptParams): string => {
   const { value, pass } = params;
   const password = doubleHash(pass);
   return CryptoJS.AES.encrypt(value, password).toString();
};

/**
 * Decrypts an AES-encrypted value using a double-hashed password.
 */
const decryptAES = (params: DecryptParams): string => {
   const { cipherText, pass } = params;
   const password = doubleHash(pass?.toString());
   const decrypted = CryptoJS.AES.decrypt(cipherText, password);
   if (decrypted) {
      try {
         const str = decrypted.toString(CryptoJS.enc.Utf8);
         if (str.length > 0) {
            return str;
         }
      } catch (e) {
         throw new Error('Error decrypting');
      }
   }
   throw new Error('Error decrypting');
};

const eaiCrypto = {
   generatePrivateKey,
   doubleHash,
   encryptAES,
   decryptAES
}

export default eaiCrypto;