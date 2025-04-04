import { parentPort, workerData } from 'worker_threads';
import { spawn } from 'child_process';

interface WorkerData {
  context?: string;
  buildId?: string;
  cmd?: string;
}

async function runDockerBuild() {
   try {
      
      const { cmd } = workerData;

      const buildProcess = spawn(cmd);


      buildProcess.stdout.on('data', (data: Buffer) => {
         parentPort?.postMessage({ type: 'build-update', data: data.toString() });
      });

      buildProcess.stderr.on('data', (data: Buffer) => {
         parentPort?.postMessage({ type: 'build-update', data: data.toString() });
      });

      buildProcess.on('close', (code: number) => {
         if (code === 0) {
            parentPort?.postMessage({ type: 'build-complete', data: 'Build finished successfully' });
         } else {
            parentPort?.postMessage({ type: 'build-error', data: `Build failed with code ${code}` });
         }
      });

      buildProcess.on('error', (err: Error) => {
         parentPort?.postMessage({ type: 'build-error', data: err.message });
      });
   } catch (err) {
      console.log('err', err);
      parentPort?.postMessage({ type: 'build-error', data: (err as Error).message });
   }
}

runDockerBuild();