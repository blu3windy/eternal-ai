import eaiCrypto from "@utils/crypto";

const KEYTAR_STORAGE_NAME = {
   CIPHER_TEXT: 'KEYTAR_LAUNCHER_EAI_CIPHER_TEXT',
}

class EaiSigner {

   static async getCipherText() {
      return await window.electronAPI.keytarGet(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
   }

   static async hasUser() {
      try {
         const cipherText = await window.electronAPI.keytarGet(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
         return !!cipherText;
      } catch (e) {
         return false;
      }
   }

   static async storageNewKey(params: { prvKey: string, pass: string }) {
      const { prvKey, pass } = params;
      const cipherText = eaiCrypto.encryptAES({
         value: prvKey,
         pass
      });
      await window.electronAPI.keytarSave(KEYTAR_STORAGE_NAME.CIPHER_TEXT, cipherText);
   }

   static async getStorageKey({ pass }: { pass: string }) {
      const cipherText = await window.electronAPI.keytarGet(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
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
      await window.electronAPI.keytarRemove(KEYTAR_STORAGE_NAME.CIPHER_TEXT);
   }
}

export default EaiSigner;