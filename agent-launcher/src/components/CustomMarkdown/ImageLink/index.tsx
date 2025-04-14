import { CustomComponentProps } from "../types";


import { useMemo } from "react";

type Props = React.ComponentPropsWithRef<'div'> & CustomComponentProps;

function ImageLink({ node, children, ...props }: Props) {
   const link = useMemo(() => {
      try {
         const imageChildren = (children as any[])
            .filter(item => typeof item !== 'string')
         const src = imageChildren.find(child => child.type === 'image-src')?.props?.children.props.href;
         const alt = imageChildren.find(child => child.type === 'image-alt')?.props?.children;

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

export default ImageLink;
