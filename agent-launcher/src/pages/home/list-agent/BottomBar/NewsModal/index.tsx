import { Box, Flex, Text } from "@chakra-ui/react";
import BaseModal from "@components/BaseModal";
import { MonitorContext } from "@providers/Monitor/MonitorContext";
import { useContext } from "react";
import NewsItem from "./NewsItem";
import styles from "./styles.module.scss";
import { AgentContext } from "@pages/home/provider/AgentContext";

function NewsModal({
   isOpen,
   setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
   const { updateAgents } = useContext(MonitorContext);
   const { handleUpdateCode } = useContext(AgentContext);

   const handleUpdateAll = async () => {
      try {
         await Promise.all(updateAgents.map(agent => handleUpdateCode(agent)));
         setIsOpen(false);
      } catch (error) {
         console.error('Error updating agents:', error);
      }
   };

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
            <Flex justifyContent="space-between" alignItems="center" mt="2" mb="4">
               <Text fontSize="22px" fontWeight="600" color="white">
                  Updates
               </Text>
               {updateAgents?.length > 0 && (
                  <Box
                     as="button"
                     px="8px"
                     py="4px"
                     bg="rgba(255, 255, 255, 0.1)"
                     color="white"
                     borderRadius="8px"
                     fontSize="14px"
                     fontWeight="500"
                     transition="all 0.2s"
                     border="1px solid rgba(255, 255, 255, 0.2)"
                     _hover={{
                        bg: 'rgba(255, 255, 255, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                     }}
                     _active={{
                        transform: 'scale(0.98)'
                     }}
                     onClick={handleUpdateAll}
                  >
                     Update All
                  </Box>
               )}
            </Flex>

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
