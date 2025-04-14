import { Box, Flex, Text } from "@chakra-ui/react";
import BaseModal from "@components/BaseModal";
import { MonitorContext } from "@providers/Monitor/MonitorContext";
import { useContext } from "react";
import NewsItem from "./NewsItem";
import styles from "./styles.module.scss";

function NewsModal({
   isOpen,
   setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
   const { updateAgents } = useContext(MonitorContext);

   return (
      <BaseModal
         isShow={isOpen}
         onHide={() => {
            setIsOpen(false);
         }}
         size="small"
         className={styles.popoverContent}
      >
         <Box className={styles.containerOverview}>
            <Text fontSize="22px" fontWeight="600" mb="4" color="white">
          Updates
            </Text>

            <Box
               bg="rgba(255, 255, 255, 0.10)"
               borderRadius="12px"
               minHeight={"400px"}
               maxHeight={"400px"}
               overflowY={"auto"}
               overflowX={"hidden"}
               className={styles.taskListScroll}
            >
               {updateAgents.length ? (
                  <>
                     {updateAgents.map((agent, index) => (
                        <NewsItem token={agent} />
                     ))}
                  </>
               ) : (
                  <Flex
                     height={"400px"}
                     padding={"16px"}
                     justifyContent={"center"}
                     alignItems={"center"}
                  >
                     <Text
                        color="#fff"
                        fontSize={"16px"}
                        fontWeight={"500"}
                        lineHeight={"150%"}
                     >
                No updates
                     </Text>
                  </Flex>
               )}
            </Box>
         </Box>
      </BaseModal>
   );
}

export default NewsModal;
