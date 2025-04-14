import storage from "@storage/LocalStorageService";
import eaiCrypto from "@utils/crypto";
import { ethers } from "ethers";

const STORAGE_KEY_NAME = {
   CIPHER_TEXT: 'KEYTAR_LAUNCHER_EAI_CIPHER_TEXT',
   INVITE_CODE: 'KEYTAR_LAUNCHER_EAI_INVITE_CODE',
}

class EaiSigner {
   static async getCipherText() {
      const cipher = await storage.getItem(STORAGE_KEY_NAME.CIPHER_TEXT);
      return cipher;
   }

   static async hasUser() {
      try {
         const cipherText = await EaiSigner.getCipherText();
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
      await storage.setItem(STORAGE_KEY_NAME.CIPHER_TEXT, cipherText);
   }

   static async getStorageKey({ pass }: { pass: string }) {
      const cipherText = await EaiSigner.getCipherText();

      if (cipherText) {
         return eaiCrypto.decryptAES({
            cipherText,
            pass
         });
      }
      return undefined;
   }

   static async reset() {
      await storage.removeItem(STORAGE_KEY_NAME.CIPHER_TEXT);
      await storage.removeItem(STORAGE_KEY_NAME.INVITE_CODE);
   }


   static async getInviteCode() {
      const inviteCode = await storage.getItem(STORAGE_KEY_NAME.INVITE_CODE);
      return inviteCode;
   }

   static async setInviteCode(inviteCode: string) {
      await storage.setItem(STORAGE_KEY_NAME.INVITE_CODE, inviteCode);
   }
}

export default EaiSigner;