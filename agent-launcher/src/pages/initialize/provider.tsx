import {
   createContext,
   FC,
   PropsWithChildren,
   useEffect,
   useRef,
   useState,
} from "react";
import localStorageService from "@storage/LocalStorageService.ts";
import { Center, Image } from "@chakra-ui/react";
import BackgroundWrapper from "@components/BackgroundWrapper";
import LoadingText from "@components/LoadingText";
interface InitializeContextType {
  isInitialized: boolean;
}

const InitializeContext = createContext<InitializeContextType | undefined>(undefined);

const InitializeProvider: FC<PropsWithChildren> = ({ children }) => {
   const initRef = useRef<boolean>(false);
   const [isInitialized, setIsInitialized] = useState<boolean>(false);


   const initialize = async () => {
      await localStorageService.initialize();
      setIsInitialized(true);
   }

   useEffect(() => {
      if (!initRef?.current) {
         initRef.current = true;
         initialize();
      }
   }, []);

  
   return (
      <InitializeContext.Provider value={{ isInitialized }}>
         {
            isInitialized ? children : (
               <BackgroundWrapper>
                  <Center w="100%" h="100%" flexDirection="column" gap="12px">
                     <Image
                        src="icons/eai-loading.gif"
                        alt="loading"
                        width="80px"
                        mixBlendMode="exclusion"
                     />
                     <LoadingText 
                        dataText={`Initializing`}
                     />
                  </Center>
               </BackgroundWrapper>
            )
         }
      </InitializeContext.Provider>
   );
};


export { InitializeProvider };
