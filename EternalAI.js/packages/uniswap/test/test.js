import uniswap from './bundle.umd.js';
////
import fetch from 'node-fetch';
import { createRequire } from 'module';
import { Script } from 'vm';

const require = createRequire(import.meta.url);

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}

async function loadLibs(lib) {
  const response = await fetch(lib);
  const ethersScript = await response.text();

  const script = new Script(ethersScript);
  const context = { global: {}, atob, require };
  script.runInNewContext(context);

  // return context.global.ethers;
}

await loadLibs(
  'https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js'
);
const prompt = {
  privateKey: 'YOUR_PRIVATE_KEY',
  messages: [
    {
      content: 'Swap 1 PEPE to ETH',
    },
  ],
};
const content = await uniswap.prompt(prompt);
console.log(content);
