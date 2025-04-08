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
import ERC20Balance from '@components/ERC20Balance';
import InputWrapper from '@components/Form/inputWrapper';
import InputText from '@components/Input/InputText';
import { CHAIN_TYPE } from '@constants/chains';
import CTokenContract from '@contract/token';
import { NATIVE_TOKEN_ADDRESS } from '@contract/token/constants';
import { IToken } from '@interfaces/token';
import { AgentContext } from '@pages/home/provider/AgentContext';
import { getExplorerByChain } from '@utils/helpers';
import { BigNumber, Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { Form, Formik } from 'formik';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as Yup from "yup";
import s from './styles.module.scss';

interface TransferTokenFormValues {
    network: number;
    token: string;
    amount: string;
    toAddress: string;
}

interface TransferTokenProps {
    onClose: () => void;
    availableNetworks: {
        id: number,
        name: string,
        network: string,
        nativeCurrency: { name: string, symbol: string, decimals: number },
        rpcUrls: {
          default: { http: string[] },
          public: { http: string[] },
        },
      }[];
    tokens: IToken[];
    pairs: IToken[];
    currentChain: CHAIN_TYPE;
    wallet: Wallet;
}

const TokenItem = ({ token, index, showUsdValue = false, onClick, currentChain }: { token: IToken & { icon: string }, index: number, showUsdValue?: boolean, onClick?: () => void, currentChain: CHAIN_TYPE }) => {
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
    availableNetworks,
    tokens,
    selectedTokenBalance,
    estimatedFee,
    isNativeToken,
    pairs,
    currentChain,
    wallet,
}: {
    values: TransferTokenFormValues;
    isSubmitting: boolean;
    setFieldValue: (field: string, value: any) => void;
    dirty: boolean;
    touched: { [key: string]: boolean };
    errors: { [key: string]: string };
    handleBlur: (e: React.FocusEvent<any>) => void;
    availableNetworks: TransferTokenProps['availableNetworks'];
    tokens: IToken[];
    selectedTokenBalance: string;
    estimatedFee: string;
    isNativeToken: boolean;
    pairs: IToken[];
    currentChain: CHAIN_TYPE;
    wallet: Wallet;
}) => {
    const { isOpen: isTokenOpen, onOpen: onTokenOpen, onClose: onTokenClose } = useDisclosure();
    const { isOpen: isNetworkOpen, onOpen: onNetworkOpen, onClose: onNetworkClose } = useDisclosure();

    const selectedNetwork = useMemo(() => {
        return availableNetworks.find(network => network.id === values.network);
    }, [availableNetworks, values.network]);

    const selectedToken = useMemo(() => {
        return tokens.find(token => token.address === values.token);
    }, [tokens, values.token]);

    const isSubmitDisabled = !values.token ||
        !values.amount ||
        !values.toAddress ||
        isSubmitting ||
        !dirty ||
        BigNumber.from(parseEther(values.amount || "0")).gt(BigNumber.from(parseEther(selectedTokenBalance || "0")));

    return (
        <Form>
            <VStack spacing={4} align="stretch">
                <Box>
                    <Text fontSize="14px" fontWeight="500" mb="8px">Select Network</Text>
                    <Popover isOpen={isNetworkOpen} onClose={onNetworkClose} placement="bottom-start">
                        <PopoverTrigger>
                            <Flex
                                border="1px solid"
                                borderColor={touched.network && errors.network ? "red.500" : "gray.200"}
                                borderRadius="8px"
                                p="10px 16px"
                                justify="space-between"
                                align="center"
                                cursor="pointer"
                                onClick={onNetworkOpen}
                            >
                                {selectedNetwork ? (
                                    <HStack>
                                        <Text fontSize={'14px'} fontWeight={500}>{selectedNetwork.name}</Text>
                                    </HStack>
                                ) : (
                                    <Text fontSize={'14px'} color="gray.500">Select network</Text>
                                )}
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 7.5L10 12.5L15 7.5" stroke="#686A6C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </Flex>
                        </PopoverTrigger>
                        <PopoverContent width="89%" maxHeight="300px" overflowY="auto">
                            <PopoverBody p={0}>
                                <VStack align="stretch" spacing={0}>
                                    {availableNetworks.map((network, index) => (
                                        <HStack
                                            key={index}
                                            justify="space-between"
                                            cursor="pointer"
                                            onClick={() => {
                                                setFieldValue('network', network.id);
                                                onNetworkClose();
                                            }}
                                            p={2}
                                            borderRadius="8px"
                                            _hover={{ bg: 'gray.100' }}
                                        >
                                            <HStack>
                                                <Text fontSize={'14px'} fontWeight={500}>{network.name}</Text>
                                            </HStack>
                                        </HStack>
                                    ))}
                                </VStack>
                            </PopoverBody>
                        </PopoverContent>
                    </Popover>
                    {touched.network && errors.network && (
                        <Text fontSize="12px" color="red" textAlign="left" mt="4px">
                            {errors.network}
                        </Text>
                    )}
                </Box>

                <Box>
                    <Text fontSize="14px" fontWeight="500" mb="8px">Select Token</Text>
                    <Popover isOpen={isTokenOpen} onClose={onTokenClose} placement="bottom-start">
                        <PopoverTrigger>
                            <Flex
                                border="1px solid"
                                borderColor={touched.token && errors.token ? "red.500" : "gray.200"}
                                borderRadius="8px"
                                p="10px 16px"
                                justify="space-between"
                                align="center"
                                cursor="pointer"
                                onClick={onTokenOpen}
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
                        <PopoverContent width="89%" maxHeight="300px" overflowY="auto">
                            <PopoverBody p={0}>
                                <VStack align="stretch" spacing={0}>
                                    {tokens.map((token, index) => {
                                        const isImportedToken = !pairs.some(p => p.address === token.address);
                                        return (
                                            <TokenItem
                                                key={index}
                                                token={{ ...token, icon: token.icon || '' }}
                                                index={index}
                                                showUsdValue={!isImportedToken}
                                                onClick={() => {
                                                    setFieldValue('token', token.address);
                                                    onTokenClose();
                                                }}
                                                currentChain={currentChain}
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

                <Box mb={"-12px"}>
                    <InputWrapper
                        label="Amount"
                        rightLabel={selectedToken ? (
                            <Text fontSize="12px" color="gray.500">
                                Balance: {selectedTokenBalance} {selectedToken.symbol}
                            </Text>
                        ) : undefined}
                    >
                        <InputText
                            name="amount"
                            header={{
                                label: "",
                                fontSize: '14px'
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
                    </InputWrapper>
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

                {selectedToken && values.amount && (
                    <Box>
                        <Text fontSize="12px" color="gray.500">
                            Estimated Fee: {estimatedFee} {isNativeToken ? selectedToken.symbol : selectedNetwork?.nativeCurrency.symbol}
                        </Text>
                    </Box>
                )}

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

const TransferToken: React.FC<TransferTokenProps> = ({ onClose, availableNetworks, tokens, pairs, currentChain, wallet }) => {
    const toast = useToast();
    const { selectedAgent } = useContext(AgentContext);
    const [selectedTokenBalance, setSelectedTokenBalance] = useState<string>("0");
    const [estimatedFee, setEstimatedFee] = useState<string>("0");
    const [isNativeToken, setIsNativeToken] = useState<boolean>(false);
    const cTokenContract = useRef(new CTokenContract()).current;

    const validationSchema = Yup.object().shape({
        network: Yup.number()
            .required('Network is required')
            .oneOf(availableNetworks.map(n => n.id), 'Invalid network'),
        token: Yup.string()
            .required('Token is required'),
        amount: Yup.number()
            .required('Amount is required')
            .min(0, 'Amount must be greater than 0')
            .test('balance', 'Insufficient balance', function (value) {
                if (!value || !selectedTokenBalance) return true;
                const amount = BigNumber.from(parseEther(value.toString()));
                const balance = BigNumber.from(parseEther(selectedTokenBalance));

                // Only check fee against balance for native token
                if (isNativeToken) {
                    const fee = BigNumber.from(parseEther(estimatedFee));
                    return amount.add(fee).lte(balance);
                }

                return amount.lte(balance);
            }),
        toAddress: Yup.string()
            .required('Recipient address is required')
            .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid address format')
    });

    const handleSubmit = async (values: TransferTokenFormValues) => {
        try {
            console.log('Transfer values:', values);

            if (!wallet?.privateKey) {
                throw new Error('Private key not available');
            }

            const txHash = await cTokenContract.transferToken({
                to: values.toAddress,
                amount: values.amount,
                tokenAddress: values.token,
                chain: currentChain,
                privateKey: wallet.privateKey
            });

            const explorerUrl = getExplorerByChain({
                chainId: selectedAgent?.network_id || "",
                type: "tx",
                address: txHash
            });

            toast({
                title: "Transfer initiated",
                description: (
                    <Text>
                        Transaction hash:{" "}
                        <a
                            href={explorerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "blue", textDecoration: "underline" }}
                        >
                            {txHash}
                        </a>
                    </Text>
                ),
                status: "success",
                duration: 5000,
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
                    network: availableNetworks[0].id,
                    token: '',
                    amount: '',
                    toAddress: '',
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, isSubmitting, setFieldValue, dirty, touched, errors, handleBlur }) => {
                    // Update balance when token changes
                    useEffect(() => {
                        const updateBalance = async () => {
                            if (!values.token) {
                                setSelectedTokenBalance("0");
                                return;
                            }

                            try {
                                const balance = await cTokenContract.getTokenBalance(
                                    values.token,
                                    currentChain,
                                    wallet.address
                                );
                                setSelectedTokenBalance(balance || "0");
                            } catch (error) {
                                console.error('Error fetching balance:', error);
                                setSelectedTokenBalance("0");
                            }
                        };

                        updateBalance();
                    }, [values.token, currentChain, wallet.address]);

                    // Update fee when amount changes
                    useEffect(() => {
                        const updateFee = async () => {
                            if (!values.token || !values.amount || !values.toAddress) {
                                setEstimatedFee("0");
                                return;
                            }

                            try {
                                if (!wallet.address) {
                                    setEstimatedFee("0");
                                    return;
                                }

                                const fee = await cTokenContract.getEstimateGas({
                                    from: wallet.address,
                                    to: values.toAddress,
                                    transferAmount: values.amount,
                                    tokenAddress: values.token,
                                    chain: currentChain
                                });

                                setEstimatedFee(fee);
                            } catch (error) {
                                console.error('Error estimating fee:', error);
                                setEstimatedFee("0");
                            }
                        };

                        updateFee();
                    }, [values.token, values.amount, values.toAddress, wallet.address, currentChain]);

                    // Update isNativeToken when token changes
                    useEffect(() => {
                        if (!values.token) {
                            setIsNativeToken(false);
                            return;
                        }
                        setIsNativeToken(values.token === NATIVE_TOKEN_ADDRESS);
                    }, [values.token]);

                    return (
                        <TransferTokenForm
                            values={values}
                            isSubmitting={isSubmitting}
                            setFieldValue={setFieldValue}
                            dirty={dirty}
                            touched={touched}
                            errors={errors}
                            handleBlur={handleBlur}
                            availableNetworks={availableNetworks}
                            tokens={tokens}
                            selectedTokenBalance={selectedTokenBalance}
                            estimatedFee={estimatedFee}
                            isNativeToken={isNativeToken}
                            pairs={pairs}
                            currentChain={currentChain}
                            wallet={wallet}
                        />
                    );
                }}
            </Formik>
        </Box>
    );
};

export default TransferToken; 