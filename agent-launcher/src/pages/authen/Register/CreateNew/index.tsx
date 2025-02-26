import { FC, useState } from "react";
import { CreateNewStep } from "@pages/authen/Register/types.ts";
import Backup from "@pages/authen/Register/CreateNew/Backup.tsx";
import ConfirmKey from "@pages/authen/Register/CreateNew/ConfirmKey.tsx";
import ConfirmPass from "@pages/authen/Register/CreateNew/ConfirmPass.tsx";

const CreateNew: FC = () => {
   const [step, setStep]
       = useState<CreateNewStep>(CreateNewStep.backup);
   const [prvKey, setPrvKey] = useState<string>("");

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
         return <ConfirmPass />;
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