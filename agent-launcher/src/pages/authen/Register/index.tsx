import Introduce from "@pages/authen/Register/Introduce";
import { FC, useState } from "react";
import { RegisterType } from "@pages/authen/Register/types.ts";
import CreateNew from "@pages/authen/Register/CreateNew";
import ImportKey from "@pages/authen/Register/ImportKey";

const Register: FC = () => {
   const [registerType, setRegisterType]
       = useState<RegisterType | undefined>(RegisterType.create);

   const renderContent = () => {
      switch (registerType) {
      case RegisterType.create:
         return <CreateNew />;
      case RegisterType.import:
         return <ImportKey />;
      default:
         return (
            <Introduce
               setRegisterType={(type: RegisterType) => {
                  setRegisterType(type)
               }}
            />
         );
      }
   }

   return (
      <>
         {renderContent()}
      </>
   );
}

export default Register;