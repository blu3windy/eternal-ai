import { createContext, useContext, useState, FC, PropsWithChildren, useMemo } from 'react';
import HomeAuthen from "./Home";

interface AuthContextType {
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
   // const [isAuthenticated, setIsAuthenticated] = useState(false);
   const isAuthenticated = true;

   const values = useMemo(() => {
      return {
         isAuthenticated,
      }
   }, [isAuthenticated])

   return (
      <AuthContext.Provider value={values}>
         {
            isAuthenticated
               ? (children)
               : (<HomeAuthen />)
         }
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