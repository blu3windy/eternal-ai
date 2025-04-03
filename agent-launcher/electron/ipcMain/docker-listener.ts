import Docker from 'dockerode';
import { BrowserWindow } from 'electron';
const docker = new Docker();

// Fetch and send updated container list
async function updateContainers(win: BrowserWindow) {
   try {
      const containers = await docker.listContainers({ all: true });
      win.webContents.send('docker-containers-update', containers);
   } catch (err) {
      console.error('Error fetching containers:', err);
   }
}
  
// Fetch and send updated image list
async function updateImages(win: BrowserWindow) {
   try {
      const images = await docker.listImages();
      win.webContents.send('docker-images-update', images);
   } catch (err) {
      console.error('Error fetching images:', err);
   }
}


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
               updateContainers(win);
            } else if (Type === 'image') {
               updateImages(win);
            }
         }
      });
  
      stream.on('error', (err) => {
         console.error('Docker event stream error:', err);
      });
   });
}

export default listenToDockerEvents;