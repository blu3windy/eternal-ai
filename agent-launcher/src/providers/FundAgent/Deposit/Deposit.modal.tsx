import React from 'react';
import BaseModal from '@components/BaseModal';
import DepositBox from "./DepositBox.tsx";
import useFundAgent from "../useFundAgent.ts";
import s from './styles.module.scss';

const DepositModal = React.memo(() => {
   const { depositInfo, setDepositInfo } = useFundAgent();

   const onClose = () => {
      setDepositInfo(undefined);
   };

   return (
      <BaseModal
         isShow={!!depositInfo}
         onHide={onClose}
         title={'Deposit'}
         size="small"
         description={''}
         className={s.modalContent}
      >
         <DepositBox address={depositInfo?.address || ''} networkName={depositInfo?.networkName || ''} />
      </BaseModal>
   );
});

export default DepositModal;
