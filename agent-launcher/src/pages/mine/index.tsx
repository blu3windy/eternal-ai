import MainLayout from "../../components/layout";
import { Box, Button, Flex, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@constants/route-path";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { useContext, useMemo, useState } from "react";
import { getTokenIconUrl, formatName, parseSymbolName } from "@utils/string";
import ERC20Balance from "@components/ERC20Balance";
import { useSelector } from "react-redux";
import { agentsTradeSelector } from "@stores/states/agent-trade/selector";
import { IToken } from "@interfaces/token";
import { formatCurrency } from "@utils/format";
import styles from "./styles.module.scss";

const MIN_DECIMAL = 2;
const MAX_DECIMAL = 2;

const TokenItem = ({ token, index }: { token: IToken & { icon: string }, index: number }) => {
  const { currentChain } = useSelector(agentsTradeSelector);
  const [balance, setBalance] = useState<string | undefined>("0");
  const { selectedAgent, coinPrices } = useContext(AgentContext);

  const priceUsd = useMemo(() => {
    if (token.symbol === selectedAgent?.token_symbol) {
      return selectedAgent?.meme?.price_usd || 0;
    }
    if (token.symbol === 'EAI') {
      return coinPrices?.find(p => p.symbol === "EAI")?.price || 0;
    }
    return 0;
  }, [coinPrices, token?.symbol, selectedAgent?.meme?.price_usd, selectedAgent?.token_symbol]);

  const usdValue = useMemo(() => {
    return Number(balance || 0) * (priceUsd || 0);
  }, [balance, priceUsd]);

  return (
    <HStack
      className={styles.tokenItem}
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

const Mine = () => {
  const navigate = useNavigate();
  const { selectedAgent } = useContext(AgentContext);
  const { currentChain } = useSelector(agentsTradeSelector);

  const handleBack = () => {
    navigate(ROUTERS.HOME);
  };

  const tokenIcon = useMemo(() => {
    return getTokenIconUrl(selectedAgent);
  }, [selectedAgent]);

  return (
    <MainLayout>
      <Box className={styles.container}>
        <Box mb={6}>
          <Button variant="ghost" onClick={handleBack} leftIcon={
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          }>
            Back
          </Button>
        </Box>

        <Box bg="white" borderRadius="12px" p={6}>
          <Flex justify="space-between" align="center" mb={6}>
            <HStack>
              <Text>{selectedAgent?.address?.slice(0, 6)}...{selectedAgent?.address?.slice(-4)}</Text>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => {
                  navigator.clipboard.writeText(selectedAgent?.address || "");
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M13.3333 6H7.33333C6.59695 6 6 6.59695 6 7.33333V13.3333C6 14.0697 6.59695 14.6667 7.33333 14.6667H13.3333C14.0697 14.6667 14.6667 14.0697 14.6667 13.3333V7.33333C14.6667 6.59695 14.0697 6 13.3333 6Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.33333 10H2.66667C1.93029 10 1.33334 9.40305 1.33334 8.66667V2.66667C1.33334 1.93029 1.93029 1.33334 2.66667 1.33334H8.66667C9.40305 1.33334 10 1.93029 10 2.66667V3.33333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </Button>
            </HStack>
            <Button>Deposit</Button>
          </Flex>

          <VStack align="start" spacing={4} mb={8}>
            <Text fontSize="32px" fontWeight="600">
              {selectedAgent?.balance || "0"} {selectedAgent?.token_symbol}
            </Text>
            <Text fontSize="16px" color="gray.600">
              ${((Number(selectedAgent?.balance || 0) * (selectedAgent?.meme?.price_usd || 0)).toFixed(2))}
            </Text>
          </VStack>

          <VStack spacing={2} align="stretch">
            <TokenItem 
              token={{
                symbol: selectedAgent?.token_symbol,
                name: selectedAgent?.token_name,
                icon: tokenIcon,
                address: selectedAgent?.token_address
              }}
              index={0}
            />
            <TokenItem
              token={{
                symbol: "EAI",
                name: "Eternal AI",
                icon: getTokenIconUrl({ symbol: "EAI" }),
                address: selectedAgent?.eai_token_address
              }}
              index={1}
            />
          </VStack>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default Mine;
