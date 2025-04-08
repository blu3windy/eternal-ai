import { Center, Divider, Flex, Image, Text } from '@chakra-ui/react';
import Loading from "@components/Loading";
import QRCodeGenerator from '@components/QRCodeGenerator';
import copy from 'copy-to-clipboard';
import React from 'react';
import toast from 'react-hot-toast';
import { IDepositInfo } from "../types.ts";
import s from './styles.module.scss';

interface IDepositBoxProps extends IDepositInfo {
}

const DepositBox: React.FC<IDepositBoxProps> = ({ address, networkName }) => {
   const onClickCopy = (address: string) => {
      copy(address);
      toast.success('Copied.');
   };

   const handleShowTransaction = () => {

   }

   const renderContent = () => {
      if (!address) {
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
               <Flex flexDirection="column" gap="12px" className={s.addressBox}>
                  <Flex flexDirection="column" gap="4px">
                     <Text color="#000" fontSize="13px" fontWeight={400}>
                        Network
                     </Text>
                     <Text color="#000" fontSize="16px" fontWeight={500} textTransform={"capitalize"}>
                        {networkName?.toLowerCase()}
                     </Text>
                  </Flex>
                  <Divider variant="dashed" />
                  <Flex direction={"column"} gap={"4px"}>
                     <Text color="#000" fontSize="13px" fontWeight={400}>
                        Wallet
                     </Text>
                     <Flex alignItems={"center"} justifyContent={"space-between"}>
                        <Text color="#000" fontSize="16px" fontWeight={500} w={"100%"}>
                           {address}
                        </Text>
                        <Image
                           h={'16px'}
                           src={`icons/ic-copy.svg`}
                           className={s.addressBox_iconCopy}
                           onClick={() => onClickCopy(address || '')}
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
                     value={address}
                  />
               </Flex>
            </Flex>
            {/* <Text fontSize={'14px'} fontWeight={400} cursor={"pointer"} onClick={handleShowTransaction}>Transaction History</Text> */}
         </Flex>
      );
   };

   return <Flex flex={1}>{renderContent()}</Flex>;
};

export default DepositBox;
