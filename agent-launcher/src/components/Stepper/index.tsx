import { compareString } from "@utils/string.ts";
import styles from "./styles.module.scss";
import { Box, Flex, Text } from "@chakra-ui/react";


type IStep = {
    title: string;
    key: string;
}

interface IProps {
    steps: IStep[];
    activeStep: string;
}

const Stepper = ({ steps, activeStep }: IProps) => {
   return (
      <div className={styles.stepper}>
         {steps.map((step, index) => {
            const active = compareString(step.key, activeStep);
            return (
               <Flex
                  key={step.key}
                  flexDirection="column"
                  gap="8px"
               >
                  <Text
                     color="black"
                     fontSize="12px"
                     fontWeight="400"
                     opacity={active ? 1 : 0.4}
                  >
                     {step.title}
                  </Text>
                  <Box
                     width="100%"
                     height="3px"
                     minWidth="120px"
                     backgroundColor="black"
                     borderRadius="1000px"
                     opacity={active ? 1 : 0.1}
                  />
               </Flex>
            )
         })}
      </div>
   );
}

export default Stepper;