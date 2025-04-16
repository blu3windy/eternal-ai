import { CustomComponentProps } from "../types";


import { useMemo } from "react";

type Props = React.ComponentPropsWithRef<'div'> & CustomComponentProps;

function IframeLink({ node, children, ...props }: Props) {
   const link = useMemo(() => {
      try {
         const iframeChildren = (children as any[])
            .filter(item => typeof item !== 'string')
         const src = iframeChildren.find(child => child.type === 'iframe-src')?.props?.children.props.href;
         const alt = iframeChildren.find(child => child.type === 'iframe-alt')?.props?.children;

         return {
            src,
            alt,
         }
      } catch (error) {
         console.error('Error parsing files:', error);
         return null;
      }
   }, [children]);

   if (!link || !link.src || typeof link.src !== 'string') {
      return <></>;
   }

   return (
      <div>
         <iframe src={link.src} />
      </div>
   );
}

export default IframeLink;
