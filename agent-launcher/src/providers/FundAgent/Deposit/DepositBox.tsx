import React from 'react';
import { Box, Center, Flex, Image, Text } from '@chakra-ui/react';
import QRCodeGenerator from '@components/QRCodeGenerator';
import s from './styles.module.scss';
import copy from 'copy-to-clipboard';
import toast from 'react-hot-toast';
import { IFundAgent } from "../types.ts";
import Loading from "@components/Loading";
import useFundAgent from '../useFundAgent.ts';
import AgentAPI from "../../../services/api/agent";

interface IExplorer {
  name: string;
  url: string;
  icon: string;
}

interface ISupportedNetwork {
  network: string;
  key: string;
  icon: string;
  name: string;
  explorer?: IExplorer[]
}

const SUPPORTED_NETWORK: ISupportedNetwork[] = [
   /*{
    network: "ETH",
    name: "Ethereum",
    key: "tip_eth_address",
    icon: "/icons/coins/ic-eth.svg",
    explorer: [
      {
        name: "EtherScan",
        url: "https://etherscan.io/address",
        icon: "/icons/coins/ic-ether-scan.png"
      },
    ]
  }, {
    network: "BASE",
    name: "Base",
    key: "tip_eth_address",
    icon: "/icons/coins/ic-eth.svg",
    explorer: [
      {
        name: "BaseScan",
        url: "https://basescan.org/address",
        icon: "/icons/coins/ic-base-scan.png"
      },
    ]
  }, {
    network: "BTC",
    name: "Bitcoin",
    key: "tip_btc_address",
    icon: "/icons/coins/ic-btc.svg",
    explorer: [
      {
        name: "Mempool",
        url: "https://mempool.space/address",
        icon: "/icons/coins/ic-mempool.png"
      },
    ]
  }, */{
      network: "SOL",
      name: "Solana",
      key: "tip_sol_address",
      icon: "/icons/blockchains/ic_solana.svg",
      explorer: [
         {
            name: "SolScan",
            url: "https://solscan.io/address",
            icon: "/icons/blockchains/ic_solana.svg"
         },
      ]
   },
]

const DepositBox: React.FC<IFundAgent> = ({ agentID }) => {
   const { depositAgentInfo, setDepositAgentInfo } = useFundAgent();
   const [network, setNetwork] = React.useState<ISupportedNetwork>(SUPPORTED_NETWORK[0]);
   console.log('depositAgentInfo', depositAgentInfo);
   console.log('agentID', agentID);

   const tipAddressByToken = React.useMemo(() => {
      return (depositAgentInfo as unknown as any)?.[network.key] || ''
   }, [depositAgentInfo, network?.key]);

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

   const renderToken = (_network: ISupportedNetwork) => {
      const isActive = _network.network === network.network;

      return (
         <Flex
            key={_network.network}
            flexDirection="row"
            gap="8px"
            padding="6px 12px"
            borderRadius="120px"
            border={`1px solid ${isActive ? '#5400FB' : '#E5E7EB'}`}
            background={isActive ? 'linear-gradient(0deg, rgba(84, 0, 251, 0.10) 0%, rgba(84, 0, 251, 0.10) 100%), #FFF': '#FFFFFF'}
            _hover={{ opacity: 0.8, cursor: 'pointer' }}
            onClick={() => setNetwork(_network)}
         >
            <Image src={_network.icon} h="24px" w="24px" />
            <Text color="#black">{_network.network}</Text>
         </Flex>
      );
   }

   const renderExplorer = (explorer: IExplorer) => {
      return (
         <Flex
            key={explorer.name}
            as='a'
            alignItems='center'
            gap='8px'
            padding='6px 8px'
            href={`${explorer.url}/${tipAddressByToken}`}
            target='_blank'
            rel='noreferrer'
            border="1px solid #E5E7EB"
            bg="#FFF"
            borderRadius="1000px"
            width="fit-content"
            _hover={{ cursor: 'pointer', opacity: 0.8 }}

         >
            <Image src={explorer.icon} h='20px' w='20px' />
            <Text color='#000' fontSize='14px' fontWeight='500'>
               {explorer.name}
            </Text>
            <svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 14 14' fill='none'>
               <path d='M2.91683 11.0834L11.0835 2.91671' stroke='#6B7280' stroke-width='1.2' stroke-linecap='round'
                  stroke-linejoin='round' />
               <path d='M4.0835 2.91663L11.0835 2.91663L11.0835 9.91663' stroke='#6B7280' stroke-width='1.2'
                  stroke-linecap='round' stroke-linejoin='round' />
            </svg>
         </Flex>
      )
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
            border='1px solid rgba(229, 231, 235, 1)'
            padding='20px'
            bg='rgba(248, 249, 250, 1)'
            borderRadius='12px'
            gap='28px'
         >
            <Flex flexDirection="column" gap="12px">
               <Text color="#6B7280" fontSize="14px">
            Network
               </Text>
               <Flex gap="8px" alignItems="center">
                  {SUPPORTED_NETWORK.map(renderToken)}
               </Flex>
            </Flex>
            <Flex flexDirection="column" gap="12px">
               <Text color="#6B7280" fontSize="14px">
            Please send any token on the <Text as="span" fontWeight="500" color="black">{network?.name} network</Text> to the wallet address below. Thank you for your support!
               </Text>
               <Flex flex={1} flexDirection="column" gap="12px">
                  <Box className={s.addressBox}>
                     <Flex width="100%">
                        <p className={s.address}>{tipAddressByToken || ''} </p>
                     </Flex>
                     <Image
                        h={'16px'}
                        src={`/icons/ic-copy.svg`}
                        className={s.addressBox_iconCopy}
                        onClick={() => onClickCopy(tipAddressByToken || '')}
                     />
                  </Box>
               </Flex>
            </Flex>
            <Flex flex={1} flexDirection="column" gap="12px">
               <Box className={s.wrapQR}>
                  <QRCodeGenerator
                     bgColor="#FFFFFF"
                     size={'100%' as unknown as number}
                     value={tipAddressByToken}
                  />
               </Box>
               <Flex gap="8px" justifyContent="center">
                  {network?.explorer?.map(renderExplorer)}
               </Flex>
            </Flex>
         </Flex>
      );
   };

   return <Flex flex={1}>{renderContent()}</Flex>;
};

export default DepositBox;
