import { Box, Button, Flex, HStack, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Text, useClipboard, useToast, VStack } from "@chakra-ui/react";
import ERC20Balance from "@components/ERC20Balance";
import useERC20Balance from '@components/ERC20Balance/useERC20Balance';
import { CHAIN_INFO, CHAIN_TYPE } from '@constants/chains';
import ROUTERS from "@constants/route-path";
import { NATIVE_TOKEN_ADDRESS } from '@contract/token/constants';
import { IToken } from "@interfaces/token";
import { useAuth } from "@pages/authen/provider";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { ChainIdToChainType } from '@pages/home/trade-agent/provider/constant';
import FundAgentProvider from "@providers/FundAgent";
import useFundAgent from "@providers/FundAgent/useFundAgent";
import CAgentTokenAPI from '@services/api/agents-token/index.ts';
import { IAgentToken } from '@services/api/agents-token/interface.ts';
import installAgentStorage from '@storage/InstallAgentStorage.ts';
import { agentsTradeSelector } from "@stores/states/agent-trade/selector";
import { formatCurrency, formatLongAddress } from "@utils/format";
import { formatName, getTokenIconUrl, parseSymbolName, TOKEN_ICON_DEFAULT } from "@utils/string";
import { useContext, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout";
import s from "./styles.module.scss";
import BaseModal from '@components/BaseModal';
import ExportPrivateKey from '@pages/home/chat-agent/ExportPrivateKey';
import { useDisclosure } from '@chakra-ui/react';
import ImportToken from '@components/AgentWallet/ImportToken';
import { AgentType } from "@pages/home/list-agent/constants";
import localStorageService from '@storage/LocalStorageService';

const MIN_DECIMAL = 2;
const MAX_DECIMAL = 2;

const TokenItem = ({ token, index }: { token: IToken & { icon: string, price_usd: string | number }, index: number }) => {
  const { currentChain } = useSelector(agentsTradeSelector);
  const [balance, setBalance] = useState<string | undefined>("0");
  const { coinPrices } = useContext(AgentContext);

  const priceUsd = useMemo(() => {
    if (token.symbol === 'EAI') {
      return coinPrices?.find(p => p.symbol === "EAI")?.price || 0;
    }
    return token?.price_usd || 0;
  }, [coinPrices, token?.symbol]);

  const usdValue = useMemo(() => {
    return Number(balance || 0) * (priceUsd || 0);
  }, [balance, priceUsd]);

  return (
    <HStack
      className={s.tokenItem}
      justify="space-between"
      width="100%"
      p={4}
      borderRadius="8px"
    >
      <HStack spacing={2}>
        <Image
          borderRadius="full"
          width="24px"
          height="24px"
          src={token.icon}
        />
        <VStack align="start" spacing={0}>
          <Text fontSize="14px" fontWeight={500}>{token.symbol}</Text>
          <Text fontSize="12px" color="gray.600">{token.name}</Text>
        </VStack>
      </HStack>
      <VStack align="end" spacing={0}>
        <Flex alignItems="center">
          <ERC20Balance
            token={token}
            maxDecimal={5}
            onBalanceChange={(_amount) => setBalance(_amount)}
            chain={currentChain}
          />
          &nbsp;
          <Text fontWeight={500} fontSize="14px">
            {formatName(parseSymbolName(token)?.symbol as string, 50)}
          </Text>
        </Flex>
        <Text fontSize="12px" color="gray.600">
          ${formatCurrency(usdValue, MIN_DECIMAL, MAX_DECIMAL)}
        </Text>
      </VStack>
    </HStack>
  );
};

const HandleMine = () => {
  const navigate = useNavigate();
  const { coinPrices } = useContext(AgentContext);
  const { signer } = useAuth();
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const { isOpen: isImportModalOpen, onOpen: onImportModalOpen, onClose: onImportModalClose } = useDisclosure();

  const { onCopy } = useClipboard(signer?.address || "");
  const toast = useToast();

  const chainType = CHAIN_TYPE.BASE;

  const chainConfig = CHAIN_INFO[chainType];

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
    walletAddress: signer?.address,
  });

  const usdValue = useMemo(() => {
    return Number(nativeBalance || 0) * (coinPrices?.[nativeToken?.symbol as string] || 0);
  }, [nativeBalance, coinPrices, nativeToken?.symbol]);

  const [installedAgents, setInstalledAgents] = useState<IAgentToken[]>([]);
  const [agentTokens, setAgentTokens] = useState<(IToken & { icon: string, price_usd: string | number })[]>([]);
  const cPumpAPI = useMemo(() => new CAgentTokenAPI(), []);

  const { depositInfo, setDepositInfo } = useFundAgent();

  const [importedTokens, setImportedTokens] = useState<IToken[]>([]);

  const loadImportedTokens = async () => {
    if (!signer?.address) return;
    
    try {
      const storageKey = `imported_tokens_user_${signer.address}`;
      const existingTokensStr = await localStorageService.getItem(storageKey);
      const existingTokens: IToken[] = existingTokensStr ? JSON.parse(existingTokensStr) : [];
      
      const tokensWithIcons = existingTokens.map(token => ({
        ...token,
        icon: getTokenIconUrl(token) || TOKEN_ICON_DEFAULT,
        price_usd: 0
      }));
      
      setImportedTokens(tokensWithIcons);
    } catch (error) {
      console.error('Error loading imported tokens:', error);
    }
  };

  useEffect(() => {
    loadImportedTokens();
  }, [signer?.address]);

  const userTokens: any[] = useMemo(() => {
    return [
      {
        symbol: "ETH",
        name: "Ethereum",
        icon: getTokenIconUrl({ symbol: "ETH" }),
        address: NATIVE_TOKEN_ADDRESS,
        price_usd: 0
      },
      {
        symbol: "EAI",
        name: "Eternal AI",
        icon: getTokenIconUrl({ symbol: "EAI" }),
        address: "",
        price_usd: 0
      },
      ...agentTokens,
      ...importedTokens
    ];
  }, [agentTokens, importedTokens]);

  useEffect(() => {
    const fetchInstalledAgents = async () => {
      try {
        const installIds = await installAgentStorage.getAgentIds();

        console.log('installIds', installIds);
        if (installIds.length === 0) return;

        const params: any = {
          page: 1,
          limit: 100,
          ids: installIds.join(','),
          agent_types: [
            AgentType.Model,
            AgentType.ModelOnline,
            AgentType.UtilityJS,
            AgentType.UtilityPython,
            AgentType.CustomUI,
            AgentType.CustomPrompt,
            AgentType.Infra
          ].join(','),
        };
        
        const { agents } = await cPumpAPI.getAgentTokenList(params);
        setInstalledAgents(agents);
        
        const tokens = agents
          .filter(agent => agent.token_address && agent.token_symbol)
          .map(agent => ({
            address: agent.token_address,
            name: agent.token_name || agent.display_name || agent.agent_name,
            symbol: agent.token_symbol,
            icon: getTokenIconUrl({
              symbol: agent.token_symbol,
              logo: agent.token_image_url,
              icon: agent.token_image_url,
              image_url: agent.token_image_url
            }) || TOKEN_ICON_DEFAULT,
            chain: agent.token_network_id ? ChainIdToChainType[agent.token_network_id] : CHAIN_TYPE.BASE,
            price_usd: agent.meme?.price_usd || 0,
          }));
        
        setAgentTokens(tokens);
      } catch (error) {
        console.error('Error fetching installed agents:', error);
      }
    };

    fetchInstalledAgents();
  }, [cPumpAPI]);

  const handleCopy = () => {
    onCopy();
    toast({
      description: "Address copied to clipboard",
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom",
    });
  };

  const handleBack = () => {
    navigate(ROUTERS.HOME);
  };

  const handleDeposit = () => {
    setDepositInfo({
      address: signer?.address || "",
      networkName: chainConfig?.name || ''
    });
  };

  const handleTransfer = () => {
    // onTransferModalOpen();
  };

  const handleExportPrvKey = () => {
    onModalOpen();
  };

  const handleImportToken = () => {
    onImportModalOpen();
  };

  const userAddress = useMemo(() => {
    return signer?.address || '';
  }, [signer?.address]);

  return (
    <FundAgentProvider>
      <Box className={s.container}>
        <Box mb={6}>
          <Button variant="ghost" onClick={handleBack} leftIcon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 5L7.5 10L12.5 15" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>

          } fontSize={'14px'} fontWeight={400} bg={'transparent !important'}>
            Back
          </Button>
        </Box>

        <Box>
          <Flex justifyContent={'space-between'} alignItems={'center'}>
            <Flex direction={'column'}>
              <HStack gap={0}>
                <Text fontSize={'14px'} fontWeight={400} color={'black'}>{formatLongAddress(signer?.address)}</Text>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleCopy}
                  bg={'transparent !important'}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.00104 4.39948V2.59987C5.00104 2.44077 5.06424 2.2882 5.17674 2.1757C5.28924 2.0632 5.44182 2 5.60091 2H12.7994C12.9584 2 13.111 2.0632 13.2235 2.1757C13.336 2.2882 13.3992 2.44077 13.3992 2.59987V10.998C13.3992 11.1571 13.336 11.3097 13.2235 11.4222C13.111 11.5347 12.9584 11.5979 12.7994 11.5979H10.9997V13.3975C10.9997 13.7287 10.7298 13.9974 10.3957 13.9974H3.20563C3.1265 13.998 3.04805 13.9828 2.97478 13.9529C2.90152 13.923 2.83489 13.879 2.77874 13.8232C2.72259 13.7674 2.67803 13.7011 2.64762 13.6281C2.61721 13.555 2.60156 13.4767 2.60156 13.3975L2.60336 4.99935C2.60336 4.66822 2.8733 4.39948 3.20683 4.39948H5.00104ZM6.20078 4.39948H10.9997V10.3982H12.1995V3.19974H6.20078V4.39948Z" fill="black" fill-opacity="0.4" />
                  </svg>

                </Button>
              </HStack>
              <VStack align="start" spacing={'12px'}>
                <Text fontSize="48px" fontWeight="500">
                  {Number(nativeBalance) === 0 || !nativeBalance
                    ? "0"
                    : formatCurrency(nativeBalance, MIN_DECIMAL, MAX_DECIMAL)} {nativeToken?.symbol}
                </Text>
                <Text fontSize="16px" fontWeight={400} color="#000" opacity={0.7}>
                  ${formatCurrency(usdValue, MIN_DECIMAL, MIN_DECIMAL)}
                </Text>
              </VStack>
            </Flex>

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
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="40" height="40" rx="20" fill="white" />
                      <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="black" stroke-opacity="0.15" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M15.666 20C15.666 19.4477 15.2183 19 14.666 19C14.1137 19 13.666 19.4477 13.666 20C13.666 20.5523 14.1137 21 14.666 21C15.2183 21 15.666 20.5523 15.666 20ZM26.3327 20C26.3327 19.4477 25.885 19 25.3327 19C24.7804 19 24.3327 19.4477 24.3327 20C24.3327 20.5523 24.7804 21 25.3327 21C25.885 21 26.3327 20.5523 26.3327 20ZM20.9994 20C20.9994 19.4477 20.5516 19 19.9994 19C19.4471 19 18.9994 19.4477 18.9994 20C18.9994 20.5523 19.4471 21 19.9994 21C20.5516 21 20.9994 20.5523 20.9994 20Z" fill="black" />
                    </svg>
                  }
                  variant="ghost"
                  bg={'transparent !important'}
                />
                <MenuList>
                  <MenuItem onClick={handleExportPrvKey}>Export Private Key</MenuItem>
                  <MenuItem onClick={handleImportToken}>Import Token</MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>

          <VStack spacing={2} align="stretch" mt={'48px'}>
            {userTokens.map((token, index) => (
              <TokenItem
                key={`${token.address}_${index}`}
                token={token}
                index={index}
              />
            ))}
          </VStack>
        </Box>
      </Box>
      <BaseModal 
        isShow={isModalOpen} 
        onHide={onModalClose} 
        title={'Export private key'} 
        size="small"
        className={s.modalContent}
      >
        <ExportPrivateKey privateKey={signer?.privateKey || ''} />
      </BaseModal>
      <BaseModal 
        isShow={isImportModalOpen} 
        onHide={onImportModalClose} 
        title={'Import Token'} 
        size="small"
        className={s.modalContent}
      >
        <ImportToken 
          onClose={() => {
            onImportModalClose();
            loadImportedTokens();
          }}
          pairs={userTokens}
          storageKey={`imported_tokens_user_${userAddress}`}
          currentChain={CHAIN_TYPE.BASE}
        />
      </BaseModal>
    </FundAgentProvider>
  );
};

const Mine = () => {
  return (
    <MainLayout className={s.layoutContainer}>
      <HandleMine />
    </MainLayout>
  );
};

export default Mine;
