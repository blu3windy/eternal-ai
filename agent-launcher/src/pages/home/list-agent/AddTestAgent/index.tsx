import { Box, Flex, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import InputText from "@components/Input/InputText";
import STORAGE_KEYS from "@constants/storage-key";
import CAgentTokenAPI from "@services/api/agents-token";
import installAgentStorage from "@storage/InstallAgentStorage";
import localStorageService from "@storage/LocalStorageService";
import { ErrorMessage, Form, Formik } from "formik";
import uniq from "lodash.uniq";
import * as Yup from "yup";

interface IAddTestAgent {
   onAddAgentSuccess: (address: string) => void;
}

const AddTestAgent = (props: IAddTestAgent) => {

   const cPumpAPI = new CAgentTokenAPI();

   const onSubmit = async (values: { contractAddress: string }) => {
      try {
         const data = await cPumpAPI.saveAgentInstalled({ contract_address: [values.contractAddress] });
         await installAgentStorage.addAgent(data);
         props.onAddAgentSuccess(values.contractAddress);
      } catch (error) {
         console.log(error);
      }
   };

   const validationSchema = Yup.object().shape({
      contractAddress: Yup.string()
         .test("is-valid-address", "Invalid address", (address) => {
            if (!address) return false;
            try {
               // Check if it matches Ethereum address format (0x followed by 40 hexadecimal characters)
               const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
               return ethereumAddressRegex.test(address);
            } catch (error) {
               return false;
            }
         })
         .required("Contract address is required"),
   });

   return (
      <Flex
         flexDirection="column"
         alignItems="center"
         justifyContent="center"
         w={'100%'}      
         mt={'-16px'}   
      >
         <Text
            fontSize="22px"
            fontWeight="600"
            color="#000"
            whiteSpace="pre-wrap"
            textAlign={'left'}
            mt={'-20px'}
            w={'100%'}
         >
            Add your agent for preview
         </Text>
         <Box w={'100%'}>
            <Formik
               initialValues={{ contractAddress: '' }}
               validationSchema={validationSchema}
               onSubmit={onSubmit}
            >
               {({ dirty, setFieldValue, isSubmitting }) => (
                  <Form>
                     <Flex flexDirection="column" w={'100%'} marginTop="20px">
                        <InputText
                           name="contractAddress"
                           autoFocus={false}
                           header={{
                              label: "Paste the contract address of your agent below",
                              fontSize: '14px',
                           }}
                           placeholder="0x1d3d...a1ca"
                           onChange={(e) =>
                              setFieldValue('contractAddress', e.target.value)
                           }
                           height={'44px'}
                        />
                        <ErrorMessage
                           name="contractAddress"
                           render={(msg) => (
                              <Text
                                 fontSize="12px"
                                 color="red"
                                 textAlign="left"
                              >
                                 {msg}
                              </Text>
                           )}
                        />
                        
                        <BaseButton
                           type="submit"
                           width="100% !important"
                           marginTop="32px"
                           disabled={!dirty || isSubmitting}
                           isLoading={isSubmitting}
                        >
                           Add
                        </BaseButton>
                     </Flex>
                  </Form>
               )}
            </Formik>
         </Box>
      </Flex>
   );
}

export default AddTestAgent;