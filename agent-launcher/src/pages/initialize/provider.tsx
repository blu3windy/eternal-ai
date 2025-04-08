import {
   createContext,
   FC,
   PropsWithChildren,
   useEffect,
   useState,
} from "react";
import localStorageService from "@storage/LocalStorageService.ts";
import Loading from "@components/Loading";

interface InitializeContextType {
  isInitialized: boolean;
}

const InitializeContext = createContext<InitializeContextType | undefined>(undefined);

const InitializeProvider: FC<PropsWithChildren> = ({ children }) => {
   const [isInitialized, setIsInitialized] = useState<boolean>(false);


   const initialize = async () => {
      await localStorageService.initialize();
      //   setIsInitialized(true);
   }

   useEffect(() => {
      initialize();
   }, []);

  
   return (
      <InitializeContext.Provider value={{ isInitialized }}>
         {
            isInitialized ? children : <><Loading /></>
         }
      </InitializeContext.Provider>
   );
};


export { InitializeProvider };
