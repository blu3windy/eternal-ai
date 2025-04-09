import Docker from 'dockerode';
import { BrowserWindow, ipcMain } from 'electron';
import { EMIT_EVENT_NAME } from '../share/event-name';
import debounce from 'lodash.debounce';

const docker = new Docker({ socketPath: '/var/run/docker.sock' }); // Adjust for your OS

const getContainers = async () => {
   const containers = await docker.listContainers({ all: true });
   const detailedContainers: any[] = [];

   for (const containerInfo of containers) {
      const container = docker.getContainer(containerInfo.Id);

      // const inspectData = await container.inspect();
      console.log('LEON inspectData', container);
      // const container = docker.getContainer(containerInfo.Id);
      // const inspectData = await container.inspect();
      detailedContainers.push({
         ...containerInfo,
         // SizeRw: inspectData.SizeRw || 0, // Writable layer size in bytes
         // SizeRootFs: inspectData.SizeRootFs || 0
      });
   }
   return detailedContainers;
}

const getImages = async () => {
   return await docker.listImages();
}  

// Fetch and send updated container list
async function updateContainers(win: BrowserWindow) {
   try {
      const containers = await getContainers();
      win.webContents.send(EMIT_EVENT_NAME.ON_CONTAINERS_UPDATE, containers);
   } catch (err) {
      console.error('Error fetching containers:', err);
   }
}
  
// Fetch and send updated image list, debounce the function
async function updateImages(win: BrowserWindow) {
   try {
      const images = await getImages();
      win.webContents.send(EMIT_EVENT_NAME.ON_IMAGES_UPDATE, images);
   } catch (err) {
      console.error('Error fetching images:', err);
   }
}

const debouncedUpdateImages = debounce(updateImages, 300);
const debouncedUpdateContainers = debounce(updateContainers, 300);

// Get initial Docker data including containers and images
async function getInitialDockerData(win: BrowserWindow) {
   try {
      // Get containers
      const containers = await getContainers();
      
      // Get images
      const images = await getImages();
      
      console.log('LEON getInitialDockerData', { containers, images });
      
      // Send initial data to renderer
      win.webContents.send(EMIT_EVENT_NAME.GET_INITIAL_DOCKER_DATA, {
         containers,
         images,
      });
      
      return {
         containers,
         images,
      };
   } catch (error) {
      const err = error as Error;
      console.error('Error fetching initial Docker data:', err);
      // Send error to renderer
      win.webContents.send(EMIT_EVENT_NAME.ON_CONTAINERS_UPDATE, {
         type: 'initial_data',
         error: err.message
      });
      throw err;
   }
}

// Register the IPC handler
ipcMain.handle(EMIT_EVENT_NAME.GET_INITIAL_DOCKER_DATA, async (event) => {
   const win = BrowserWindow.fromWebContents(event.sender);
   if (!win) {
      throw new Error('No window found for the event sender');
   }
   return getInitialDockerData(win);
});

function listenToDockerEvents(win: BrowserWindow) {
   // Get Docker events stream
   docker.getEvents((err, stream) => {
      if (err) {
         console.error('Error connecting to Docker events:', err);
         return;
      }
  
      stream.on('data', (event) => {
         const eventData = JSON.parse(event.toString());
         const { Type, Action, Actor } = eventData;
  
         // Filter for container and image events
         if (Type === 'container' || Type === 'image') {
            console.log(`Docker event: ${Type} ${Action}`, Actor);
  
            // Fetch updated data based on event type
            if (Type === 'container') {
               debouncedUpdateContainers(win);
            } else if (Type === 'image') {
               debouncedUpdateImages(win);
            }
         }
      });
  
      stream.on('error', (err) => {
         console.error('Docker event stream error:', err);
      });
   });
}

export { listenToDockerEvents, getInitialDockerData };