import { useMemo, useState } from "react";
import Markdown, { Components } from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import GeneralCode from "./GenerateCode";
import DeepThinking from "./DeepThinking";
import { CustomComponentProps } from "./types";
import { THINK_TAG_REGEX } from "./constants";
import CustomLink from "./Link";
import ContentReplay from "./Content";
import {
   Modal,
   ModalOverlay,
   ModalContent,
   ModalHeader,
   ModalBody,
   ModalCloseButton,
   Input,
   Flex,
   IconButton,
   Box,
   useDisclosure
} from '@chakra-ui/react';

const preprocessMarkdown = (content: string) => {
   try {
      const result = content?.replace?.(
         THINK_TAG_REGEX,
         (_, innerText) =>
            `<think>${innerText.trim().replace(/\n/g, "<br />")}</think>`
      );

      return result;
   } catch (error) {
      return "";
   }
};

type ComponentExtended = {
  code?: (props: CustomComponentProps) => JSX.Element;
  think?: (props: CustomComponentProps) => JSX.Element;
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
                  <Box as="span" color="gray.500">🔍</Box>
                  <Input 
                     value={url}
                     readOnly
                     variant="filled"
                     size="sm"
                     flex={1}
                  />
                  <IconButton
                     aria-label="Fullscreen"
                     icon={<Box as="span">⛶</Box>}
                     variant="ghost"
                     size="sm"
                     onClick={() => document.documentElement.requestFullscreen()}
                  />
                  <ModalCloseButton position="static" />
               </Flex>
            </ModalHeader>
            <ModalBody p={0}>
               <Box as="webview" 
                  src={url}
                  w="100%"
                  h="100%"
                  border="none"
               />
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};

function CustomMarkdown({
   content,
   components = {},
   isLight = true,
   removeThink = false,
}: {
  content: string;
  components?: ComponentExtended;
  isLight?: boolean;
  removeThink?: boolean;
}) {
   const customComponents = useMemo(() => {
      return {
         code: (props: any) => {
            return <GeneralCode {...props} />;
         },
         think: (props: any) => {
            return (
               <DeepThinking
                  {...props}
                  isLight={isLight}
                  removeThink={removeThink}
               />
            );
         },
         a: (props) => {
            return <CustomLink {...props} />;
         },
         p: (props) => {
            return <ContentReplay {...props} />;
         },
         ...components,
      } satisfies any;
   }, [components, isLight, removeThink]);

   const children = useMemo(() => preprocessMarkdown(content), [content]);
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [currentUrl, setCurrentUrl] = useState('');

   const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      const url = e.currentTarget.href;
      setCurrentUrl(url);
      onOpen();
   };

   return (
      <>
         <div
            onClick={(e) => {
               const target = e.target as HTMLElement;
               if (target.tagName === 'A') {
                  e.preventDefault();
                  handleLinkClick(e as unknown as React.MouseEvent<HTMLAnchorElement>);
               }
            }}
         >
            <Markdown
               remarkPlugins={[remarkGfm]} // Enables GitHub Flavored Markdown
               rehypePlugins={[rehypeRaw]} // Enables raw HTML parsing
               children={children}
               components={customComponents as Components}
            />
         </div>

         <WebviewModal
            url={currentUrl}
            isOpen={isOpen}
            onClose={onClose}
         />
      </>
   );
}

export default CustomMarkdown;
