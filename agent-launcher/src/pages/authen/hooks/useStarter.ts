import EaiSigner from '@helpers/signer';
import { create } from 'zustand';

interface StarterState {
    settingDocker: boolean;
    setSettingDocker: (settingDocker: boolean) => void;

    dockerIsFinished: boolean;
    setDockerIsFinished: (dockerIsFinished: boolean) => void;

    inviteCode: string;
    setInviteCode: (inviteCode: string) => void;
    
    hasUser: boolean;
    setHasUser: (hasUser: boolean) => void;
}

const useStarter = create<StarterState>((set) => ({
   settingDocker: true,
   setSettingDocker: (settingDocker: boolean) => set({ settingDocker }),

   dockerIsFinished: false,
   setDockerIsFinished: (dockerIsFinished: boolean) => set({ dockerIsFinished }),

   inviteCode: "",
   setInviteCode: (inviteCode: string) => {
      set({ inviteCode })
      EaiSigner.setInviteCode(inviteCode);
   },

   hasUser: false,
   setHasUser: (hasUser: boolean) => set({ hasUser }),
}));

export default useStarter;