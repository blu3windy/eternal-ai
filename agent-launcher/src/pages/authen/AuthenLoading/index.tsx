import { Center } from "@chakra-ui/react";
import AppLoading from "@components/AppLoading";

const AuthenLoading = () => {
   return (
      <Center
         background="linear-gradient(180deg, #E4E5D8 0%, #CBD6E8 100%)"
         width="100dvw"
         height="100dvh"
      >
         <AppLoading />
      </Center>
   )
};

export default AuthenLoading;