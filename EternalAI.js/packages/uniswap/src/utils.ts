export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

export function stringToBytes(str: string): any {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

export const waitForTransactionReceipt = async (web3: any, txHash: string, timeout: number = 120, poll_latency: number = 0.1) => {
    let receipt = null;
    while (receipt === null) {
        receipt = await web3.eth.getTransactionReceipt(txHash);
        if (receipt === null) {
            await new Promise(resolve => setTimeout(resolve, timeout * 1000));
        }
    }
    return receipt;
}