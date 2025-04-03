import {
    Box,
    Flex,
    HStack,
    Image,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    useDisclosure,
    useToast,
    VStack
} from '@chakra-ui/react';
import BaseButton from "@components/BaseButton";
import InputText from '@components/Input/InputText';
import { CHAIN_CONFIG, CHAIN_TYPE } from '@constants/chains';
import { NATIVE_TOKEN_ADDRESS } from '@contract/token/constants';
import { IToken } from '@interfaces/token';
import { AgentContext } from '@pages/home/provider/AgentContext';
import { AgentTradeContext } from '@pages/home/trade-agent/provider';
import { ChainIdToChainType } from '@pages/home/trade-agent/provider/constant';
import localStorageService from '@storage/LocalStorageService';
import { agentsTradeSelector } from '@stores/states/agent-trade/selector';
import { getTokenIconUrl, TOKEN_ICON_DEFAULT } from '@utils/string';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from "yup";
import s from './styles.module.scss';
import ERC20Balance from '@components/ERC20Balance';

interface TransferTokenFormValues {
  token: string;
  amount: string;
  toAddress: string;
}

const STORAGE_KEY_PREFIX = 'imported_tokens_';

const TokenItem = ({ token, index, showUsdValue = false, onClick }: { token: IToken & { icon: string }, index: number, showUsdValue?: boolean, onClick?: () => void }) => {
  const { currentChain } = useSelector(agentsTradeSelector);
  const [balance, setBalance] = useState<string | undefined>("0");
  const { selectedAgent, coinPrices } = useContext(AgentContext);

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
    <HStack 
      key={index} 
      justify="space-between" 
      cursor="pointer" 
      onClick={onClick}
      p={2}
      borderRadius="8px"
      _hover={{ bg: 'gray.100' }}
    >
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
            {token.symbol}
          </Text>
        </Flex>
        {showUsdValue ? <Text fontSize={'12px'} fontWeight={400} color={'#000'} opacity={0.6}>${usdValue.toFixed(2)}</Text> : <Text>&nbsp;</Text>}
      </VStack>
    </HStack>
  )
}

const TransferTokenForm = ({ 
  values, 
  isSubmitting, 
  setFieldValue, 
  dirty,
  touched,
  errors,
  handleBlur,
  tokens
}: { 
  values: TransferTokenFormValues, 
  isSubmitting: boolean,
  setFieldValue: (field: string, value: any) => void,
  dirty: boolean,
  touched: { [key: string]: boolean },
  errors: { [key: string]: string },
  handleBlur: (e: React.FocusEvent<any>) => void,
  tokens: IToken[]
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { pairs } = useContext(AgentTradeContext);
  const isSubmitDisabled = !values.token || 
                          !values.amount || 
                          !values.toAddress || 
                          isSubmitting || 
                          !dirty;

  const selectedToken = useMemo(() => {
    return tokens.find(token => token.address === values.token);
  }, [tokens, values.token]);

  return (
    <Form>
      <VStack spacing={4} align="stretch">
        <Box>
          <Text fontSize="14px" fontWeight="500" mb="8px">Select Token</Text>
          <Popover isOpen={isOpen} onClose={onClose} placement="bottom-start">
            <PopoverTrigger>
              <Flex 
                border="1px solid" 
                borderColor={touched.token && errors.token ? "red.500" : "gray.200"} 
                borderRadius="8px" 
                p="10px 16px" 
                justify="space-between" 
                align="center"
                cursor="pointer"
                onClick={onOpen}
              >
                {selectedToken ? (
                  <HStack>
                    <Image
                      borderRadius={"100px"}
                      width={"24px"}
                      height={"24px"}
                      src={selectedToken.icon}
                    />
                    <Text fontSize={'14px'} fontWeight={500}>{selectedToken.symbol}</Text>
                  </HStack>
                ) : (
                  <Text fontSize={'14px'} color="gray.500">Select token to transfer</Text>
                )}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="#686A6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Flex>
            </PopoverTrigger>
            <PopoverContent width="400px" maxHeight="300px" overflowY="auto">
              <PopoverBody p={0}>
                <VStack align="stretch" spacing={0}>
                  {tokens.map((token, index) => {
                    const isImportedToken = !pairs.some(p => p.address === token.address);
                    return (
                      <TokenItem 
                        key={index}
                        token={{...token, icon: token.icon || ''}} 
                        index={index} 
                        showUsdValue={!isImportedToken}
                        onClick={() => {
                          setFieldValue('token', token.address);
                          onClose();
                        }}
                      />
                    );
                  })}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
          {touched.token && errors.token && (
            <Text fontSize="12px" color="red" textAlign="left" mt="4px">
              {errors.token}
            </Text>
          )}
        </Box>

        <Box>
          <InputText
            name="amount"
            header={{
              label: "Amount",
              fontSize: '14px',
            }}
            placeholder="Enter amount to transfer"
            value={values.amount}
            onChange={(e) => setFieldValue('amount', e.target.value)}
            onBlur={handleBlur}
            height={'44px'}
            type="number"
            isInvalid={touched.amount && !!errors.amount}
          />
          {touched.amount && errors.amount && (
            <Text fontSize="12px" color="red" textAlign="left">
              {errors.amount}
            </Text>
          )}
        </Box>

        <Box>
          <InputText
            name="toAddress"
            header={{
              label: "To Address",
              fontSize: '14px',
            }}
            placeholder="Enter recipient address"
            value={values.toAddress}
            onChange={(e) => setFieldValue('toAddress', e.target.value)}
            onBlur={handleBlur}
            height={'44px'}
            isInvalid={touched.toAddress && !!errors.toAddress}
          />
          {touched.toAddress && errors.toAddress && (
            <Text fontSize="12px" color="red" textAlign="left">
              {errors.toAddress}
            </Text>
          )}
        </Box>

        <BaseButton
          type="submit"
          width="100% !important"
          marginTop="32px"
          disabled={isSubmitDisabled}
          isLoading={isSubmitting}
        >
          Transfer
        </BaseButton>
      </VStack>
    </Form>
  );
};

const TransferToken = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  const { selectedAgent } = useContext(AgentContext);
  const { pairs } = useContext(AgentTradeContext);
  const [importedTokens, setImportedTokens] = useState<IToken[]>([]);
  const { currentChain } = useSelector(agentsTradeSelector);

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
      icon: getTokenIconUrl({ symbol: chainConfig?.nativeCurrency?.symbol || "ETH" }) || TOKEN_ICON_DEFAULT
    }
  }, [chainConfig]);

  useEffect(() => {
    const loadImportedTokens = async () => {
      if (!selectedAgent?.id) return;
      
      try {
        const storageKey = `${STORAGE_KEY_PREFIX}${selectedAgent.id}`;
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

    return [nativeToken, ...pairTokens, ...importedTokens];
  }, [pairs, selectedAgent, importedTokens, nativeToken]);

  const validationSchema = Yup.object().shape({
    token: Yup.string()
      .required('Token is required'),
    amount: Yup.number()
      .required('Amount is required')
      .min(0, 'Amount must be greater than 0'),
    toAddress: Yup.string()
      .required('Recipient address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format')
  });

  const handleSubmit = async (values: TransferTokenFormValues) => {
    try {
      // TODO: Implement transfer logic
      console.log('Transfer values:', values);

      toast({
        title: "Transfer initiated",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error('Error transferring token:', error);
      toast({
        title: "Error transferring token",
        description: "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box className={s.container}>
      <Formik
        initialValues={{
          token: '',
          amount: '',
          toAddress: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue, dirty, touched, errors, handleBlur }) => (
          <TransferTokenForm 
            values={values} 
            isSubmitting={isSubmitting} 
            setFieldValue={setFieldValue}
            dirty={dirty}
            touched={touched}
            errors={errors}
            handleBlur={handleBlur}
            tokens={tokens}
          />
        )}
      </Formik>
    </Box>
  );
};

export default TransferToken; 