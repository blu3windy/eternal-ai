import { FC } from "react";
import styles from "./styles.module.scss";
import { Button, ButtonProps } from "@chakra-ui/react";

interface IProps extends ButtonProps{
    size?: "small" | "medium" | "large";
    bgColor?: string | "black";
    txtColor?: string | "white";
}

const BaseButton: FC<IProps> = (props: IProps) => {
   const {
      size = "medium",
      bgColor = "black",
      txtColor = "white",
      onClick,
      children,
      ...rest
   } = props;

   return (
      <Button
         className={`${styles.button} ${styles[size]}`}
         style={{ backgroundColor: bgColor, color: txtColor }}
         onClick={onClick}
         {...rest}
      >
         {children}
      </Button>
   );
};

export default BaseButton;