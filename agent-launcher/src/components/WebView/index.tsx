import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

interface WebViewProps {
  url: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

const WebView: React.FC<WebViewProps> = ({ url, width = '100%', height = '600px', className }) => {
   const webviewRef = useRef<HTMLWebViewElement>(null);

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
      const webview = webviewRef.current;
      if (!webview) return;

      // Validate URL before setting
      if (!isValidUrl(url)) {
         console.error('Invalid URL provided to WebView');
         return;
      }

      const handleNewWindow = (e: any) => {
         // Handle external links through the system browser
         if (e.url && isValidUrl(e.url)) {
            globalThis.electronAPI.openExternal(e.url);
         }
      };

      const handleError = (e: any) => {
         console.error('WebView error:', e);
      };

      // Add event listeners
      webview.addEventListener('new-window', handleNewWindow);
      webview.addEventListener('console-message', handleError);

      // Set security headers
      webview.setAttribute('webpreferences', 'contextIsolation=true, nodeIntegration=false, sandbox=true');
      webview.setAttribute('allowpopups', 'false');
      webview.setAttribute('webSecurity', 'true');

      return () => {
         webview.removeEventListener('new-window', handleNewWindow);
         webview.removeEventListener('console-message', handleError);
      };
   }, [url]);

   return (
      <Box width={width} height={height} className={className}>
         <webview
            ref={webviewRef}
            src={url}
            style={{ width: '100%', height: '100%' }}
            // Security attributes
            webpreferences="contextIsolation=true, nodeIntegration=false, sandbox=true"
            allowpopups={false}
            security="true"
            // Additional security headers
            partition="persist:main"
         />
      </Box>
   );
};

export default WebView; 