import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import styles from "./styles.module.scss";

const DeleteAgentModal = ({ agentName, isOpen, onClose, onDelete }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false}>
      <ModalOverlay />
      <ModalContent className={styles.modalContent}>
        <ModalHeader>Delete {agentName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody mt={'-12px'} mb={'8px'}>
          <Text>Deleting this agent will remove all your chats and interactions with it.</Text>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </Button>
          <Button onClick={onDelete} colorScheme="red" className={styles.deleteButton} ml={3}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DeleteAgentModal;
