import React, { useEffect, useRef } from 'react';
import { Box } from '@chakra-ui/react';

interface WebViewProps {
  url: string;
  width?: string | number;
  height?: string | number;
  className?: string;
}

interface WebViewElement extends HTMLElement {
  executeJavaScript: (code: string) => void;
}

// Declare the electron API type
declare global {
  interface Window {
    electronAPI: {
      openExternal: (url: string) => void;
    };
  }
}

const WebView: React.FC<WebViewProps> = ({ url, width = '100%', height = '600px', className }) => {
   const webviewRef = useRef<WebViewElement>(null);

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

      console.log('WebView component mounted');

      // Validate URL before setting
      if (!isValidUrl(url)) {
         console.error('Invalid URL provided to WebView');
         return;
      }

      const handleConsoleMessage = (e: any) => {
         console.log('Console message received:', e);
         // Only log actual errors, not our debug messages or non-critical warnings
         if (e.message && 
             !e.message.includes('Link clicked:') && 
             !e.message.includes('Third-party cookie') &&
             !e.message.includes('Content Security Policy') &&
             !e.message.includes('CORS policy') &&
             !e.message.includes('Access-Control-Allow-Origin') 
            ) {
            console.error('WebView error:', e);

            if (e.message.includes('External link clicked in webview')){
               console.log('External link clicked in webview:', e.message);
               if (window.electronAPI && window.electronAPI.openExternal) {
                  window.electronAPI.openExternal(e.message.replace('External link clicked in webview:', ''));
               } else {
                  console.error('electronAPI not available');
               }
            }
         }
      };

      // Add event listeners
      webview.addEventListener('console-message', handleConsoleMessage);

      // Set security headers and preferences
      const webPreferences = [
         'contextIsolation=true',
         'nodeIntegration=false',
         'sandbox=true',
         'webSecurity=true',
         'allowRunningInsecureContent=false',
         'webviewTag=true'
      ].join(',');

      webview.setAttribute('webpreferences', webPreferences);
      webview.setAttribute('webSecurity', 'true');

      // Debug: Log when webview is ready
      webview.addEventListener('dom-ready', () => {
         console.log('WebView DOM is ready');
         // Set CSP headers
         webview.executeJavaScript(`
            const meta = document.createElement('meta');
            meta.httpEquiv = 'Content-Security-Policy';
            meta.content = "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';";
            document.head.appendChild(meta);

            // Add click event listener to all links
            document.addEventListener('click', function(e) {
               const link = e.target.closest('a');
               if (link) {
                  console.log('Link clicked in webview:', link.href);
                  if (link.target === '_blank') {
                     console.log('External link clicked in webview:', link.href);
                     e.preventDefault();
                     e.stopPropagation();
                  }
               }
            }, true);
         `);
      });

      return () => {
         webview.removeEventListener('console-message', handleConsoleMessage);
      };
   }, [url]);

   return (
      <Box width={width} height={height} className={className}>
         <webview
            ref={webviewRef}
            src={url}
            style={{ width: '100%', height: '100%' }}
            // Security attributes
            webpreferences="contextIsolation=true, nodeIntegration=false, sandbox=true, webSecurity=true, allowRunningInsecureContent=false, webviewTag=true"
            security="true"
            // Additional security headers
            partition="persist:main"
         />
      </Box>
   );
};

export default WebView; 