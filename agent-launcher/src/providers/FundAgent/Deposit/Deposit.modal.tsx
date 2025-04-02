import React from 'react';
import BaseModal from '@components/BaseModal';
import DepositBox from "./DepositBox.tsx";
import useFundAgent from "../useFundAgent.ts";
import s from './styles.module.scss';

const DepositModal = React.memo(() => {
   const { depositAgentID, setDepositAgentID, depositAgentInfo } = useFundAgent();

   const onClose = () => {
      setDepositAgentID(undefined);
   };

   return (
      <BaseModal
         isShow={!!depositAgentID}
         onHide={onClose}
         title={'Deposit'}
         size="small"
         description={''}
         className={s.modalContent}
      >
         <DepositBox agentID={depositAgentID || ''} />
      </BaseModal>
   );
});

export default DepositModal;
