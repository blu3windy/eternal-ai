import { compareString } from '@utils/helpers';
import {
  Box,
  Flex,
  Image,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import cs from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import s from './styles.module.scss';
import { useAppSelector } from '@stores/hooks';
import { nakaAuthChainsSelector } from '@stores/states/nakaAuth/selector';
import { getModelDescription } from '@services/api/model';
import {
  RenameDescriptionModels,
  RenameModels,
} from '@/modules/AgentsHome/AgentsList';

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
}: {
  modelName: string;
  setCurrentModel: any;
  onClose: any;
  modelId: string;
  models: any;
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
        <Flex alignItems={'flex-start'} gap="8px">
          {/* <Image
            className={s.itemIcon}
            src={`/icons/blockchains/${model.icon}`}
          /> */}
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
      </Flex>
    </Flex>
  );
};

const SelectModel = ({
  currentModel,
  setCurrentModel,
  chainId,
  disabled,
  title = 'AI model',
  className,
  showDescription = true,
}: Props) => {
  const chains = useAppSelector(nakaAuthChainsSelector);
  const [models, setModels] = useState<any>();

  const supportModelObj = chains?.find((v) =>
    compareString(v.chain_id, chainId),
  )?.support_model_names;

  console.log('supportModelObj', chains);
  console.log('supportModelObj', supportModelObj);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const fetchModelDescription = async () => {
    try {
      const rs = await getModelDescription();
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

  const styleLabel = {
    fontSize: '13px',
    lineHeight: '22px !important',
    fontFamily: 'var(--font-inter) !important',
    fontWeight: '500',
  };

  return (
    <>
      {title && (
        <Text mb="4px" {...styleLabel}>
          AI model
        </Text>
      )}
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
              <Image src="/icons/chevron-down-filled-black.svg" />
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
              Object.keys(supportModelObj || {}).map((t) => (
                <ItemToken
                  key={t}
                  modelName={t}
                  modelId={supportModelObj[t]}
                  setCurrentModel={setCurrentModel}
                  onClose={onClose}
                  models={models}
                />
              ))}
          </PopoverContent>
        </Popover>
      </Box>
    </>
  );
};

export default SelectModel;
