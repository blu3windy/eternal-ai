import { Button, Flex, Grid, Image, Text } from "@chakra-ui/react";
import CustomMarkdown from "@components/CustomMarkdown";
import { DefaultAvatar } from "@components/DefaultAvatar";
import {
   AgentStatus,
   AgentStatusLabel,
   AgentType,
} from "@pages/home/list-agent/constants";
import { AgentContext } from "@pages/home/provider/AgentContext";
import { IAgentToken } from "@services/api/agents-token/interface.ts";
import { formatCurrency } from "@utils/format.ts";
import cs from "clsx";
import { motion } from "framer-motion";
import { useContext, useMemo } from "react";
import s from "./styles.module.scss";

interface IProps {
  token: IAgentToken;
}

const NewsItem = ({ token }: IProps) => {
   const { agentStates, handleUpdateCode } = useContext(AgentContext);

   const isUpdating = useMemo(() => {
      if (token) {
         return agentStates[token.id]?.isUpdating || false;
      }

      return false;
   }, [token, agentStates]);

   const description = useMemo(() => {
      if (
         [AgentType.Infra, AgentType.Model, AgentType.CustomPrompt].includes(
            token.agent_type
         )
      ) {
         return token?.short_description || token?.personality;
      } else {
         return (
            token?.short_description
        || token?.token_desc
        || token?.twitter_info?.description
         );
      }
   }, [token]);

   const avatarUrl
    = token?.thumbnail
    || token?.token_image_url
    || token?.twitter_info?.twitter_avatar;

   const iconSize = "60px";

   if (!token.is_public && token.agent_name === "Proxy") {
      return <></>;
   }

   return (
      <Flex
         as={motion.div}
         initial={{ opacity: 0 }}
         animate={{ opacity: 1 }}
         exit={{ opacity: 0 }}
         transition={{ duration: "0.5s" }}
         key={token.id}
         className={cs(s.container)}
         flexDirection="column"
         position={"relative"}
         w={"100%"}
      >
         <Grid
            className={s.content}
            templateColumns={`${iconSize} 1fr`}
            gap="12px"
            w={"100%"}
         >
            <Flex position={"relative"}>
               {avatarUrl ? (
                  <Image
                     w={iconSize}
                     objectFit={"cover"}
                     src={avatarUrl}
                     maxHeight={iconSize}
                     maxWidth={iconSize}
                     borderRadius={"50%"}
                  />
               ) : (
                  <DefaultAvatar
                     width={iconSize}
                     height={iconSize}
                     name={token?.display_name || token?.agent_name}
                     fontSize={14}
                  />
               )}
            </Flex>
            <Flex gap={"16px"} justifyContent={"space-between"}>
               <Flex flexDirection="column" w={"100%"} gap={"4px"}>
                  <Flex
                     gap={"6px"}
                     alignItems={"center"}
                     justifyContent={"space-between"}
                  >
                     <Flex gap={"4px"} direction={"column"}>
                        <Text className={s.nameText}>
                           {token?.display_name || token?.agent_name}{" "}
                        </Text>
                     </Flex>
                  </Flex>
                  {description && (
                     <div className={cs(s.descriptionText, "markdown")}>
                        <CustomMarkdown content={description} />
                     </div>
                  )}
               </Flex>
               <Flex
                  gap={"6px"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
               >
                  <Button
                     className={s.btnUpdate}
                     onClick={() => handleUpdateCode(token)}
                     isLoading={isUpdating}
                     isDisabled={isUpdating}
                     loadingText={"Updating..."}
                  >
              Update
                  </Button>
               </Flex>
            </Flex>
         </Grid>
      </Flex>
   );
};

export default NewsItem;
