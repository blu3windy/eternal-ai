/**
 * Extract file extension from base64 string
 * @param base64String - The base64 string to extract extension from
 * @returns The file extension (e.g., 'png', 'jpg', 'pdf') or null if not found
 */
export const getFileExtensionFromBase64 = (base64String: string): string | null => {
   // Check if the string is empty or not a string
   if (!base64String || typeof base64String !== 'string') {
      return null;
   }

   // Handle data URI format
   if (base64String.startsWith('data:')) {
      // Extract MIME type
      const matches = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      
      if (matches && matches.length > 1) {
         const mimeType = matches[1];
         
         // Map common MIME types to extensions
         const mimeToExtension: { [key: string]: string } = {
            'image/jpeg': 'jpg',
            'image/jpg': 'jpg',
            'image/png': 'png',
            'image/gif': 'gif',
            'image/bmp': 'bmp',
            'image/webp': 'webp',
            'image/svg+xml': 'svg',
            'application/pdf': 'pdf',
            'application/json': 'json',
            'text/plain': 'txt',
            'text/html': 'html',
            'text/css': 'css',
            'text/javascript': 'js',
            'application/javascript': 'js',
            'application/xml': 'xml',
            'application/zip': 'zip',
            'application/x-zip-compressed': 'zip',
            'application/msword': 'doc',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
            'application/vnd.ms-excel': 'xls',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
            'application/vnd.ms-powerpoint': 'ppt',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx'
         };

         // Return the mapped extension or extract from MIME type
         return mimeToExtension[mimeType] || mimeType.split('/')[1];
      }
   }

   // For base64 strings without data URI, try to detect file type from the content
   try {
      // Convert first few characters to check file signature
      const buffer = Buffer.from(base64String, 'base64').slice(0, 4);
      const bytes = [...buffer];
      
      // Check file signatures (magic numbers)
      if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) {
         return 'jpg';
      }
      if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47) {
         return 'png';
      }
      if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
         return 'gif';
      }
      if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
         return 'pdf';
      }
   } catch (error) {
      console.error('Error detecting file type from base64:', error);
   }

   return null;
};

/**
 * Get MIME type from base64 string
 * @param base64String - The base64 string to extract MIME type from
 * @returns The MIME type or null if not found
 */
export const getMimeTypeFromBase64 = (base64String: string): string | null => {
   if (!base64String || typeof base64String !== 'string') {
      return null;
   }

   if (base64String.startsWith('data:')) {
      const matches = base64String.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
      if (matches && matches.length > 1) {
         return matches[1];
      }
   }

   return null;
};

/**
 * Check if a string is a valid base64 string
 * @param str - The string to check
 * @returns boolean indicating if the string is valid base64
 */
export const isValidBase64 = (str: string): boolean => {
   if (!str || typeof str !== 'string') {
      return false;
   }

   // Remove data URI prefix if present
   const base64Data = str.includes('base64,') ? str.split('base64,')[1] : str;

   try {
      return btoa(atob(base64Data)) === base64Data;
   } catch (err) {
      return false;
   }
}; 

export const base64ToBlob = (base64: string) => {
   // Remove data URI prefix if present
   const base64Data = base64.includes('base64,') ? base64.split('base64,')[1] : base64;
   
   try {
      const byteString = atob(base64Data);
      const mimeType = getMimeTypeFromBase64(base64);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
         ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ia], { type: mimeType || undefined });
   } catch (err) {
      console.error('Error converting base64 to blob:', err);
      return new Blob([], { type: 'application/octet-stream' });
   }
};