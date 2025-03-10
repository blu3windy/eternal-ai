import Loggers from "@components/Loggers";
import STORAGE_KEYS from "@constants/storage-key.ts";
import GenericContract from "@contract/common/index.ts";
import ForgotPass from "@pages/authen/ForgotPass";
import useStarter from "@pages/authen/hooks/useStarter.ts";
import Starter from "@pages/authen/Starter";
import AgentAPI from "@services/api/agent";
import eaiCrypto from "@utils/crypto";
import sleep from "@utils/sleep.ts";
import { ethers, Wallet } from "ethers";
import { parseEther } from "ethers/lib/utils";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { BASE_CHAIN_ID } from "../../config.ts";
import EaiSigner from "../../helpers/signer";
import localStorageService from "../../storage/LocalStorageService.ts";
import HomeAuthen from "./Home";

interface IReqAgentSecretKey {
  chainId: string;
  agentName: string;
}

type Transaction = {
  to: string;
  value?: string;
  data: string;
  wait?: boolean;
  chainId?: number;
};
interface AuthContextType {
  signer: Wallet | undefined;
  hasUser: boolean;
  onLogin: (pass: string) => Promise<void>;
  genAgentSecretKey: (_: IReqAgentSecretKey) => Promise<string>;
  getAuthenToken: (_: string) => Promise<string>;
  sendTransaction: (tx: Transaction) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const baseContract = useRef(new GenericContract()).current;
  const [signer, setSigner] = useState<Wallet | undefined>();
  const [hasUser, setHasUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const { checking } = useStarter();

  useEffect(() => {
    if (signer) {
      const getAndSaveAuthen = async () => {
        const authenToken = await getAuthenToken(signer.privateKey);

        if (authenToken) {
          localStorageService.setItem(STORAGE_KEYS.AUTHEN_TOKEN, authenToken);
          localStorageService.setItem(
            STORAGE_KEYS.WALLET_ADDRESS,
            signer.address
          );
        }
      };

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
  };

  const onCheckHasUser = async () => {
    try {
      setLoading(true);
      const hasUser = await EaiSigner.hasUser();
      setHasUser(hasUser);
    } catch (error) {
      console.error(error);
    } finally {
      await sleep(500);
      setLoading(false);
    }
  };

  const genAgentSecretKey = async (params: {
    chainId: string;
    agentName: string;
  }) => {
    const signature = await signer?.signMessage(
      `This message generate secret key for agent ${params.agentName} networkId ${params.chainId}`
    );
    // derive signature to private key
    return eaiCrypto.derivePrivateKeyFromSignature(signature || "");
  };

  const getAuthenToken = async (prvKey: string) => {
    const _signer = new ethers.Wallet(prvKey);
    const _message = `Generate authen token for ${_signer?.address} in `;
    let _signature = await _signer.signMessage(_message);
    _signature = _signature.startsWith("0x")
      ? _signature.replace("0x", "")
      : _signature;

    const authenCode: string = await AgentAPI.getAuthenToken({
      signature: _signature,
      message: _message,
      address: _signer.address,
    });

    return authenCode;
  };

  const sendTransaction = async (params: Transaction) => {
    try {
      const { to, value, data, wait = true, chainId = BASE_CHAIN_ID } = params;
      console.log("params", params);

      console.log(
        "baseContract.getRPCByChainID(chainId)",
        baseContract.getRPCByChainID(chainId)
      );

      const _wallet = new ethers.Wallet(
        signer?.privateKey,
        new ethers.providers.JsonRpcProvider(
          baseContract.getRPCByChainID(chainId)
        )
      );

      const txResponse = await _wallet.sendTransaction({
        to,
        value: value ? parseEther(value) : undefined,
        data,
      });
      const hash = txResponse.hash;
      console.log("Transaction sent! Hash:", txResponse.hash);

      if (wait) {
        await txResponse.wait();
      }

      return hash;
    } catch (error) {
      console.log("errorerrorerror", error);
      throw error;
    }
  };

  const values = useMemo(() => {
    return {
      signer,
      hasUser,
      onLogin,
      genAgentSecretKey,
      getAuthenToken,
      sendTransaction,
    };
  }, [signer, hasUser]);

  const renderContent = () => {
    if (checking || loading) {
      return <Starter loadingUser={loading} onCheckHasUser={onCheckHasUser} />;
    }

    if (!checking) {
      if (signer) {
        return children;
      } else {
        return <HomeAuthen />;
      }
    }

    return <></>;
  };

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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
