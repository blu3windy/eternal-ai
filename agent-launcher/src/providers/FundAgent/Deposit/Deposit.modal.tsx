import React from 'react';
import BaseModal from '@components/BaseModal';
import DepositBox from "./DepositBox.tsx";
import useFundAgent from "../useFundAgent.ts";

const DepositModal = React.memo(() => {
   const { depositAgentID, setDepositAgentID, depositAgentInfo } = useFundAgent();

   const onClose = () => {
      setDepositAgentID(undefined);
   };

   return (
      <BaseModal
         isShow={!!depositAgentID}
         onHide={onClose}
         title={depositAgentInfo ? `Keep ${depositAgentInfo?.twitter_info?.twitter_name || depositAgentInfo?.agent_name} engaging!` : ""}
         size="small"
         description={depositAgentInfo ? `Love what ${depositAgentInfo?.twitter_info?.twitter_name || depositAgentInfo?.agent_name} brings? Tip to help it thrive, grow, and deliver even more to the community. Every bit counts!` : ""}
      >
         <DepositBox agentID={depositAgentID || ''} />
      </BaseModal>
   );
});

export default DepositModal;
