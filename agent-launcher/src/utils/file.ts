export const downloadFile = (url: string, filename: string) => {
   const a = document.createElement('a');
   a.href = url;
   a.download = filename;
   a.click();
};

export const convertBase64ToFileSize = (base64: string) => {
   // const base64Data = base64.split(',')[1];
   // const byteCharacters = atob(base64Data);
   // const byteNumbers = new Array(byteCharacters.length);
   // for (let i = 0; i < byteCharacters.length; i++) {
   //    byteNumbers[i] = byteCharacters.charCodeAt(i);
   // }
   // const file = new Blob([new Uint8Array(byteNumbers)], { type: 'text/plain' });
   // return file;
   try {
      const base64Length = base64.split(',')[1].length;
      const padding = (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
      const fileSizeInBytes = (base64Length * 3 / 4) - padding;
      return fileSizeInBytes
   } catch (error) {
      const base64Length = base64.length;
      const padding = (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
      const fileSizeInBytes = (base64Length * 3 / 4) - padding;
      return fileSizeInBytes
   }
}