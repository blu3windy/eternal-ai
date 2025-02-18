import {DECOMPRESS_SCRIPT, ETHERS_UMD_JS} from "./libs.ts";

export const ABC = 1
const RPC = "https://node.l2.trustless.computer/";

declare const ethers: any;
let provider;

export async function preload() {
    console.log(RPC);
    setTimeout(function () {
        provider = new ethers.providers.JsonRpcProvider(RPC);
        console.log(provider);
    }, 3000);

}

export async function loadScript() {
    try {
        const response = await fetch(DECOMPRESS_SCRIPT);
        const scriptContent = await response.text();
        const decompress = document.createElement('script');
        decompress.type = 'text/javascript';
        decompress.textContent = scriptContent;
        document.head.appendChild(decompress);
        console.log("load decompress", decompress);

        const ethers = document.createElement("script")
        ethers.innerHTML = `getGzipFile(dataURItoBlob("${ETHERS_UMD_JS}"));`
        document.body.appendChild(ethers);
        console.log("load ethers", ethers);
    } catch (error) {
        console.error("Error loading script:", error);
    }
}
