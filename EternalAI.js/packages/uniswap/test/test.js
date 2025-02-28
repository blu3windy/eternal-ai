import {prompt} from "./bundle.es.js";
////
import fetch from 'node-fetch';
import {createRequire} from 'module';
import {Script} from 'vm';

const require = createRequire(import.meta.url); // Để sử dụng CommonJS
function atob(str) {
    return Buffer.from(str, 'base64').toString('binary');
}
async function loadLibs(lib) {
    const response = await fetch(lib);
    const ethersScript = await response.text();

    const script = new Script(ethersScript);
    const context = {global: {}, atob, require};
    script.runInNewContext(context);

    return context.global.ethers;
}

async function main() {
    await loadLibs("https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js")
    await prompt("How much for 1 PEPE in USDT", "0x4a3dc71d1baa9405136dd496bd4a60193f37ccc6d5e47c1799e728339a007d1c")
}

main().catch(console.error);