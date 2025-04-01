import { Flex, Input, Text } from "@chakra-ui/react";
import BaseButton from "@components/BaseButton";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import styles from "./styles.module.scss";
import { IAgentToken } from "@services/api/agents-token/interface";
import { KeyboardEvent } from "react";
import storageModel from "@storage/StorageModel";

interface IProps {
   agent: IAgentToken;
   environments?: string;
   onSubmit: () => Promise<void>;
}

interface IFormValues {
   value: string;
}

declare module 'yup' {
    interface StringSchema {
        json(message?: string): StringSchema;
    }
}

// Custom validation method for JSON
Yup.addMethod(Yup.string, 'json', function (message) {
   return this.test('json', message || 'Invalid JSON', function (value) {
      const { path, createError } = this;
      if (value === undefined || value === null) {
         return createError({ path, message: message || 'Value is required' });
      }
      try {
         // Attempt to parse the JSON
         const parsed = JSON.parse(value);
         // Check if the parsed result is an object (not null, array, etc.)
         if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
            throw new Error('Parsed JSON is not an object');
         }
         return true; // Valid JSON
      } catch (e) {
         console.log("e", e);
         return createError({ path, message: message || 'Invalid JSON' });
      }
   });
});

const SetupEnvModel = ({ agent, onSubmit, environments }: IProps) => {
   const formatJson = (jsonString: string) => {
      try {
         const jsonObject = JSON.parse(jsonString);
         return JSON.stringify(jsonObject, null, 2); // Indent with 2 spaces
      } catch (e) {
         return jsonString; // Return the original string if parsing fails
      }
   };

   const validationSchema = Yup.object().shape({
      value: Yup.string()
         .json("Please provide a valid JSON string"), // Use the custom JSON validation
   });

   const _onSubmit = async (values: IFormValues) => {
      await storageModel.setEnvironment({
         contractAddress: agent.agent_contract_address,
         chainId: agent.network_id
      }, values.value);      
      await onSubmit();
   }

   const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Tab') {
         event.preventDefault(); // Prevent the default tab behavior
      }
   };

   return (
      <Flex
         flexDirection="column"
         gap="16px"
         marginTop="20px"
      >
         <Formik
            initialValues={{ value: environments || "" } as IFormValues}
            validationSchema={validationSchema}
            onSubmit={_onSubmit}
         >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => {
               const isError = errors.value && touched.value;
               return (
                  <Form onSubmit={handleSubmit}>
                     <Text
                        color="gray.500"
                        fontSize="14px"
                        fontWeight="500"
                        marginBottom="4px"
                     >
                        Enter the environment variables required to configure the agent.
                     </Text>
                     <Input
                        name="value"
                        value={formatJson(values.value)}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown} // Handle key down event
                        placeholder='Enter JSON (e.g., {"key": "value"})'
                        className={styles.input}
                        as="textarea" // Use textarea for better editing experience
                     />
                     {isError && <Text color="red.400" fontSize="12px" marginTop="0px">{errors.value}</Text>}
                     <BaseButton 
                        type="submit" 
                        marginTop="16px"
                        isDisabled={!values.value} 
                        isLoading={isSubmitting}
                     >  
                        Submit
                     </BaseButton>
                  </Form>
               )
            }}
         </Formik>
      </Flex>
   )
}

export default SetupEnvModel;