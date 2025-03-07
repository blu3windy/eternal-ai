import { createContext, useContext, useState, FC, PropsWithChildren, useMemo, useEffect } from 'react';
import HomeAuthen from "./Home";
import { ethers, Wallet } from "ethers";
import EaiSigner from "../../helpers/signer";
import sleep from "@utils/sleep.ts";
import ForgotPass from "@pages/authen/ForgotPass";
import useStarter from "@pages/authen/hooks/useStarter.ts";
import Starter from "@pages/authen/Starter";
import eaiCrypto from "@utils/crypto";
import AgentAPI from "@services/api/agent";
import Loggers from "@components/Loggers";
import localStorageService from "../../storage/LocalStorageService.ts";
import STORAGE_KEYS from "@constants/storage-key.ts";

interface IReqAgentSecretKey {
   chainId: string;
   agentName: string;
}

interface AuthContextType {
   signer: Wallet | undefined;
   hasUser: boolean;
   onLogin: (pass: string) => Promise<void>;
   genAgentSecretKey: (_: IReqAgentSecretKey) => Promise<string>;
   getAuthenToken: (_: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
   const [signer, setSigner] = useState<Wallet | undefined>();
   const [hasUser, setHasUser] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(true);
   const { checking } = useStarter();

   useEffect(() => {
      if(signer) {
         const getAndSaveAuthen = async () => {
            const authenToken = await getAuthenToken(signer.privateKey);

            if (authenToken) {
               localStorageService.setItem(STORAGE_KEYS.AUTHEN_TOKEN, authenToken);
               localStorageService.setItem(STORAGE_KEYS.WALLET_ADDRESS, signer.address);
            }
         }

         getAndSaveAuthen();
      }
   }, [signer]);

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


   const genAgentSecretKey = async (params: { chainId: string, agentName: string }) => {
      const signature = await signer?.signMessage(`This message generate secret key for agent ${params.agentName} networkId ${params.chainId}`);
      // derive signature to private key
      return eaiCrypto.derivePrivateKeyFromSignature(signature || "");
   }

   const getAuthenToken = async (prvKey: string) => {
      const _signer = new ethers.Wallet(prvKey);
      const _message = `Generate authen token for ${_signer?.address} in `;
      let _signature = await _signer.signMessage(_message);
      _signature = _signature.startsWith("0x")
         ? _signature.replace("0x", "")
         : _signature;

      const authenCode: string = await AgentAPI.getAuthenToken({ signature: _signature, message: _message, address: _signer.address });

      return authenCode;
   }

   const values = useMemo(() => {
      return {
         signer,
         hasUser,
         onLogin,
         genAgentSecretKey,
         getAuthenToken
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
         <ForgotPass />
         <Loggers />
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