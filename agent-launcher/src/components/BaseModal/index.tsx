import cs from 'clsx';
import React, { PropsWithChildren } from 'react';
import s from './styles.module.scss';
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

export interface IBaseModalProps {
  isShow: boolean;
  onHide: () => void;
  title?: string | React.ReactNode;
  className?: string;
  size?:
    | 'supperSmall'
    | 'small'
    | 'normal'
    | 'normal1'
    | 'extra'
    | 'custom'
    | 'search';
  description?: string | React.ReactNode;
  headerClassName?: string;
  theme?: 'dark' | 'light';
  icCloseUrl?: string;
}

const BaseModal = (props: PropsWithChildren<IBaseModalProps>) => {
  const {
    isShow,
    onHide,
    title,
    className,
    children,
    description,
    headerClassName,
    size = 'normal',
    theme = 'light',
    icCloseUrl = '/icons/ic_close_modal.svg',
  } = props;

  return (
    <Modal isOpen={isShow} onClose={onHide} isCentered={true}>
      <ModalOverlay />
      <ModalContent className={cs(s.modalContent, s[size], className)}>
        <ModalHeader className={cs(s.modalHeader, headerClassName)}>
          <Flex flexDir="column" gap="12px" w="100%">
            <p
              className={cs(
                s.modalHeader_title,
                theme === 'dark' && s.modalHeader_titleDark,
              )}
            >
              {title || ''}
            </p>
            {!!description && typeof description === 'string' ? (
              <p className={s.modalHeader_description}>{description}</p>
            ) : (
              description
            )}
            <ModalCloseButton size="20px" className={s.modalHeader_closeBtn} />
          </Flex>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default BaseModal;
