import { create } from 'zustand';

interface StarterState {
    checking: boolean;
    setChecking: (checking: boolean) => void;
    

    isFinished: boolean;
    setIsFinished: (isFinished: boolean) => void;
}

const useStarter = create<StarterState>((set) => ({
   checking: true,
   setChecking: (checking: boolean) => set({ checking }),

   isFinished: false,
   setIsFinished: (isFinished: boolean) => set({ isFinished }),
}));

export default useStarter;