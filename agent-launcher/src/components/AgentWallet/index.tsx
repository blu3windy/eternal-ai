import {
  Box,
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
  VStack
} from '@chakra-ui/react';
import BaseModal from '@components/BaseModal';
import ERC20Balance from '@components/ERC20Balance';
import useERC20Balance from '@components/ERC20Balance/useERC20Balance';
import { CHAIN_CONFIG, CHAIN_TYPE, MAX_DECIMAL, MIN_DECIMAL } from '@constants/chains';
import { NATIVE_TOKEN_ADDRESS } from '@contract/token/constants';
import { IToken } from '@interfaces/token';
import ExportPrivateKey from '@pages/home/chat-agent/ExportPrivateKey';
import { AgentContext } from '@pages/home/provider/AgentContext';
import { AgentTradeContext } from '@pages/home/trade-agent/provider';
import { ChainIdToChainType } from '@pages/home/trade-agent/provider/constant';
import { agentsTradeSelector } from '@stores/states/agent-trade/selector';
import { formatCurrency } from '@utils/format';
import { formatName, getTokenIconUrl, parseSymbolName, TOKEN_ICON_DEFAULT } from '@utils/string';
import React, { useContext, useMemo, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import s from './styles.module.scss';
import ImportToken from './ImportToken/index';
import TransferToken from './TransferToken/index';
import useFundAgent from '@providers/FundAgent/useFundAgent';
import localStorageService from '@storage/LocalStorageService';

interface Props {
  color?: string;
}

const TokenItem = ({ token, index, showUsdValue = false }: { token: IToken & { icon: string }, index: number, showUsdValue?: boolean }) => {
  const { currentChain } = useSelector(agentsTradeSelector);
  const [balance, setBalance] = useState<string | undefined>("0");
  const { agentWallet, selectedAgent, coinPrices } = useContext(AgentContext);

  const priceUsd = useMemo(() => {
    if (token.symbol === selectedAgent?.token_symbol) {
      return selectedAgent?.meme?.price_usd || 0;
    }
    if (token.symbol === 'EAI') {
      return coinPrices?.[token.symbol] || 0;
    }
    return 0;
  }, [coinPrices, token?.symbol, selectedAgent?.meme?.price_usd, selectedAgent?.token_symbol]);

  const usdValue = useMemo(() => {
    return Number(balance || 0) * (priceUsd || 0);
  }, [balance, priceUsd]);

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
        {showUsdValue ? <Text fontSize={'12px'} fontWeight={400} color={'#000'} opacity={0.6}>${formatCurrency(usdValue, MIN_DECIMAL, MAX_DECIMAL)}</Text> : <Text>&nbsp;</Text>}
      </VStack>
    </HStack>
  )
}
const AgentWallet: React.FC<Props> = ({ color }) => {
  const { agentWallet, selectedAgent, coinPrices } = useContext(AgentContext);
  const { pairs } = useContext(AgentTradeContext);

  const { onCopy: onCopyAddress } = useClipboard(agentWallet?.address || '');
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isImportModalOpen, onOpen: onImportModalOpen, onClose: onImportModalClose } = useDisclosure();
  const { isOpen: isTransferModalOpen, onOpen: onTransferModalOpen, onClose: onTransferModalClose } = useDisclosure();
  const toast = useToast();

  const [importedTokens, setImportedTokens] = useState<IToken[]>([]);

  const { setDepositAgentID } = useFundAgent();

  const chainType = useMemo(() => {
    if (!selectedAgent?.network_id) return CHAIN_TYPE.BASE;
    return ChainIdToChainType[selectedAgent.network_id] || CHAIN_TYPE.BASE;
  }, [selectedAgent?.network_id]);

  const chainConfig = useMemo(() => {
    return CHAIN_CONFIG[chainType];
  }, [chainType]);

  const nativeToken = useMemo(() => {
    return {
      address: NATIVE_TOKEN_ADDRESS,
      name: chainConfig?.nativeCurrency?.name || "Ethereum",
      symbol: chainConfig?.nativeCurrency?.symbol || "ETH",
    }
  }, [chainConfig]);

  const { balance: nativeBalance } = useERC20Balance({
    token: nativeToken,
    chain: chainType,
    walletAddress: agentWallet?.address,
  });

  const usdValue = useMemo(() => {
    return Number(nativeBalance || 0) * (coinPrices?.[nativeToken?.symbol as string] || 0);
  }, [nativeBalance, coinPrices, nativeToken?.symbol]);

  console.log('agentWallet', agentWallet);
  console.log('balanceETH', nativeBalance);
  console.log('nativeToken', nativeToken);
  console.log('coinPrices', coinPrices);
  console.log('=== == ')

  const handleExportPrvKey = () => {
    onModalOpen();
  };

  const handleImportToken = () => {
    onImportModalOpen();
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

  const handleDeposit = () => {
    setDepositAgentID(selectedAgent?.id);
  };

  const handleTransfer = () => {
    onTransferModalOpen();
  };

  
  useEffect(() => {
    const loadImportedTokens = async () => {
      if (!selectedAgent?.id) return;
      
      try {
        const storageKey = `imported_tokens_${selectedAgent.id}`;
        const existingTokensStr = await localStorageService.getItem(storageKey);
        const existingTokens: IToken[] = existingTokensStr ? JSON.parse(existingTokensStr) : [];
        setImportedTokens(existingTokens.map(token => ({
          ...token,
          icon: getTokenIconUrl(token) || TOKEN_ICON_DEFAULT
        })));
      } catch (error) {
        console.error('Error loading imported tokens:', error);
      }
    };

    loadImportedTokens();
  }, [selectedAgent?.id]);

  const tokens = useMemo(() => {
    const pairTokens = pairs.map(p => ({
      ...p,
      icon: p.symbol === 'EAI' ? getTokenIconUrl(p) : getTokenIconUrl(selectedAgent)
    }));

    return [...pairTokens, ...importedTokens];
  }, [pairs, selectedAgent, importedTokens]);

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
              <MenuItem onClick={handleImportToken}>Import Token</MenuItem>
            </MenuList>
          </Menu>
        </HStack>

        <VStack align="stretch" spacing={1}>
          <Text fontSize="24px" fontWeight="500" color="#000">
            {Number(nativeBalance) === 0 || !nativeBalance
              ? "0"
              : formatCurrency(nativeBalance, MIN_DECIMAL, MAX_DECIMAL)} {nativeToken?.symbol}
          </Text>
          <Text fontSize={'14px'} fontWeight={400} color={'#000'} opacity={0.6}>
            ${formatCurrency(usdValue, MIN_DECIMAL, MIN_DECIMAL)}
          </Text>
        </VStack>

        <HStack spacing={3}>
          <Flex className={s.actionButton} onClick={handleDeposit}>
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.05273 7.2002L8.16702 3.2002M8.16702 3.2002L12.2813 7.2002M8.16702 3.2002V12.8002" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <Text fontSize={'14px'} fontWeight={500} color={'#FFF'}>Deposit</Text>
          </Flex>
          <Flex className={s.actionButton} onClick={handleTransfer}>
            <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8332 3.33366V10.0003C13.8332 10.3683 13.5352 10.667 13.1665 10.667C12.7979 10.667 12.4999 10.3683 12.4999 10.0003V4.94303L4.97122 12.4717C4.84122 12.6017 4.67053 12.667 4.49986 12.667C4.3292 12.667 4.15851 12.6017 4.02851 12.4717C3.76784 12.211 3.76784 11.7896 4.02851 11.529L11.5572 4.00033H6.49986C6.1312 4.00033 5.8332 3.70166 5.8332 3.33366C5.8332 2.96566 6.1312 2.66699 6.49986 2.66699H13.1665C13.2532 2.66699 13.3399 2.68493 13.4212 2.71826C13.5846 2.7856 13.7146 2.91561 13.7819 3.07894C13.8159 3.16027 13.8332 3.24699 13.8332 3.33366Z" fill="white" />
            </svg>
            <Text fontSize={'14px'} fontWeight={500} color={'#FFF'}>Transfer</Text>
          </Flex>
        </HStack>

        <VStack align="stretch" spacing={3}>
          {tokens.map((token, index) => {
            const isImportedToken = !pairs.some(p => p.address === token.address);
            
            return (
              <TokenItem 
                key={index}
                token={{...token, icon: token.icon || ''}} 
                index={index} 
                showUsdValue={!isImportedToken}
              />
            );
          })}
        </VStack>
      </VStack>
    </Box>
  );

  return (
    <>
      <Popover placement="bottom-start">
        <PopoverTrigger>
          <Flex fontSize="13px" fontWeight="400" color="#000" cursor={'pointer'} gap={'4px'}>
            <Text as={'span'} opacity={0.7}>Balance: </Text>
            <Text as={'span'}>
              {Number(nativeBalance) === 0 || !nativeBalance
                ? "0"
                : formatCurrency(nativeBalance, MIN_DECIMAL, MAX_DECIMAL)} {nativeToken?.symbol}
            </Text>
            <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8L10 13L15 8" stroke="#686A6C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </Flex>

          {/* <Button className={s.btnWallet}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill={color || 'currentColor'}>
              <path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V192c0-35.3-28.7-64-64-64H80c-8.8 0-16-7.2-16-16s7.2-16 16-16H448c17.7 0 32-14.3 32-32s-14.3-32-32-32H64zM416 272c0 8.8-7.2 16-16 16H304c-8.8 0-16-7.2-16-16s7.2-16 16-16H400c8.8 0 16 7.2 16 16z" />
            </svg>
          </Button> */}
        </PopoverTrigger>
        <PopoverContent minWidth={'400px'} border={'none'}>
          <PopoverBody p={0}>
            <WalletContent />
          </PopoverBody>
        </PopoverContent>
      </Popover>

      <BaseModal isShow={isModalOpen} onHide={onModalClose} title={'Export private key'} size="small" className={s.modalContent}>
        <ExportPrivateKey />
      </BaseModal>

      <BaseModal isShow={isImportModalOpen} onHide={onImportModalClose} title={'Import Token'} size="small" className={s.modalContent}>
        <ImportToken onClose={onImportModalClose} />
      </BaseModal>

      <BaseModal isShow={isTransferModalOpen} onHide={onTransferModalClose} title={'Transfer Token'} size="small" className={s.modalContent}>
        <TransferToken onClose={onTransferModalClose} />
      </BaseModal>
    </>
  );
};

export default AgentWallet; 