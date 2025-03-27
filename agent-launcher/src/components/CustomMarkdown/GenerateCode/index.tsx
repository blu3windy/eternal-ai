import { Flex, Text } from '@chakra-ui/react';
import copy from 'copy-to-clipboard';
import { DetailedHTMLProps, HTMLAttributes, memo, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';

import s from './styles.module.scss';
import { CustomComponentProps } from '../types';
import SvgInset from "@components/SvgInset";

type Props = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  CustomComponentProps;

const GeneralCode = memo(function ({ children, className, ...rest }: Props) {
   const [isCopied, setIsCopied] = useState<boolean>(false);
   const match = /language-(\w+)/.exec(className || '');
   const codeText = String(children).replace(/\n$/, '');

   const copyCode = () => {
      copy(codeText);
      setIsCopied(true);
      setTimeout(() => {
         setIsCopied(false);
      }, 1000);
   };

   return match ? (
      <>
         <Flex className={s.codeHeader}>
            <Text className={s.text} fontWeight={600} fontFamily={'Inter'}>{match?.[1]}</Text>
            <button className={s.copyBtn} onClick={copyCode}>
               <SvgInset
                  svgUrl={isCopied ? 'icons/ic-check.svg' : 'icons/copy_ic.svg'}
               />
               <Text className={s.text} fontWeight={400} fontFamily={'Inter'}>{isCopied ? 'Copied!' : 'Copy code'}</Text>
            </button>
         </Flex>
         <SyntaxHighlighter
            {...(rest as any)}
            customStyle={{
               marginTop: 0,
               borderTopLeftRadius: 0,
               borderTopRightRadius: 0,
               background: '#FAFAFA',
               fontFamily: 'Inter'
            }}
            PreTag="div"
            children={codeText}
            language={match?.[1]}
            // style={dracula}
         />
      </>
   ) : (
      <code {...rest} className={className}>
         {children}
      </code>
   );
});

export default GeneralCode;
