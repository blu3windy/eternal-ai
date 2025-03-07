import React, { useMemo } from "react";
import ContentDeposit, { depositRegex } from "./Content.Deposit";

const ContentReplay = ({ children }) => {
  const formatMessage = useMemo(() => {
    const message = children as any;

    const matchDeposit = message.match(depositRegex);
    if (matchDeposit) {
      return <ContentDeposit matchDeposit={matchDeposit} />;
    }

    return <p>{children}</p>;
  }, [children]);

  return formatMessage;
};

export default ContentReplay;
