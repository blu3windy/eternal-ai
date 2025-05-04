import { Wallet } from 'ethers';
import { PromptRequest, PromptResponse, HandlePrompt } from './types';

const ETERNAL_AI_API = 'https://agent.api.eternalai.org/api/utility/twitter/post';

export const handlePrompt: HandlePrompt = async (wallet) => {
  try {
    // Tạo timestamp
    const timestamp = Date.now().toString();
    
    // Ký timestamp với private key
    const signature = await wallet.signMessage(timestamp);
    
    // Tạo headers cho request
    const headers = {
      'XXX-Address': wallet.address,
      'XXX-Message': timestamp,
      'XXX-Signature': signature,
      'Content-Type': 'application/json'
    };
    
    // Xử lý các prompt từ Eternal AI
    // TODO: Implement actual prompt handling logic
    
    console.log('Agent is ready to handle prompts');
  } catch (error) {
    console.error('Error handling prompt:', error);
  }
}; 