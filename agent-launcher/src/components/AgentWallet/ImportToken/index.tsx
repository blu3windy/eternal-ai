import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    useToast,
    VStack
} from '@chakra-ui/react';
import CAgentTradeContract from "@contract/agent-trade";
import { useDebounce } from '@hooks/useDebounce';
import { IToken } from '@interfaces/token';
import { AgentContext } from '@pages/home/provider/AgentContext';
import { AgentTradeContext } from '@pages/home/trade-agent/provider';
import localStorageService from '@storage/LocalStorageService';
import { agentsTradeSelector } from '@stores/states/agent-trade/selector';
import { compareString } from '@utils/string';
import { Field, Form, Formik, useFormikContext } from 'formik';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import s from './styles.module.scss';

interface ImportTokenFormValues {
  address: string;
  symbol?: string;
  decimals?: string;
}

const STORAGE_KEY_PREFIX = 'imported_tokens_';

const ImportTokenForm = ({ values, isSubmitting }: { values: ImportTokenFormValues, isSubmitting: boolean }) => {
  const { pairs } = useContext(AgentTradeContext);
  const { selectedAgent } = useContext(AgentContext);
  const [isSearching, setIsSearching] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<IToken | null>(null);
  const { currentChain } = useSelector(agentsTradeSelector);
  const agentContract = new CAgentTradeContract();
  const formik = useFormikContext<ImportTokenFormValues>();
  const debouncedAddress = useDebounce(values.address, 500);

  useEffect(() => {
    const getTokenInfo = async () => {
      if (!debouncedAddress || !/^0x[a-fA-F0-9]{40}$/.test(debouncedAddress)) {
        setTokenInfo(null);
        return;
      }

      setIsSearching(true);
      try {
        const info = await agentContract.getTokenInfo({
          contractAddress: debouncedAddress,
          chain: currentChain,
        });
        
        if (info) {
          setTokenInfo(info);
          formik.setFieldValue('symbol', info.symbol || '');
          formik.setFieldValue('decimals', '18');
        }
      } catch (error) {
        console.error('Error searching token:', error);
        setTokenInfo(null);
      } finally {
        setIsSearching(false);
      }
    };

    getTokenInfo();
  }, [debouncedAddress, currentChain]);

  const validateAddress = useCallback((value: string) => {
    if (!value) {
      return 'Token address is required';
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(value)) {
      return 'Invalid token address format';
    }
    if (pairs.some(token => compareString(token.address, value))) {
      return 'Token already imported';
    }
    return undefined;
  }, [pairs]);

  const validateSymbol = useCallback((value: string) => {
    if (!value) {
      return 'Token symbol is required';
    }
    return undefined;
  }, []);

  const validateDecimals = useCallback((value: string) => {
    if (!value) {
      return 'Token decimals is required';
    }
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return 'Decimals must be a number';
    }
    if (numValue < 0) {
      return 'Decimals must be at least 0';
    }
    if (numValue > 18) {
      return 'Decimals cannot exceed 18';
    }
    return undefined;
  }, []);

  const isSubmitDisabled = !tokenInfo || isSearching || isSubmitting || !values.symbol || !values.decimals;

  return (
    <Form>
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!formik.errors.address && formik.touched.address} className={s.formControl}>
          <FormLabel className={s.label}>Token Contract Address</FormLabel>
          <Field
            as={Input}
            name="address"
            placeholder="0x..."
            validate={validateAddress}
            className={s.input}
          />
          <FormErrorMessage>{formik.errors.address}</FormErrorMessage>
        </FormControl>

        {(isSearching || tokenInfo) && (
          <>
            <FormControl isInvalid={!!formik.errors.symbol && formik.touched.symbol} className={s.formControl}>
              <FormLabel className={s.label}>Token Symbol</FormLabel>
              <Field
                as={Input}
                name="symbol"
                placeholder="Enter token symbol"
                validate={validateSymbol}
                className={s.input}
                disabled={isSearching}
              />
              <FormErrorMessage>{formik.errors.symbol}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!formik.errors.decimals && formik.touched.decimals} className={s.formControl}>
              <FormLabel className={s.label}>Token Decimals</FormLabel>
              <Field
                as={Input}
                name="decimals"
                placeholder="Enter token decimals"
                type="number"
                validate={validateDecimals}
                className={s.input}
                disabled={isSearching}
              />
              <FormErrorMessage>{formik.errors.decimals}</FormErrorMessage>
            </FormControl>
          </>
        )}

        <Button
          mt={4}
          isLoading={isSubmitting || isSearching}
          type="submit"
          className={s.btnSubmit}
          disabled={isSubmitDisabled}
        >
          Import Token
        </Button>
      </VStack>
    </Form>
  );
};

const ImportToken = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  const { selectedAgent } = useContext(AgentContext);

  const handleSubmit = async (values: ImportTokenFormValues) => {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}${selectedAgent?.id}`;
      
      const existingTokensStr = await localStorageService.getItem(storageKey);
      const existingTokens: IToken[] = existingTokensStr ? JSON.parse(existingTokensStr) : [];
      
      const newToken: IToken = {
        address: values.address,
        symbol: values.symbol || '',
        name: values.symbol || '',
      };
      
      await localStorageService.setItem(storageKey, JSON.stringify([...existingTokens, newToken]));

      toast({
        title: "Token imported successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error('Error importing token:', error);
      toast({
        title: "Error importing token",
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
          address: '',
          symbol: '',
          decimals: '',
        }}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting }) => (
          <ImportTokenForm values={values} isSubmitting={isSubmitting} />
        )}
      </Formik>
    </Box>
  );
};

export default ImportToken; 