import { createContext, useContext, useState, FC, PropsWithChildren, useMemo, useEffect } from 'react';
import HomeAuthen from "./Home";
import { Wallet } from "ethers";
import EaiSigner from "../../helpers/signer";
import sleep from "@utils/sleep.ts";
import AuthenLoading from "@pages/authen/AuthenLoading";

interface AuthContextType {
   signer: Wallet | undefined;
   hasUser: boolean;
   onLogin: (pass: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
   const [initLoading, setInitLoading] = useState<boolean>(true);
   const [signer, setSigner] = useState<Wallet | undefined>();
   const [hasUser, setHasUser] = useState<boolean>(false);

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

   const init = async () => {
      try {
         setInitLoading(true);
         const hasUser = await EaiSigner.hasUser();
         setHasUser(hasUser);
      } catch (error) {
         console.error(error);
      } finally {
         await sleep(1000)
         setInitLoading(false);
      }
   }

   useEffect(() => {
      init().then().catch();
   }, []);

   const values = useMemo(() => {
      return {
         signer,
         hasUser,
         onLogin
      }
   }, [signer, hasUser]);


   const renderContent = () => {
      if (initLoading) {
         return <AuthenLoading/>;
      } else {
         if (signer) {
            return children;
         } else {
            return <HomeAuthen />;
         }
      }
   }

   return (
      <AuthContext.Provider value={values}>
         {renderContent()}
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