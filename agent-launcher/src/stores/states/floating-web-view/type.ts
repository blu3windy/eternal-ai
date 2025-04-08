

export type FloatingWebViewState = {
   isOpen: boolean;
   url: string;
   viewPosition: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
   // position: string;
   isMaximized: boolean;
   task: '' | 'Searching';
   taskProcessing?: string;
};
