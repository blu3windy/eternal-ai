import {
  Box,
  Circle,
  Divider,
  Flex,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import cs from 'classnames';
import {useContext, useEffect, useMemo, useState} from 'react';
import s from './styles.module.scss';
import {compareString} from "@utils/string.ts";
import {AgentContext} from "@pages/home/provider";
import CAgentTokenAPI from "../../../../../services/api/agents-token";

export const RenameModels: any = {
  'NousResearch/Hermes-3-Llama-3.1-70B-FP8': 'Hermes 3 70B',
  'PrimeIntellect/INTELLECT-1-Instruct': 'INTELLECT-1 10B',
  'neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16': 'Llama 3.1 405B',
  'unsloth/Llama-3.3-70B-Instruct-bnb-4bit': 'Llama 3.3 70B',
  'DeepSeek-R1-Distill-Llama-70B': 'DeepSeek-R1',
  'NousResearch/DeepHermes-3-Llama-3-8B-Preview': 'DeepHermes 3',
  'unsloth/r1-1776-GGUF': 'DeepSeek-R1 1776',
};

export const RenameDescriptionModels: any = {
  'DeepSeek-R1-Distill-Llama-70B': 'Ideal for Math, code, and reasoning tasks',
  'NousResearch/DeepHermes-3-Llama-3-8B-Preview':
    'Enabled toggling between intuitive and reasoning-based response modes.',
};

type Props = {
  chainId?: any;
  //   showHistory?: boolean;
  disabled?: boolean;
  currentModel: {
    name: string;
    id: string;
  } | null;
  setCurrentModel: (v: { name: string; id: string }) => void;
  title?: string;
  className?: string;
  showDescription?: boolean;
};

const ItemToken = ({
  setCurrentModel,
  onClose,
  modelName,
  modelId,
  models,
  isSelected,
}: {
  modelName: string;
  setCurrentModel: any;
  onClose: any;
  modelId: string;
  models: any;
  isSelected: boolean;
}) => {
  return (
    <Flex
      className={cs(
        s.itemToken,
        // compareString(model.name, 'chainId') && s.active,
        // isDisabled && s.disabled,
      )}
      onClick={() => {
        setCurrentModel({
          name: modelName,
          id: modelId,
        });
        onClose();
      }}
    >
      <Flex alignItems={'center'} justifyContent={'space-between'}>
        <Flex alignItems={'flex-start'} gap="24px">
           <Image
            className={s.itemIcon}
            src={`/icons/ic-llama.png`}
          />
          <Flex direction="column" gap="4px">
            <Text className={s.itemTitle}>
              {RenameModels?.[modelName as any] || modelName}
            </Text>
            <Text className={s.itemAmount}>
              {RenameDescriptionModels?.[models?.[modelName]] ||
                RenameDescriptionModels?.[modelName] ||
                models?.[modelName]}
            </Text>
          </Flex>
        </Flex>
        {
          isSelected && (
            <Circle size={'24px'} className={s.itemDot}>
              <Circle size={'16px'} />
            </Circle>
          )
        }
      </Flex>
    </Flex>
  );
};

const SelectModel = ({
  currentModel,
  setCurrentModel,
  chainId,
  disabled,
  className,
  showDescription = true,
}: Props) => {
  const { chainList } = useContext(AgentContext);
  const [models, setModels] = useState<any>();

  const supportModelObj = chainList?.find((v) =>
    compareString(v.chain_id, chainId),
  )?.support_model_names;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const cPumpAPI = new CAgentTokenAPI();

  const fetchModelDescription = async () => {
    try {
      const rs = await cPumpAPI.getModelDescription();
      setModels(rs);
    } catch (error) {}
  };

  useEffect(() => {
    fetchModelDescription();
  }, []);

  useEffect(() => {
    if (supportModelObj) {
      if (
        !currentModel ||
        !Object.keys(supportModelObj).includes(currentModel.name)
      ) {
        setCurrentModel({
          name: Object.keys(supportModelObj)[0],
          id: Object.values(supportModelObj)[0],
        });
      }
    }
  }, [supportModelObj, currentModel]);

  const isDisabled = useMemo(() => {
    return disabled; // || Object.keys(supportModelObj || {}).length <= 1;
  }, [disabled, supportModelObj]);

  if (!supportModelObj) {
    return null;
  }

  return (
    <>
      <Box className={cs(s.container, className)}>
        <Popover placement="bottom-end" isOpen={isOpen} onClose={onClose}>
          <PopoverTrigger>
            <Flex
              className={s.dropboxButton}
              pl="20px"
              onClick={isDisabled ? undefined : onOpen}
              cursor={isDisabled ? 'not-allowed' : 'pointer'}
            >
              <Box flex={1}>
                <Text className={s.title}>
                  {RenameModels?.[currentModel?.name as any] ||
                    currentModel?.name}
                </Text>
                {showDescription && (
                  <Text className={s.amount}>
                    {RenameDescriptionModels?.[
                      models?.[currentModel?.name as any]
                    ] ||
                      RenameDescriptionModels?.[currentModel?.name as any] ||
                      models?.[currentModel?.name as any]}
                  </Text>
                )}
              </Box>
              <Image src="/icons/ic-angle-down.svg" />
            </Flex>
          </PopoverTrigger>
          <PopoverContent
            width={'100%'}
            className={s.poperContainer}
            border={'1px solid #E5E7EB'}
            boxShadow={'0px 0px 24px -6px #0000001F'}
            borderRadius={'16px'}
            background={'#fff'}
          >
            {supportModelObj &&
              Object.keys(supportModelObj || {}).map((t, i) => (
                <>
                  <ItemToken
                    key={t}
                    modelName={t}
                    modelId={supportModelObj[t]}
                    setCurrentModel={setCurrentModel}
                    onClose={onClose}
                    models={models}
                    isSelected={currentModel?.id === supportModelObj[t]}
                  />
                  {i < Object.keys(supportModelObj || {}).length - 1 && (
                    <Divider color={'#E2E4E8'} my={'0px'} />
                  )}
                </>

              ))}
          </PopoverContent>
        </Popover>
      </Box>
    </>
  );
};

export default SelectModel;
