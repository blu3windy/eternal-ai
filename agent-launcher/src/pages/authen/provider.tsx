import { createContext, useContext, useState, FC, PropsWithChildren, useMemo, useEffect } from 'react';
import HomeAuthen from "./Home";
import { Wallet } from "ethers";

interface AuthContextType {
   signer: Wallet | undefined;
}

const TESTING_AUTHEN_FLAG = false;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
   const [loading, setLoading] = useState(true);
   const [signer, setSigner] = useState<Wallet | undefined>();

   useEffect(() => {
      setInterval(() => {
         setLoading(false)
      }, 0)
   }, []);

   const values = useMemo(() => {
      return {
         signer,
      }
   }, [signer]);

   if (TESTING_AUTHEN_FLAG) {
      return (
         <AuthContext.Provider value={values}>
            {loading
               ? <div>Loading...</div>
               : signer
                  ? (children)
                  : (<HomeAuthen />)
            }
         </AuthContext.Provider>
      );
   } else {
      return (
         <AuthContext.Provider value={values}>
            {/* <HomeAuthen /> */}
            {children}
         </AuthContext.Provider>
      );
   }
};

const useAuth = () => {
   const context = useContext(AuthContext);
   if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
   }
   return context;
};

export { AuthProvider, useAuth };