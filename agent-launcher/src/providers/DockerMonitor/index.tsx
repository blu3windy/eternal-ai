import { createContext, useContext, useEffect, useRef } from 'react';
import useDockerMonitorState from './useDockerMonitorState';
interface DockerContextType {
   containers: any[];
   images: any[];
}

const initialState: DockerContextType = {
   containers: [],
   images: [],
}

const DockerMonitorContext = createContext<DockerContextType>(initialState);

const DockerMonitorProvider = ({ children }) => {
   const { images, setImages, containers, setContainers } = useDockerMonitorState();
   const initRef = useRef(false);

   const listener = () => {
      // Listen for container updates
      const containerUpdateListener = (updatedContainers) => {
         console.log('LEON containerUpdateListener', updatedContainers);
         setContainers(updatedContainers);
      };

      window.electronAPI.onContainersUpdate(containerUpdateListener);

      // Listen for image updates
      const imageUpdateListener = (updatedImages) => {
         console.log('LEON imageUpdateListener', updatedImages);
         setImages(updatedImages);
      };
      
      window.electronAPI.onImagesUpdate(imageUpdateListener);
   }

   useEffect(() => {
      if (initRef.current) return;
      initRef.current = true;
      listener();
   }, []);

   return (
      <DockerMonitorContext.Provider value={{ containers, images }}>
         {children}
      </DockerMonitorContext.Provider>
   );
};

const useDockerMonitor = () => {
   const context = useContext(DockerMonitorContext);
   if (context === undefined) {
      throw new Error("useDockerMonitor must be used within a DockerMonitorProvider");
   }
   return context;
};

export { DockerMonitorProvider, useDockerMonitor };
