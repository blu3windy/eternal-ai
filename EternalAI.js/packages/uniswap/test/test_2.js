// import {prompt} from "./bundle.es.js";
import zlib from 'zlib';
import fetch from 'node-fetch';
import {createRequire} from 'module';
import {Script} from 'vm';

const require = createRequire(import.meta.url);

function atob(str) {
    return Buffer.from(str, 'base64').toString('binary');
}

function loadGzippedBase64(base64Content) {
    const buffer = Buffer.from(base64Content, 'base64');
    const decompressed = zlib.gunzipSync(buffer).toString('utf-8');
    return decompressed;
}

async function loadPrompt(base64GzippedContent) {
    const jsCode = loadGzippedBase64(base64GzippedContent);
    const script = new Script(jsCode);
    const context = {global: {}, atob, require};
    script.runInNewContext(context);
}


async function loadLibs(lib) {
    const response = await fetch(lib);
    const ethersScript = await response.text();

    const script = new Script(ethersScript);
    const context = {global: {}, atob, require};
    script.runInNewContext(context);
}

await loadLibs("https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js")
await loadPrompt("");
const content = await prompt("Swap 1 PEPE to USDT", "0x4a3dc71d1baa9405136dd496bd4a60193f37ccc6d5e47c1799e728339a007d1c")
console.log(content);
