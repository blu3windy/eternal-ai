import { create } from 'zustand';

interface ForgotPassState {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useForgotPass = create<ForgotPassState>((set) => ({
   isOpen: false,
   onOpen: () => set({ isOpen: true }),
   onClose: () => set({ isOpen: false }),
}));

export default useForgotPass;