import BaseModal from "@components/BaseModal";
import styles from "./styles.module.scss";
import { useState } from "react";

function ProcessingTaskModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
   return (
      <BaseModal
         isShow={isOpen}
         onHide={() => {
            setIsOpen(false);
         }}
         size="small"
      ></BaseModal>
   );
}

export default ProcessingTaskModal;
