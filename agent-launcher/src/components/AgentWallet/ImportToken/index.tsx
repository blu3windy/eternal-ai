import {
  Box,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import BaseButton from "@components/BaseButton";
import InputText from '@components/Input/InputText';
import CAgentTradeContract from "@contract/agent-trade";
import { useDebounce } from '@hooks/useDebounce';
import { IToken } from '@interfaces/token';
import { AgentContext } from '@pages/home/provider/AgentContext';
import { AgentTradeContext } from '@pages/home/trade-agent/provider';
import localStorageService from '@storage/LocalStorageService';
import { agentsTradeSelector } from '@stores/states/agent-trade/selector';
import { compareString } from '@utils/string';
import { Form, Formik } from 'formik';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from "yup";
import s from './styles.module.scss';

interface ImportTokenFormValues {
  address: string;
  symbol?: string;
  decimals?: string;
}

const STORAGE_KEY_PREFIX = 'imported_tokens_';

const ImportTokenForm = ({ 
  values, 
  isSubmitting, 
  setFieldValue, 
  dirty,
  touched,
  errors,
  handleBlur
}: { 
  values: ImportTokenFormValues, 
  isSubmitting: boolean,
  setFieldValue: (field: string, value: any) => void,
  dirty: boolean,
  touched: { [key: string]: boolean },
  errors: { [key: string]: string },
  handleBlur: (e: React.FocusEvent<any>) => void
}) => {
  const { pairs } = useContext(AgentTradeContext);
  const { selectedAgent } = useContext(AgentContext);
  const [isSearching, setIsSearching] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<IToken | null>(null);
  const [storedTokens, setStoredTokens] = useState<IToken[]>([]);
  const { currentChain } = useSelector(agentsTradeSelector);
  const agentContract = new CAgentTradeContract();
  const debouncedAddress = useDebounce(values.address, 500);

  // console.log('touched', touched);
  // console.log('errors', errors);
  // console.log('values', values);
  // console.log('tokenInfo', tokenInfo);
  // console.log('============');

  useEffect(() => {
    const loadStoredTokens = async () => {
      if (!selectedAgent?.id) return;
      
      try {
        const storageKey = `${STORAGE_KEY_PREFIX}${selectedAgent.id}`;
        const existingTokensStr = await localStorageService.getItem(storageKey);
        const existingTokens: IToken[] = existingTokensStr ? JSON.parse(existingTokensStr) : [];
        setStoredTokens(existingTokens);
      } catch (error) {
        console.error('Error loading stored tokens:', error);
      }
    };

    loadStoredTokens();
  }, [selectedAgent?.id]);

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
          setFieldValue('symbol', info.symbol || '');
          setFieldValue('decimals', '18');
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

  const isTokenAlreadyImported = useCallback((address: string) => {
    return pairs.some(token => compareString(token.address, address)) ||
           storedTokens.some(token => compareString(token.address, address));
  }, [pairs, storedTokens]);

  const isSubmitDisabled = !tokenInfo || 
                          isSearching || 
                          isSubmitting || 
                          !values.symbol || 
                          !values.decimals ||
                          isTokenAlreadyImported(values.address) ||
                          !dirty;

  return (
    <Form>
      <VStack spacing={4} align="stretch">
        <Box>
          <InputText
            name="address"
            header={{
              label: "Token Contract Address",
              fontSize: '14px',
            }}
            placeholder="0x..."
            onChange={(e) => setFieldValue('address', e.target.value)}
            onBlur={handleBlur}
            height={'44px'}
            isInvalid={touched.address && !!errors.address}
          />
          {touched.address && errors.address && (
            <Text fontSize="12px" color="red" textAlign="left">
              {errors.address}
            </Text>
          )}
        </Box>

        {(isSearching || tokenInfo) && (
          <>
            <Box>
              <InputText
                name="symbol"
                header={{
                  label: "Token Symbol",
                  fontSize: '14px',
                }}
                placeholder="Enter token symbol"
                value={values.symbol}
                onChange={(e) => setFieldValue('symbol', e.target.value)}
                onBlur={handleBlur}
                height={'44px'}
                isDisabled={isSearching}
                isInvalid={touched.symbol && !!errors.symbol}
              />
              {touched.symbol && errors.symbol && (
                <Text fontSize="12px" color="red" textAlign="left">
                  {errors.symbol}
                </Text>
              )}
            </Box>

            <Box>
              <InputText
                name="decimals"
                header={{
                  label: "Token Decimals",
                  fontSize: '14px',
                }}
                placeholder="Enter token decimals"
                type="number"
                value={values.decimals}
                onChange={(e) => setFieldValue('decimals', e.target.value)}
                onBlur={handleBlur}
                height={'44px'}
                isDisabled={isSearching || !!values.decimals}
                isInvalid={touched.decimals && !!errors.decimals}
              />
              {touched.decimals && errors.decimals && (
                <Text fontSize="12px" color="red" textAlign="left">
                  {errors.decimals}
                </Text>
              )}
            </Box>
          </>
        )}

        <BaseButton
          type="submit"
          width="100% !important"
          marginTop="32px"
          disabled={isSubmitDisabled}
          isLoading={isSubmitting || isSearching}
        >
          Import Token
        </BaseButton>
      </VStack>
    </Form>
  );
};

const ImportToken = ({ onClose }: { onClose: () => void }) => {
  const toast = useToast();
  const { selectedAgent } = useContext(AgentContext);
  const { pairs } = useContext(AgentTradeContext);

  const validationSchema = Yup.object().shape({
    address: Yup.string()
      .required('Token address is required')
      .matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid token address format')
      .test('unique-address', 'Token exists in current pairs', function(value) {
        if (!value) return true;
        return !pairs.some(token => compareString(token.address, value));
      })
      .test('not-imported', 'Token already imported previously', async function(value) {
        if (!value || !selectedAgent?.id) return true;
        try {
          const storageKey = `${STORAGE_KEY_PREFIX}${selectedAgent.id}`;
          const existingTokensStr = await localStorageService.getItem(storageKey);
          const existingTokens: IToken[] = existingTokensStr ? JSON.parse(existingTokensStr) : [];
          return !existingTokens.some(token => compareString(token.address, value));
        } catch (error) {
          return true;
        }
      }),
    symbol: Yup.string()
      .required('Token symbol is required')
      .min(1, 'Token symbol is required'),
    decimals: Yup.number()
      .required('Token decimals is required')
      .min(0, 'Decimals must be at least 0')
      .max(18, 'Decimals cannot exceed 18')
  });

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
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue, dirty, touched, errors, handleBlur }) => (
          <ImportTokenForm 
            values={values} 
            isSubmitting={isSubmitting} 
            setFieldValue={setFieldValue}
            dirty={dirty}
            touched={touched}
            errors={errors}
            handleBlur={handleBlur}
          />
        )}
      </Formik>
    </Box>
  );
};

export default ImportToken; 