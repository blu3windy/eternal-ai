import { ethers } from 'ethers';
import RockPaperScissorsABI from '../contracts/RockPaperScissors.json';

const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS'; // Thay thế bằng địa chỉ contract đã triển khai

export const connectToContract = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    RockPaperScissorsABI.abi,
    signer
  );
};

export const playGame = async (choice: number) => {
  const contract = await connectToContract();
  const tx = await contract.play(choice);
  await tx.wait();
  return tx;
};

export const getCurrentGame = async (address: string) => {
  const contract = await connectToContract();
  return await contract.getCurrentGame(address);
};

export const getScore = async (address: string) => {
  const contract = await connectToContract();
  return await contract.getScore(address);
}; 