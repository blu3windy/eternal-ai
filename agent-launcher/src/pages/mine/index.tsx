import MainLayout from "../../components/layout";
import { Box, Button, Flex, HStack, Image, Text, useClipboard, useToast, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ROUTERS from "@constants/route-path";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { useContext, useMemo, useState } from "react";
import { getTokenIconUrl, formatName, parseSymbolName } from "@utils/string";
import ERC20Balance from "@components/ERC20Balance";
import { useSelector } from "react-redux";
import { agentsTradeSelector } from "@stores/states/agent-trade/selector";
import { IToken } from "@interfaces/token";
import { formatCurrency, formatLongAddress } from "@utils/format";
import s from "./styles.module.scss";
import { useAuth } from "@pages/authen/provider";

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

const Mine = () => {
  const navigate = useNavigate();
  const { selectedAgent } = useContext(AgentContext);
  const { signer } = useAuth();

  const { onCopy } = useClipboard(signer?.address || "");
  const toast = useToast();


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

  const tokenIcon = useMemo(() => {
    return getTokenIconUrl(selectedAgent);
  }, [selectedAgent]);

  return (
    <MainLayout>
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

        <Box bg="white" borderRadius="12px" p={6}>
          <Flex justify="space-between" align="center" mb={6}>
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
            <Button>Deposit</Button>
          </Flex>

          <VStack align="start" spacing={4} mb={8}>
            <Text fontSize="48px" fontWeight="500">
              {selectedAgent?.balance || "0"} {selectedAgent?.token_symbol}
            </Text>
            <Text fontSize="16px" fontWeight={400} color="#000" opacity={0.7}>
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
