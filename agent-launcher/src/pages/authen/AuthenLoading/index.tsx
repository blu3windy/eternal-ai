import { Center, Image } from "@chakra-ui/react";

const AuthenLoading = () => {
   return (
      <Center
         background="linear-gradient(180deg, #E4E5D8 0%, #CBD6E8 100%)"
         width="100dvw"
         height="100dvh"
      >
         <Image src="icons/eai-loading.gif" alt="loading" width="50px" />
      </Center>
   )
};

export default AuthenLoading;