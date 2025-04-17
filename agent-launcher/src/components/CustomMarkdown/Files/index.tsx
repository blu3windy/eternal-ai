import { formatBytes } from "@utils/string";
import { CustomComponentProps } from "../types";
import { CollapseIcon, DownloadIcon, TxtIcon } from "./icons";
import styles from './styles.module.scss';

import { useEffect, useMemo, useState } from "react";
import { base64ToBlob, getMimeTypeFromBase64 } from "@utils/base64Utils";
import { Box, Button, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import cs from 'classnames';
import { useDispatch } from "react-redux";
import { changeLayout } from "@stores/states/layout-view/reducer";
import { convertBase64ToFileSize, downloadFile } from "@utils/file";
import "@cyntler/react-doc-viewer/dist/index.css";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from 'remark-breaks'
import { motion } from "framer-motion";

type Props = React.ComponentPropsWithRef<'div'> & CustomComponentProps;

const MAX_VIEW_FILE = 5;

const readRawFile = (filedata: string) => {
   // const base64 = filedata.split(',')[1];
   // const text = atob(base64);
   // return text;
   try {
      const base64 = filedata.split(',')[1];
      const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
      const text = new TextDecoder('utf-8').decode(binary);
      return text;
   } catch (error) {
      return filedata;
   }
}

const SUPPORTED_FILE_TYPE = {
   'pdf': 'pdf',
   'bmp': 'image',
   'gif': 'image',
   'jpg': 'image',
   'jpeg': 'image',
   'png': 'image',
   'webp': 'image',
   'csv': 'csv',
}

const RAW_FILE_TYPE: Record<string, string> = {
   'txt': 'text',
   'md': 'markdown',
   'json': 'json',
}

type FileType = {
   filename: string;
   filedata: string;
}

const ViewAllFileModal = ({ isOpen, onClose, onDelete, files }: { isOpen: boolean, onClose: () => void, onDelete: () => void, files: FileType[] }) => {
   return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered autoFocus={false}>
         <ModalOverlay />
         <ModalContent className={styles.modalContent}>
            <ModalCloseButton />
            <ModalBody>
               <Flex flexDir={'column'} gap={'12px'} paddingTop={'24px'} paddingBottom={'12px'}>
                  <Text fontSize={'16px'} fontWeight={'500'} lineHeight={'24px'}>All files in this task</Text>
                  <Flex flexDir={'column'} gap={'12px'} className={styles.modalFiles}>
                     {files.map((file, idx) => (
                        <FileItem onClick={onClose} className={styles.modalFile} key={`${file.filename}-${idx}`} filename={file.filename} filedata={file.filedata} />
                     ))}
                  </Flex>
               </Flex>
            </ModalBody>
         </ModalContent>
      </Modal>
   );
};


function MoreFiles({ files }: { files: FileType[] }) {

   const [isOpen, setIsOpen] = useState(false);

   return (
      <>
         <div className={styles.more} onClick={() => setIsOpen(true)}>
            <div className={styles.fileicon}>
               <div className={styles.fileicon__more__behind}>
                  <TxtIcon />
               </div>

               <div className={styles.fileicon__more}>
                  <TxtIcon />
               </div>
            </div>
            <div className={styles.fileinfo}>
               <span>View all files in this task (+{files.length - MAX_VIEW_FILE})</span>
            </div>
         </div>
         <ViewAllFileModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onDelete={() => setIsOpen(false)}
            files={files}
         />
      </>
   )
}

const MyNoRenderer = ({ document, fileName }) => {
   const fileText = fileName || document?.fileType || "";
 
   if (fileText) {
      return <div>No Renderer Error! ({fileText})</div>;
   }
 
   return <div>No Renderer Error!</div>;
};


function FileViewer({ filename, filedata }: FileType) {
   const dispatch = useDispatch();
   const [isViewer, setIsViewer] = useState(false);

   const fileExtension = useMemo(() => {
      return filename.split('.').pop() || getMimeTypeFromBase64(filedata)?.split('/')[1];
   }, [filename, filedata]);

   const isSupportedFile = useMemo(() => {
      return SUPPORTED_FILE_TYPE[fileExtension as keyof typeof SUPPORTED_FILE_TYPE];
   }, [fileExtension]);

   const fileUrl = useMemo(() => {
      try {
         return URL.createObjectURL(base64ToBlob(filedata));
      } catch (err) {
         console.error('Error creating object URL:', err);
         return null;
      }
   }, [filedata]);

   const fileContent = useMemo(() => {
      return readRawFile(filedata);
   }, [filedata]);

   useEffect(() => {
      setTimeout(() => {
         setIsViewer(true);
      }, 100);
   }, []);

   const renderFileContent = () => {
      if (!isSupportedFile) {
         if (fileExtension && RAW_FILE_TYPE[fileExtension]) {
            if (fileExtension === 'md') {
               return (
                  <Box
                     gap={'12px'}
                     height={'100%'}
                     width={'100%'}
                     padding={"24px"}
                     overflowY={"auto"}
                     className="markdown-body"
                  >
                     <Markdown
                        remarkPlugins={[remarkGfm, remarkBreaks]}
                        children={fileContent}
                     />
                  </Box>
               )
            }
            return (
               <Flex
                  gap={'12px'}
                  height={'100%'}
                  width={'100%'}
                  padding={"24px"}
                  overflowY={"auto"}
               >
                  <p
                     style={{
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-wrap',
                     }}
                  >{fileContent}</p>
               </Flex>
            )
         }
         return (
            <Flex
               flexDir={'column'}
               justifyContent={'center'}
               alignItems={'center'}
               gap={'12px'}
               height={'100%'}
               width={'100%'}
            >
               <Text>Unsupported file type</Text>
               <Button
                  onClick={() => {
                     const fileUrl = URL.createObjectURL(base64ToBlob(filedata));
                     downloadFile(fileUrl, filename);
                  }}
               >Download</Button>
            </Flex>
         )
      }

      return (
         <div className="file-viewer-container">
            {isViewer && fileUrl && (
               <DocViewer
                  documents={[
                     { uri: fileUrl }, // Remote file
                  ]}
                  pluginRenderers={DocViewerRenderers}
                  config={{
                     noRenderer: {
                        overrideComponent: MyNoRenderer,
                     },
                     header: {
                        disableHeader: true,
                        disableFileName: true,
                        retainURLParams: true,
                     },
                     csvDelimiter: ",", // "," as default,
                     pdfZoom: {
                        defaultZoom: 1.1, // 1 as default,
                        zoomJump: 0.2, // 0.1 as default,
                     },
                     pdfVerticalScrollByDefault: true, // false as default
                  }}
               />
            )}
         </div>
      );
   }

   return (
      <Box
         width={"100%"}
         height={"100%"}
         borderLeft={"1px solid #F6F6F6"}
         bg="#F6F6F6"
      >
         <Flex
            flexDir={"column"}
            width={"100%"}
            height={"100%"}
         >
            <Flex
               padding={"14px 24px"}
               background="linear-gradient(180deg, rgba(228, 229, 216, 0.6) 0%, rgba(203, 214, 232, 0.6) 100%)"
               backdropFilter="blur(15px)"
               justifyContent={"space-between"}
               alignItems={"center"}
            >
               <Flex gap={"8px"} alignItems={"center"}>
                  <TxtIcon size={32} />
                  <Text
                     fontSize={"16px"}
                     fontWeight={"500"}
                     lineHeight={"24px"}
                  >
                     {filename}
                  </Text>
               </Flex>

               <Flex>
                  <Button 
                     variant={"ghost"} 
                     size={"sm"} 
                     colorScheme={"gray"}
                     onClick={() => {
                        const fileUrl = URL.createObjectURL(base64ToBlob(filedata));
                        downloadFile(fileUrl, filename);
                     }}
                  >
                     <DownloadIcon />
                  </Button>
                  <Button 
                     variant={"ghost"}
                     size={"sm"}
                     colorScheme={"gray"}
                     onClick={() => {
                        dispatch(changeLayout({
                           isOpenAgentBar: true,
                           isOpenRightBar: false,
                           rightBarView: undefined
                        }))
                     }}
                  >
                     <CollapseIcon />
                  </Button>
               </Flex>
            </Flex>
            <Flex bg="#F6F6F6" flex={1} overflowY="hidden">
               <Flex flex={1} overflowY="auto">
                  {renderFileContent()}
               </Flex>
            </Flex>
         </Flex>
      </Box>
   )
}

function FileItem({ filename, filedata, className, onClick }: FileType & { className?: string, onClick?: () => void }) {
   const dispatch = useDispatch();
   const fileSize = useMemo(() => {
      return formatBytes(convertBase64ToFileSize(filedata));
   }, [filedata]);

   const fileExtension = useMemo(() => {
      return filename.split('.').pop() || getMimeTypeFromBase64(filedata)?.split('/')[1];
   }, [filename, filedata]);

   return (
      <div className={cs(styles.file, className)}
         onClick={() => {
            dispatch(changeLayout({
               isOpenAgentBar: false,
               isOpenRightBar: true,
               rightBarView: (
                  <Box
                     flex={1}
                     as={motion.div}
                     // initial={{ opacity: 0, x: '100%' }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: '100%' }}
                  >
                     <FileViewer key={filename} filename={filename} filedata={filedata} />
                  </Box>
               )
            }));
            onClick && onClick();
         }}
      >
         <div className={styles.fileicon}>
            <TxtIcon />
         </div>
         <div className={styles.fileinfo}>
            <div className={styles.filename}>{filename || 'Untitled'}</div>
            <div className={styles.filetype}>
               <span>{fileExtension}</span>
               <span>•</span>
               <span>{fileSize}</span>
            </div>
         </div>
      </div>
   )
}

function Files({ node, children, ...props }: Props) {
   const files = useMemo(() => {
      try {
         return (children as any[])
            .filter(item => typeof item !== 'string')
            .map(item => {
               const file = item?.props?.children?.filter(child => typeof child !== 'string');
               const filename = file.find(f => f.type === 'filename')?.props?.children;
               let filedata = file.find(f => f.type === 'filedata')?.props?.children;

               if (typeof filedata === 'string') {
                  return {
                     filename: `${filename}`.trim(),
                     filedata: filedata.trim(),
                  }
               }

               filedata = filedata.filter(child => typeof child !== 'string')[0]?.props?.children;

               return {
                  filename: `${filename}`.trim(),
                  filedata: filedata.trim(),
               }
            });
      } catch (error) {
         console.error('Error parsing files:', error);
         return [];
      }
   }, [children]);

   const renderFiles = () => {
      const renderFiles = files.slice(0, MAX_VIEW_FILE);
      return (
         <>
            {renderFiles.map((file, idx) => (
               <FileItem key={`${file.filename}-${idx}`} filename={file.filename} filedata={file.filedata} />
            ))}
            {files.length > MAX_VIEW_FILE && (
               <MoreFiles files={files} />
            )}
         </>
      )
   }

   return (
      <div className={styles.files}>
         {renderFiles()}
      </div>
   );
}

export default Files;
