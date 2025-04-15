import React, { useMemo } from "react";
import { CustomComponentProps } from "../types";
import s from "./styles.module.scss";

const CustomLink = ({
  node,
  children,
  href,
}: CustomComponentProps & {
  href: string;
}) => {


  
  const formatMessage = useMemo(() => {
    try {
      const urlRegex = /(https?:\/\/twitter\.com\/i\/oauth2\/authorize\?[^ ]+)/;
      if ((children as any).match(urlRegex)) {
        return "Please authenticate with this link and try again.";
      }

      const urlPostRegex = /(https?:\/\/x\.com\/[\w_]+\/status\/\d+)/g;

      if ((children as any).match(urlPostRegex)) {
        return `Take a look at this tweet for more details. [${children}]`;
      }

      return children;
    } catch (error) {
      return children;
    }
  }, [children]);

  return (
    <a
      className={s.linkContainer}
      href={href}
      target="_blank"
      onClick={(e) => {
        e.preventDefault();
        globalThis.electronAPI.openExternal(href); // Open in system browser
      }}
    >
      {formatMessage}
    </a>
  );
};

export default CustomLink;
