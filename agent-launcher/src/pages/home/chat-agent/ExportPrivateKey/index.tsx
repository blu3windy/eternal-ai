import {Box, Flex, Text} from "@chakra-ui/react";
import s from './styles.module.scss';
import React, {useContext} from "react";
import {AgentContext} from "@pages/home/provider";
import copy from "copy-to-clipboard";
import toast from "react-hot-toast";

const ExportPrivateKey = () => {
  const { agentWallet, } = useContext(AgentContext);

  const onClickCopy = (address: string) => {
    copy(address);
    toast.success('Copied.');
  };

  return (
    <Flex className={s.container} h={"100%"} direction={"column"} justifyContent={"center"} alignItems={"center"} gap={"32px"} py={"24px"}>
      <Flex direction={"column"} gap={"12px"} w={"100%"}>
        <Flex direction={"column"} gap={"20px"} w={'100%'} borderRadius={"28px"} border={"1px dashed #E1DDDD"} p={"50px 50px"}>
          <Text fontSize={"16px"} fontWeight={400} textAlign={"center"} opacity={0.6}>{agentWallet?.privateKey}</Text>
          <Flex className={s.copyBox} alignItems={"center"} gap={"0px"} onClick={() => onClickCopy(agentWallet?.privateKey || '')}>
            <Text color="#000" fontSize="14px" fontWeight={400}>
              Copy
            </Text>
            <Box className={s.iconCopy} >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.00104 4.39948V2.59987C5.00104 2.44077 5.06424 2.2882 5.17674 2.1757C5.28924 2.0632 5.44182 2 5.60091 2H12.7994C12.9584 2 13.111 2.0632 13.2235 2.1757C13.336 2.2882 13.3992 2.44077 13.3992 2.59987V10.998C13.3992 11.1571 13.336 11.3097 13.2235 11.4222C13.111 11.5347 12.9584 11.5979 12.7994 11.5979H10.9997V13.3975C10.9997 13.7287 10.7298 13.9974 10.3957 13.9974H3.20563C3.1265 13.998 3.04805 13.9828 2.97478 13.9529C2.90152 13.923 2.83489 13.879 2.77874 13.8232C2.72259 13.7674 2.67803 13.7011 2.64762 13.6281C2.61721 13.555 2.60156 13.4767 2.60156 13.3975L2.60336 4.99935C2.60336 4.66822 2.8733 4.39948 3.20683 4.39948H5.00104ZM6.20078 4.39948H10.9997V10.3982H12.1995V3.19974H6.20078V4.39948Z" fill="black"/>
              </svg>
            </Box>
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={"8px"}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.4">
              <path d="M10 1.25C12.3206 1.25 14.5462 2.17187 16.1872 3.81282C17.8281 5.45376 18.75 7.67936 18.75 10C18.75 12.3206 17.8281 14.5462 16.1872 16.1872C14.5462 17.8281 12.3206 18.75 10 18.75C7.67936 18.75 5.45376 17.8281 3.81282 16.1872C2.17187 14.5462 1.25 12.3206 1.25 10C1.25 7.67936 2.17187 5.45376 3.81282 3.81282C5.45376 2.17187 7.67936 1.25 10 1.25ZM10 5C9.8413 4.99986 9.68431 5.03282 9.53907 5.09678C9.39382 5.16073 9.26352 5.25428 9.15647 5.37145C9.04942 5.48861 8.96799 5.62681 8.91737 5.77723C8.86676 5.92764 8.84807 6.08696 8.8625 6.245L9.31875 11.2525C9.33644 11.4209 9.41584 11.5767 9.54164 11.69C9.66743 11.8032 9.83072 11.8659 10 11.8659C10.1693 11.8659 10.3326 11.8032 10.4584 11.69C10.5842 11.5767 10.6636 11.4209 10.6812 11.2525L11.1363 6.245C11.1507 6.08706 11.132 5.92785 11.0815 5.77752C11.0309 5.62719 10.9496 5.48905 10.8427 5.37191C10.7358 5.25476 10.6056 5.16119 10.4605 5.09716C10.3154 5.03312 10.1586 5.00003 10 5ZM10 15C10.2652 15 10.5196 14.8946 10.7071 14.7071C10.8946 14.5196 11 14.2652 11 14C11 13.7348 10.8946 13.4804 10.7071 13.2929C10.5196 13.1054 10.2652 13 10 13C9.73478 13 9.48043 13.1054 9.29289 13.2929C9.10536 13.4804 9 13.7348 9 14C9 14.2652 9.10536 14.5196 9.29289 14.7071C9.48043 14.8946 9.73478 15 10 15Z" fill="black"/>
            </g>
          </svg>
          <Text fontSize={"16px"} fontWeight={400} opacity={0.6}>Never disclose your backup phrase. Write it down and store in a secure location.</Text>
        </Flex>
      </Flex>
    </Flex>
  )
};

export default ExportPrivateKey;