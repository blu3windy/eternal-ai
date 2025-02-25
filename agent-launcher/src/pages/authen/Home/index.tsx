import { FC, PropsWithChildren } from "react";
import { Flex } from "@chakra-ui/react";
import RegisterIntroduce from "../Register/Introduce";
import styles from "./styles.module.scss";

interface IProps extends PropsWithChildren {

}

const HomeAuthen: FC = (props: IProps) => {
    return (
        <Flex
            className={styles.container}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
        >
            <RegisterIntroduce />
        </Flex>
    );
};

export default HomeAuthen;