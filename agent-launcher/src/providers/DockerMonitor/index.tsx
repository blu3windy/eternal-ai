import { createContext, useCallback, useContext, useEffect } from 'react';
import useDockerMonitorState from './useDockerMonitorState';
import debounce from 'lodash.debounce';

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

   // debounce the setContainers and setImages
   const debouncedSetContainers = useCallback(debounce(setContainers, 300), [setContainers]);
   const debouncedSetImages = useCallback(debounce(setImages, 300), [setImages]);  

   useEffect(() => {

      console.log('LEON useEffect');   
      // Fetch initial Docker data
      window.electronAPI.getInitialDockerData().then(({ containers, images }) => {
         console.log('LEON getInitialDockerData', { containers, images });
         debouncedSetContainers(containers);
         debouncedSetImages(images);
      });

      // Listen for container updates
      const containerUpdateListener = (updatedContainers) => {
         console.log('LEON containerUpdateListener', updatedContainers);
         debouncedSetContainers(updatedContainers);
      };

      window.electronAPI.onContainersUpdate(containerUpdateListener);

      // Listen for image updates
      const imageUpdateListener = (updatedImages) => {
         console.log('LEON imageUpdateListener', updatedImages);
         debouncedSetImages(updatedImages);
      };
      
      window.electronAPI.onImagesUpdate(imageUpdateListener);

      // Cleanup listeners on unmount
      return () => {
         // Note: Cleanup logic for listeners can be added here if needed
      };
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
