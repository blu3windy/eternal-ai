import { CHAIN_CONFIG, CHAIN_CONFIG_TYPE } from "@constants/chains";
import deploys from "./abi/deploy/deploys.json";
import FileStoreAbi from "./abi/FileStore.sol/FileStore.abi.json";
import { ethers } from "ethers";

export async function readFileOnChain(chainId: number, fileName: string) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const deploy = deploys[chainId];
  const rpc = CHAIN_CONFIG[chainId as CHAIN_CONFIG_TYPE]?.rpcUrls?.default?.http[0];
        
  const provider = new ethers.providers.JsonRpcProvider(rpc);
  const contract = new ethers.Contract(
    deploy.contracts.FileStore.address,
    FileStoreAbi,
    provider
  );

  const fileExists = await contract.fileExists(fileName);
  if (fileExists) {
    const base64String = await contract.readFile(fileName);
    const data = atob(base64String);
    return data;
  }

  throw new Error('Filename is not exists');
}

export async function readFileOnLocal(fileName: string): Promise<string> {
  try {
    const data = await window.electronAPI.readFile(fileName);
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error; // Re-throw error if needed
  }
}

export async function getFilePathOnLocal(fileName: string): Promise<string> {
  try {
    const data = await window.electronAPI.getFilePath(fileName);
    return data;
  } catch (error) {
    return '';
  }
}

export async function checkFileExistsOnLocal(fileName: string) {
  try {
    return await window.electronAPI.accessFile(fileName); // Check if file exists
  } catch {
    // File does not exist
    return false;
  }
}

export async function writeFileToLocal(fileName: string, content: string) {
  try {
    return await window.electronAPI.writeFile(fileName, content);
  } catch {
    return undefined;
  }
}
