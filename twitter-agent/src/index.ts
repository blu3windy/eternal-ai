import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { handlePrompt } from './prompt';

dotenv.config();

const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

async function main() {
  console.log(`Starting Twitter Agent in ${NODE_ENV} mode on port ${PORT}`);
  
  // Khởi tạo wallet từ private key
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    throw new Error('PRIVATE_KEY is required in .env file');
  }
  
  const wallet = new ethers.Wallet(privateKey);
  console.log(`Agent wallet address: ${wallet.address}`);
  
  // Xử lý các prompt từ Eternal AI
  handlePrompt(wallet);
}

main().catch(console.error); 