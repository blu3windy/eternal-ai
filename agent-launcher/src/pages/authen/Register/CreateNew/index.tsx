import { FC, useState } from "react";
import { CreateNewStep } from "@pages/authen/Register/types.ts";
import Backup from "@pages/authen/Register/CreateNew/Backup.tsx";
import ConfirmKey from "@pages/authen/Register/CreateNew/ConfirmKey.tsx";
import ConfirmPass from "@pages/authen/Register/CreateNew/ConfirmPass.tsx";
import EaiSigner from "@helpers/signer";
import { compareString } from "@utils/string.ts";
import { useAuth } from "@pages/authen/provider.tsx";

const CreateNew: FC = () => {
   const [prvKey, setPrvKey] = useState<string>("");
   const [step, setStep]
       = useState<CreateNewStep>(CreateNewStep.backup);
   const { onLogin } = useAuth();

   const [loading, setLoading] = useState<boolean>(false);

   const onCreateSigner = async (password: string) => {
      try {
         setLoading(true);

         await EaiSigner.storageNewKey({
            prvKey,
            pass: password
         });

         const _prvKey = await EaiSigner.getStorageKey({ pass: password });

         if (!compareString(prvKey, _prvKey)) {
            throw new Error("Private key not match");
         }

         onLogin(password);
      } catch (e) {
         console.error(e);
      } finally {
         setLoading(false);
      }
   }

   const renderContent = () => {
      switch (step) {
      case CreateNewStep.backup:
         return (
            <Backup
               prvKey={prvKey}
               onNext={(prvKey: string) => {
                  setPrvKey(prvKey);
                  setStep(CreateNewStep.confirmKey);
               }}
            />
         );
      case CreateNewStep.confirmKey:
         return (
            <ConfirmKey
               prvKey={prvKey}
               onNext={() => setStep(CreateNewStep.confirmPass)}
            />
         );
      case CreateNewStep.confirmPass:
         return <ConfirmPass onNext={onCreateSigner} loading={loading} />;
      default:
         return null;
      }
   }

   return (
      <>
         {renderContent()}
      </>
   );
}

export default CreateNew;