import { createContext, useContext, useState, FC, PropsWithChildren, useMemo, useEffect } from 'react';
import HomeAuthen from "./Home";

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState(false);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      setInterval(() => {
         setLoading(false)
      }, 0)
   }, []);

   const values = useMemo(() => {
      return {
         isAuthenticated,
      }
   }, [isAuthenticated]);

   // return (
   //    <AuthContext.Provider value={values}>
   //       {loading
   //          ? <div>Loading...</div>
   //          : isAuthenticated
   //             ? (children)
   //             : (<HomeAuthen />)
   //       }
   //    </AuthContext.Provider>
   // );
   return (
      <AuthContext.Provider value={values}>
         {/* <HomeAuthen /> */}
         {children}
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