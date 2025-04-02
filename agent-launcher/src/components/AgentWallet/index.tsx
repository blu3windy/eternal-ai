import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useClipboard,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import BaseModal from '@components/BaseModal';
import ERC20Balance from '@components/ERC20Balance';
import { IToken } from '@interfaces/token';
import ExportPrivateKey from '@pages/home/chat-agent/ExportPrivateKey';
import { AgentContext } from '@pages/home/provider/AgentContext';
import { AgentTradeContext } from '@pages/home/trade-agent/provider';
import { agentsTradeSelector } from '@stores/states/agent-trade/selector';
import { formatName, getTokenIconUrl, parseSymbolName } from '@utils/string';
import React, { useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import s from './styles.module.scss';

interface Props {
  color?: string;
}

const TokenItem = ({ token, index }: { token: IToken & { icon: string }, index: number }) => {
  const { currentChain } = useSelector(agentsTradeSelector);
  const [balance, setBalance] = useState<string | undefined>("0");
  const [usdValue, setUsdValue] = useState<string | undefined>("0");
  
  return (
    <HStack key={index} justify="space-between">
      <HStack>
      <Image
        borderRadius={"100px"}
        width={"24px"}
        height={"24px"}
        src={token.icon}
      />
        <VStack align="start" spacing={0}>
          <Text fontSize={'14px'} fontWeight={500} color={'#000'}>{token?.symbol}</Text>
          <Text fontSize={'12px'} fontWeight={400} color={'#000'} opacity={0.6}>{token?.name}</Text>
        </VStack>
      </HStack>
      <VStack align="end" spacing={0}>
        <Flex>
        <ERC20Balance
              token={token}
              maxDecimal={5}
              onBalanceChange={(_amount) => setBalance(_amount)}
              chain={currentChain}
            />
            &nbsp;
            <Text color={"#000"} fontWeight={500} fontSize={"14px"}>
              {formatName(parseSymbolName(token)?.symbol as string, 50)}
            </Text>
        </Flex>
        <Text fontSize={'12px'} fontWeight={400} color={'#000'} opacity={0.6}>${usdValue?.toLocaleString()}</Text>
      </VStack>
    </HStack>
  )
}
const AgentWallet: React.FC<Props> = ({ color }) => {
  const { agentWallet, selectedAgent } = useContext(AgentContext);
  const { pairs } = useContext(AgentTradeContext);

  const { onCopy: onCopyAddress } = useClipboard(agentWallet?.address || '');
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const toast = useToast();

  const handleExportPrvKey = () => {
    onModalOpen();
  };

  const handleCopyAddress = () => {
    onCopyAddress();
    toast({
      description: "Address copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };

  const balance = {
    btc: 0,
    usd: 0,
  };

  const tokens = useMemo(() => {
    return pairs.map(p => {
      return {
        ...p,
        icon: p.symbol === 'EAI' ? getTokenIconUrl(p) : getTokenIconUrl(selectedAgent)
      }
    })
  }, [pairs]);

  const WalletContent = () => (
    <Box className={s.walletCard}>
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" align="center">
          <HStack>
            <Text fontSize={'14px'} fontWeight={400} color={'#000'} opacity={0.6}>Address: </Text>
            <Text fontSize={'14px'} fontWeight={400} color={'#000'}>{(agentWallet?.address || '').slice(0, 10)}...{(agentWallet?.address || '').slice(-4)}</Text>
            <Box cursor={'pointer'} onClick={handleCopyAddress}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.5">
                  <path d="M5.00104 4.39948V2.59987C5.00104 2.44077 5.06424 2.2882 5.17674 2.1757C5.28924 2.0632 5.44182 2 5.60091 2H12.7994C12.9584 2 13.111 2.0632 13.2235 2.1757C13.336 2.2882 13.3992 2.44077 13.3992 2.59987V10.998C13.3992 11.1571 13.336 11.3097 13.2235 11.4222C13.111 11.5347 12.9584 11.5979 12.7994 11.5979H10.9997V13.3975C10.9997 13.7287 10.7298 13.9974 10.3957 13.9974H3.20563C3.1265 13.998 3.04805 13.9828 2.97478 13.9529C2.90152 13.923 2.83489 13.879 2.77874 13.8232C2.72259 13.7674 2.67803 13.7011 2.64762 13.6281C2.61721 13.555 2.60156 13.4767 2.60156 13.3975L2.60336 4.99935C2.60336 4.66822 2.8733 4.39948 3.20683 4.39948H5.00104ZM6.20078 4.39948H10.9997V10.3982H12.1995V3.19974H6.20078V4.39948Z" fill="black" />
                </g>
              </svg>
            </Box>
          </HStack>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.0197 5.5C11.1907 5.5 10.5146 4.829 10.5146 4C10.5146 3.171 11.1816 2.5 12.0096 2.5H12.0197C12.8487 2.5 13.5197 3.171 13.5197 4C13.5197 4.829 12.8487 5.5 12.0197 5.5ZM13.5197 12C13.5197 11.171 12.8487 10.5 12.0197 10.5H12.0096C11.1816 10.5 10.5146 11.171 10.5146 12C10.5146 12.829 11.1907 13.5 12.0197 13.5C12.8487 13.5 13.5197 12.829 13.5197 12ZM13.5197 20C13.5197 19.171 12.8487 18.5 12.0197 18.5H12.0096C11.1816 18.5 10.5146 19.171 10.5146 20C10.5146 20.829 11.1907 21.5 12.0197 21.5C12.8487 21.5 13.5197 20.829 13.5197 20Z" fill="#686A6C" />
                </svg>

              }
              variant="ghost"
            />
            <MenuList>
              <MenuItem onClick={handleExportPrvKey}>Export Private Key</MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <VStack align="stretch" spacing={1}>
          <Text fontSize="24px" fontWeight="500" color="#000">
            {balance.btc.toLocaleString()} EAI
          </Text>
          <Text fontSize={'14px'} fontWeight={400} color={'#000'} opacity={0.6}>
            ${balance.usd.toLocaleString()}
          </Text>
        </VStack>

        <VStack align="stretch" spacing={3}>
          {tokens.map((token, index) => (
            <TokenItem token={token} index={index} />
          ))}
        </VStack>
      </VStack>
    </Box>
  );

  return (
    <>
      <Popover placement="bottom-end">
        <PopoverTrigger>
          <Button className={s.btnWallet}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={color || 'currentColor'}>
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272c0 8.8-7.2 16-16 16H304c-8.8 0-16-7.2-16-16s7.2-16 16-16H400c8.8 0 16 7.2 16 16z" />
            </svg>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverBody p={0}>
            <WalletContent />
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <BaseModal isShow={isModalOpen} onHide={onModalClose} title={'Export private key'} size="small" className={s.modalContent}>
        <ExportPrivateKey />
      </BaseModal>
    </>
  );
};

export default AgentWallet; 