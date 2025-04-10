import { create } from 'zustand';

interface DockerMonitorState {
   containers: any[];
   images: any[];
   setContainers: (containers: any[]) => void;
   setImages: (images: any[]) => void;
}

const useDockerMonitorState = create<DockerMonitorState>((set) => ({
   containers: [],
   images: [],
   setContainers: (containers) => set({ containers }),
   setImages: (images) => set({ images }),
}));

export default useDockerMonitorState;
