import {prompt} from "./bundle.es.js";

////
import fetch from 'node-fetch';
import {createRequire} from 'module';
import {Script} from 'vm';

const require = createRequire(import.meta.url); // Để sử dụng CommonJS

async function loadEthers() {
    const response = await fetch('https://cdn.jsdelivr.net/npm/ethers@5.0.0/dist/ethers.umd.min.js');
    const ethersScript = await response.text();

    const script = new Script(ethersScript);
    const context = {global: {}, require};
    script.runInNewContext(context);

    return context.global.ethers;
}

async function main() {
    const ethers = await loadEthers();
    await prompt("How much for 1 EAI in USDT", "0x4a3dc71d1baa9405136dd496bd4a60193f37ccc6d5e47c1799e728339a007d1c")
}

main().catch(console.error);