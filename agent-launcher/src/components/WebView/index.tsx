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

  useEffect(() => {
    const webview = webviewRef.current;
    if (!webview) return;

    const handleNewWindow = (e: any) => {
      // Handle external links through the system browser
      if (e.url) {
        globalThis.electronAPI.openExternal(e.url);
      }
    };

    // Add event listeners
    webview.addEventListener('new-window', handleNewWindow);

    return () => {
      webview.removeEventListener('new-window', handleNewWindow);
    };
  }, []);

  return (
    <Box width={width} height={height} className={className}>
      <webview
        ref={webviewRef}
        src={url}
        style={{ width: '100%', height: '100%' }}
        // Enable necessary webview features
        webpreferences="contextIsolation, nodeIntegration=false"
        // Allow same origin policy for security
        allowpopups="true"
      />
    </Box>
  );
};

export default WebView; 