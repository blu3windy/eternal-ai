import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

interface WebViewProps {
  url: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const WebView: React.FC<WebViewProps> = ({ url, width = '100%', height = '600px', className }) => {
   const iframeRef = useRef<HTMLIFrameElement>(null);

   // Validate URL
   const isValidUrl = (urlString: string): boolean => {
      try {
         new URL(urlString);
         return true;
      } catch {
         return false;
      }
   };

   useEffect(() => {
      const iframe = iframeRef.current;
      if (!iframe) return;

      // Handle iframe load event
      const handleLoad = () => {
         try {
            const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDocument) return;

            // Add click event listener to all links in iframe
            iframeDocument.addEventListener('click', (e) => {
               const link = (e.target as HTMLElement).closest('a');
               if (link) {
                  e.preventDefault();
                  const href = link.href;
                  
                  // Handle external links
                  if (link.target === '_blank' || !href.startsWith(window.location.origin)) {
                     console.log('External link clicked:', href);
                     // Use electron API if available
                     if (window.electronAPI?.openExternal) {
                        window.electronAPI.openExternal(href);
                     } else {
                        // Fallback to window.open
                        window.open(href, '_blank', 'noopener,noreferrer');
                     }
                  } else {
                     // Handle internal navigation
                     iframe.src = href;
                  }
               }
            }, true);
         } catch (error) {
            // Handle cross-origin restrictions
            console.warn('Cannot access iframe content due to same-origin policy:', error);
         }
      };

      iframe.addEventListener('load', handleLoad);

      return () => {
         iframe.removeEventListener('load', handleLoad);
      };
   }, []);

   if (!isValidUrl(url)) {
      console.error('Invalid URL provided to WebView');
      return null;
   }

   return (
      <Box width={width} height={height} className={className}>
         <iframe
            ref={iframeRef}
            src={url}
            style={{ 
               width: '100%', 
               height: '100%',
               border: 'none'
            }}
            // Security attributes
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            referrerPolicy="no-referrer"
            loading="lazy"
            title="Web content"
         />
      </Box>
   );
};

export default WebView; 