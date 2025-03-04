import React, {useContext} from 'react';
import {Center, Divider, Flex, Image, Text} from '@chakra-ui/react';
import QRCodeGenerator from '@components/QRCodeGenerator';
import s from './styles.module.scss';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import {IFundAgent} from "../types.ts";
import Loading from "@components/Loading";
import useFundAgent from '../useFundAgent.ts';
import AgentAPI from "../../../services/api/agent";
import {AgentContext} from "@pages/home/provider";

interface IExplorer {
  name: string;
  url: string;
  icon: string;
}

const DepositBox: React.FC<IFundAgent> = ({ agentID }) => {
   const { depositAgentInfo, setDepositAgentInfo } = useFundAgent();
   const { agentWallet } = useContext(AgentContext);

   const getDepositAddress = async () => {
      if (!agentID) {
         setDepositAgentInfo(undefined);
         return;
      }
      try {
         const agent = await AgentAPI.getAgent(agentID);
         setDepositAgentInfo(agent);
      } catch (error) {
         setDepositAgentInfo(undefined);
      }
   };

   const onClickCopy = (address: string) => {
      copy(address);
      toast.success('Copied.');
   };

   React.useEffect(() => {
      getDepositAddress();
   }, [agentID]);

   const handleShowTransaction = () => {

   }

   const renderContent = () => {
      if (!depositAgentInfo || !agentID) {
         return (
            <Center flex={1} minHeight='150px'>
               <Loading />
            </Center>
         );
      }

      return (
         <Flex
            flex={1}
            flexDirection='column'
            border='1px solid #E5E7EB'
            padding='20px'
            bg='#F8F9FA'
            borderRadius='12px'
            gap='24px'
            mt={"20px"}
         >
            <Flex direction={"column"} gap={"12px"}>
               <Text color="#000" fontSize="16px">
                  Send <Text as={"span"} fontSize={"16px"} fontWeight={500} color={"#000"}>any amount EAI or more</Text> to the below wallet. Sending less won’t work!
               </Text>

               <Flex flexDirection="column" gap="12px" className={s.addressBox}>
                  <Flex flexDirection="column" gap="4px">
                     <Text color="#000" fontSize="13px" fontWeight={400}>
                        Network
                     </Text>
                     <Text color="#000" fontSize="16px" fontWeight={500} textTransform={"capitalize"}>
                        {depositAgentInfo?.network_name?.toLowerCase()}
                     </Text>
                  </Flex>
                  <Divider variant="dashed" />
                  <Flex direction={"column"} gap={"4px"}>
                     <Text color="#000" fontSize="13px" fontWeight={400}>
                        Wallet
                     </Text>
                     <Flex alignItems={"center"} justifyContent={"space-between"}>
                        <Text color="#000" fontSize="16px" fontWeight={500} w={"100%"}>
                           {agentWallet?.address}
                        </Text>
                        <Image
                          h={'16px'}
                          src={`/icons/ic-copy.svg`}
                          className={s.addressBox_iconCopy}
                          onClick={() => onClickCopy(agentWallet?.address || '')}
                        />
                     </Flex>
                  </Flex>
               </Flex>
            </Flex>
            <Flex flex={1} flexDirection="column" gap="12px">
               <Flex className={s.wrapQR}>
                  <QRCodeGenerator
                     bgColor="#FFFFFF"
                     size={'100%' as unknown as number}
                     value={agentWallet?.address as string}
                  />
               </Flex>
            </Flex>
            <Text fontSize={'14px'} fontWeight={400} cursor={"pointer"} onClick={handleShowTransaction}>Transaction History</Text>
         </Flex>
      );
   };

   return <Flex flex={1}>{renderContent()}</Flex>;
};

export default DepositBox;
