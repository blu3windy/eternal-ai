import eaiCrypto from "@utils/crypto";
import { ethers } from "ethers";

const KEYTAR_STORAGE_NAME = {
   CIPHER_TEXT: 'KEYTAR_LAUNCHER_EAI_CIPHER_TEXT',
}

class EaiSigner {

   static async getCipherText() {
      return await globalThis.electronAPI.keytarGet(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
   }

   static async hasUser() {
      try {
         const cipherText = await globalThis.electronAPI.keytarGet(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
         return !!cipherText;
      } catch (e) {
         return false;
      }
   }

   static async storageNewKey(params: { prvKey: string, pass: string }) {
      const { prvKey, pass } = params;
      const signer = new ethers.Wallet(prvKey);
      if (!signer?.address || !pass?.length) {
         throw new Error("Invalid private key or password");
      }

      const cipherText = eaiCrypto.encryptAES({
         value: prvKey,
         pass
      });
      await globalThis.electronAPI.keytarSave(KEYTAR_STORAGE_NAME.CIPHER_TEXT, cipherText);
   }

   static async getStorageKey({ pass }: { pass: string }) {
      const cipherText = await globalThis.electronAPI.keytarGet(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
      console.log("cipherText", cipherText)
      if (cipherText) {
         return eaiCrypto.decryptAES({
            cipherText,
            pass
         });
      }
      return undefined;
   }

   static async removeStorageKey() {
      await globalThis.electronAPI.keytarRemove(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
   }

   static async reset() {
      await globalThis.electronAPI.keytarRemove(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
   }
}

export default EaiSigner;