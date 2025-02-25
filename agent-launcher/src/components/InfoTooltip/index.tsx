/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  PlacementWithLogical,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ReactNode, useEffect, useRef } from "react";
import IcHelp from "./IcHelp";

interface InfoTooltipProps {
  label: ReactNode;
  children?: ReactNode;
  placement?: PlacementWithLogical;
  iconSize?: string;
  fontSize?: string;
  iconColor?: string;
  showIcon?: boolean;
  iconName?: any;
  setIsOpen?: (b: boolean) => void;
  isStyleConfig?: boolean;
}

const InfoTooltip = (props: InfoTooltipProps) => {
  const {
    label,
    children,
    showIcon = false,
    setIsOpen,
    isStyleConfig = true,
    placement,
  } = props;
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    setIsOpen && setIsOpen(isOpen);
  }, [isOpen]);

  const initRef = useRef<any>();

  const renderChild = () => {
    if (children && showIcon) {
      return (
        <Flex gap={1} alignItems={"center"}>
          {children}
          <IcHelp />
        </Flex>
      );
    }
    if (children) {
      return children;
    }
    return <IcHelp />;
  };

  return (
    <Popover
      closeOnBlur={true}
      placement={placement || "auto"}
      initialFocusRef={initRef}
      isOpen={isOpen}
      onClose={onClose}
      styleConfig={
        isStyleConfig
          ? {
              zIndex: 999999999,
            }
          : undefined
      }
    >
      <PopoverTrigger>
        <Box
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggle();
          }}
          onMouseEnter={onOpen}
          cursor={"pointer"}
        >
          {renderChild()}
        </Box>
      </PopoverTrigger>
      <Box zIndex="popover">
        <PopoverContent maxW="300px">
          <PopoverArrow bg="#F8F9FA" />
          <PopoverBody
            style={{
              padding: "8px 12px",
              background: "#F8F9FA",
              border: "1px solid #ECECED",
              borderRadius: "4px",
              boxShadow: "0px 0px 24px -6px #0000001F",
            }}
          >
            {typeof label === "string" ? (
              <Text
                fontSize={"16px"}
                fontWeight={"400"}
                color="#000"
                dangerouslySetInnerHTML={{ __html: label as any }}
              />
            ) : (
              label
            )}
          </PopoverBody>
        </PopoverContent>
      </Box>
    </Popover>
  );
};

export default InfoTooltip;
