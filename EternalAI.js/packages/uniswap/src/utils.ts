export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms * 1000));
}

export function stringToBytes(str: string): any {
    const encoder = new TextEncoder();
    return encoder.encode(str);
}

export const poaMiddleware = (options: any) => {
    return (next: any) => {
        return async (payload: any) => {
            if (payload.method === 'eth_sendTransaction' || payload.method === 'eth_call') {
                console.log("------options", options)
                const {from} = payload.params[0];
                payload.params[0].chainId = options.chain_id;
            }
            return next(payload);
        };
    };
};