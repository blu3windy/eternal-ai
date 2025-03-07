import { Text } from "@chakra-ui/react";
import styles from "./styles.module.scss";


interface IProps {
    dataText?: string;
}

const LoadingText = (props: IProps) => {
   const { dataText = "Initializing..." } = props;
   return (
      <Text
         data-text={dataText}
         className={styles.animText}
      >
         {dataText}
      </Text>
   )
};

export default LoadingText;