import React from "react";
import s from "./styles.module.scss";
import { Box, Flex, Text, useToast } from "@chakra-ui/react";
import { ToastMessageIProps } from "../toast";
import cs from "classnames";

const ToastMessage: React.FC<ToastMessageIProps> = ({
  id,
  url,
  message,
  linkText,
  description,
  status,
}): React.ReactElement => {
  const toast = useToast();
  const onHandleLink = () => {
    toast.close(id);
    if (!url) {
      return;
    }

    let target = "_blank";

    if (!url?.includes?.("http://") && !url?.includes?.("https://")) {
      target = "_self";
    }

    return globalThis.electronAPI.openExternal(url);
  };

  return (
    <Flex className={cs(s.container, s[status as any])}>
      <Flex
        gap={"4px"}
        justifyContent={"space-between"}
        width={"100%"}
        flexDirection={"column"}
      >
        <Text className={s.messageText}>{message}</Text>
        {description && (
          <Text className={s.descriptionText}>{description}</Text>
        )}
        {url && (
          <Text
            onClick={onHandleLink}
            target="_blank"
            rel="noopener noreferrer"
            className={s.walletLink}
            style={{ cursor: "pointer" }}
            as={"a"}
          >
            {linkText || "View transaction >>"}
          </Text>
        )}
      </Flex>
      <Box
        className={s.btnClose}
        onClick={() => toast.close(id)}
        cursor={"pointer"}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m289.94 256 95-95A24 24 0 0 0 351 127l-95 95-95-95a24 24 0 0 0-34 34l95 95-95 95a24 24 0 1 0 34 34l95-95 95 95a24 24 0 0 0 34-34z"></path>
        </svg>
      </Box>
    </Flex>
  );
};

export default ToastMessage;
