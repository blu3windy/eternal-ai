import { FC, useState } from "react";
import { CreateNewStep } from "@pages/authen/Register/types.ts";
import Backup from "@pages/authen/Register/CreateNew/Backup.tsx";
import ConfirmKey from "@pages/authen/Register/CreateNew/ConfirmKey.tsx";
import ConfirmPass from "@pages/authen/Register/CreateNew/ConfirmPass.tsx";

const CreateNew: FC = () => {
   const [step, setStep]
       = useState<CreateNewStep>(CreateNewStep.backup);

   const renderContent = () => {
      switch (step) {
      case CreateNewStep.backup:
         return <Backup />;
      case CreateNewStep.confirmKey:
         return <ConfirmKey />;
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