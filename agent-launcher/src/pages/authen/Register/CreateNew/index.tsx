import { useState } from "react";
import { CreateNewStep, RegisterType } from "@pages/authen/Register/types.ts";
import Backup from "@pages/authen/Register/CreateNew/Backup.tsx";
import ConfirmKey from "@pages/authen/Register/CreateNew/ConfirmKey.tsx";
import ConfirmPass from "@pages/authen/Register/CreateNew/ConfirmPass.tsx";
import EaiSigner from "@helpers/signer";
import { compareString } from "@utils/string.ts";
import { useAuth } from "@pages/authen/provider.tsx";
import Stepper from "@components/Stepper";
import { Box } from "@chakra-ui/react";
import ChooseModel from "@pages/authen/ChooseModel";

interface IProps {
   onBack: () => void;
}

const CreateNew = (props: IProps) => {
   const { onBack } = props;
   const [prvKey, setPrvKey] = useState<string>("");
   const [step, setStep]
       = useState<CreateNewStep>(CreateNewStep.backup);
   const [password, setPassword] = useState<string>("");
   const { onLogin } = useAuth();

   const [loading, setLoading] = useState<boolean>(false);

   const onCreateSigner = async (password: string) => {
      try {
         setLoading(true);
         setPassword(password);
         await EaiSigner.storageNewKey({
            prvKey,
            pass: password
         });

         const _prvKey = await EaiSigner.getStorageKey({ pass: password });

         if (!compareString(prvKey, _prvKey)) {
            throw new Error("Private key not match");
         }

      } catch (e) {
         console.log(e);
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
               onBack={() => {
                  setPrvKey("");
                  onBack();
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
      case CreateNewStep.setupModel:
         return (
            <ChooseModel

            />
         );
      default:
         return null;
      }
   }

   return (
      <>
         <Stepper
            steps={
               [
                  { title: "Backup private key", key: CreateNewStep.backup },
                  { title: "Confirm private key", key: CreateNewStep.confirmKey },
                  { title: "Create a password", key: CreateNewStep.confirmPass },
                  { title: "Setup model", key: CreateNewStep.initModel },
               ]
            }
            activeStep={step.toString()}
         />
         <Box height="90px" />
         {renderContent()}
      </>
   );
}

export default CreateNew;