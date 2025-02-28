import { create } from 'zustand';

interface StarterState {
    checking: boolean;
    setChecking: (checking: boolean) => void;
}

const useStarter = create<StarterState>((set) => ({
   checking: true,
   setChecking: (checking: boolean) => set({ checking }),
}));

export default useStarter;