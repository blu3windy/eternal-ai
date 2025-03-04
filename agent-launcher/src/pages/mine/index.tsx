import MainLayout from "../../components/layout";
import { Box, Text } from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import ROUTERS from "@constants/route-path.ts";

const Mine = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(ROUTERS.HOME);
  };

   return (
      <MainLayout>
         <Box>Mine</Box>
        <Text onClick={handleBack}>Back</Text>
      </MainLayout>
   );
};

export default Mine;
