import { useMemo, useState, memo } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks'
import GeneralCode from "./GenerateCode";
import DeepThinking from "./DeepThinking";
import { THINK_TAG_REGEX } from "./constants";
import CustomLink from "./Link";
import ContentReplay from "./Content";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Input, Flex, IconButton, Box, useDisclosure } from "@chakra-ui/react";
import Processing from "./Processing";

const preprocessMarkdown = (content: string) => {
   try {
      const result = content?.replace?.(THINK_TAG_REGEX, (_, innerText) => `<think>${innerText.trim().replace(/\n/g, "<br />")}</think>`);

      return result;
   } catch (error) {
      return "";
   }
};

interface WebviewModalProps {
   url: string;
   isOpen: boolean;
   onClose: () => void;
}

const WebviewModal: React.FC<WebviewModalProps> = ({ url, isOpen, onClose }) => {
   return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
         <ModalOverlay />
         <ModalContent maxW="80%" h="80vh">
            <ModalHeader p={2} bg="gray.50">
               <Flex alignItems="center" gap={2}>
                  <Box as="span" color="gray.500">
                     🔍
                  </Box>
                  <Input value={url} readOnly variant="filled" size="sm" flex={1} />
                  <IconButton aria-label="Fullscreen" icon={<Box as="span">⛶</Box>} variant="ghost" size="sm" onClick={() => document.documentElement.requestFullscreen()} />
                  <ModalCloseButton position="static" />
               </Flex>
            </ModalHeader>
            <ModalBody p={0}>
               <Box as="webview" src={url} w="100%" h="100%" border="none" />
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

function CustomMarkdown({
   id,
   content,
   status = "waiting",
}: {
   id?: string;
   content: string;
   status?: string;
}) {
   const customComponents = useMemo(() => {
      return {
         code: (props: any) => {
            return <GeneralCode  {...props} key={id} />;
         },
         think: (props: any) => {
            return <DeepThinking {...props} key={id} status={status} />;
         },
         a: (props) => {
            return <CustomLink {...props}  key={id}/>;
         },
         p: (props) => {
            return <ContentReplay {...props} key={id}/>;
         },
         processing: (props: any) => {
            return <Processing {...props} key={id}/>;
         },
      } satisfies any;
   }, [status]);

   const children = useMemo(() => preprocessMarkdown(content), [content]);

   return (
      <Markdown
         remarkPlugins={[remarkGfm, remarkBreaks]} // Enables GitHub Flavored Markdown
         rehypePlugins={[rehypeRaw]} // Enables raw HTML parsing
         children={children}
         components={customComponents as Components}
         urlTransform={(value: string) => value}
      />
   );
}

export default memo(CustomMarkdown);
