import { createContext, useContext, useState, FC, PropsWithChildren, useMemo, useEffect } from 'react';
import HomeAuthen from "./Home";
import { Wallet } from "ethers";
import EaiSigner from "../../helpers/signer";
import sleep from "@utils/sleep.ts";
import TestingButton from "@pages/authen/TesingButton";
import ForgotPass from "@pages/authen/ForgotPass";
import useStarter from "@pages/authen/hooks/useStarter.ts";
import Starter from "@pages/authen/Starter";

interface AuthContextType {
   signer: Wallet | undefined;
   hasUser: boolean;
   onLogin: (pass: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
   const [signer, setSigner] = useState<Wallet | undefined>();
   const [hasUser, setHasUser] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(true);
   const { checking } = useStarter();

   const onLogin = async (pass: string) => {
      try {
         const prvKey = await EaiSigner.getStorageKey({ pass });
         if (prvKey) {
            const _signer = new Wallet(prvKey);
            setSigner(_signer);
            setHasUser(true);
         }
      } catch (error) {
         console.error(error);
      }
   }

   const onCheckHasUser = async () => {
      try {
         setLoading(true);
         const hasUser = await EaiSigner.hasUser();
         setHasUser(hasUser);
      } catch (error) {
         console.error(error);
      } finally {
         await sleep(500)
         setLoading(false);
      }
   }

   const values = useMemo(() => {
      return {
         signer,
         hasUser,
         onLogin
      }
   }, [signer, hasUser]);


   const renderContent = () => {
      if (checking || loading) {
         return (
            <Starter
               loadingUser={loading}
               onCheckHasUser={onCheckHasUser}
            />
         )
      }

      if (!checking) {
         if (signer) {
            return children;
         } else {
            return <HomeAuthen />;
         }
      }

      return <></>
   }

   return (
      <AuthContext.Provider value={values}>
         {renderContent()}
         <TestingButton />
         <ForgotPass />
      </AuthContext.Provider>
   );
};

const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};

export { AuthProvider, useAuth };