import {
    BSC_CHAIN_ID,
    ETH_CHAIN_ID,
    getRPC,
    SYSTEM_PROMPT,
    V1,
    V2,
} from './const';
import {AgentInference, InferenceProcessing, APIInference} from './inference';
import {sleep} from './utils';
import {SwapReq, UniSwapAI} from './swap';
import {TransactionState} from './libs/providers';
import {TTransactionResponse} from './type';

export const call_uniswap = async (
        private_key: string,
        chain_id_swap: string,
        content: string
    ): Promise<TTransactionResponse> => {
        console.log(`**** call uniswap with content **** \n\n
              ${content} \n\n end content ****\n\n\n`);
        try {
            const uniswap_obj = new UniSwapAI();
            const req = SwapReq.fromJSON(content);
            switch (req.function_name) {
                case "swap": {
                    await req.convert_in_out();
                    console.log(`**** call uniswap with req **** \n ${JSON.stringify(req, null, 4)}`);
                    const {state, tx, message} = await uniswap_obj.swap_v3(
                        private_key,
                        req,
                        chain_id_swap
                    );
                    return {state, tx, message};
                }
                case "getPrice": {
                    console.log(`**** call get price with req **** \n ${JSON.stringify(req, null, 4)}`);
                    req.token_in_address = await req.convert_token_address(req.token_in);
                    console.log("aaaaaa", req.token_in_address)
                    const price = await req.get_price(req.token_in_address)
                    return {
                        state: null,
                        tx: null,
                        message: `token ${req.token_in} ${req.token_in_address}  price ${price}`
                    };
                }
                default: {
                    return {state: null, tx: null, message: content};
                }

            }

            // return {state: null, tx: null}
        } catch (e) {
            // console.log(e)
            return {
                state: TransactionState.Failed,
                tx: null,
                message: `call_uniswap error: ${(e as Error).message}`,
            };
        }
    }
;

export const process_infer = async (
    chain_id: string,
    tx_hash: string,
    rpc: string,
    worker_address: string
) => {
    if (V1.includes(chain_id) && V2.includes(chain_id)) {
        console.log(`${chain_id} is not support`);
        return null;
    }

    const infer_processing = new InferenceProcessing();
    const infer_id = await infer_processing.get_infer_id(
        worker_address,
        tx_hash,
        rpc
    );
    console.log(`infer id: ${infer_id}`);

    let result: any = '';
    if (V1.includes(chain_id)) {
        while (true) {
            try {
                result = await infer_processing.get_assignments_by_inference(
                    worker_address,
                    infer_id,
                    rpc
                );
                break;
            } catch (e) {
                console.log('Can not get result for inference, try again');
                await sleep(30);
            }
        }
    } else if (V2.includes(chain_id)) {
        while (true) {
            try {
                result = await infer_processing.get_inference_by_inference_id(
                    worker_address,
                    infer_id,
                    rpc
                );
                break;
            } catch (e) {
                console.log('Can not get result for inference, try again', e);
                await sleep(30);
            }
        }
    } else {
        console.log(`${chain_id} is not support`);
        return null;
    }

    if (result) {
        // console.log(`result: ${result}`)
    } else {
        console.log('result: None');
    }
    return result;
};

export const create_api_infer = async (
    host: string,
    prompt: string,
    model: string,
    private_key: string,
    chain_id_swap: string,
    api_key: string
): Promise<any> => {
    const api_infer = new APIInference(host);
    api_infer.set_api_key(api_key);
    try {
        const resp = await api_infer.create_infer(prompt, SYSTEM_PROMPT, model);
        let content_response = await api_infer.process_output(resp);
        const jsonMatch = content_response.match(/(\{.*?\})/s);
        if (jsonMatch) {
            content_response = jsonMatch[0];
            console.log(JSON.parse(content_response));
        } else {
            console.log('No JSON content found.');
            return {state: null, tx: null, message: content_response};
        }

        if (content_response) {
            const {state, tx, message} = await call_uniswap(
                private_key,
                chain_id_swap,
                content_response
            );
            return {state, tx, message};
        } else {
            return {state: null, tx: null, message: content_response};
        }
    } catch (e: any) {
        throw e;
    }
};

export const create_agent_infer = async (
    private_key: string,
    chain_id_infer: string,
    chain_id_swap: string,
    agent_address: string,
    prompt: string
): Promise<any> => {
    const rpc_infer = getRPC(chain_id_infer);
    if (!rpc_infer) {
        return null;
    }
    console.log('rpc', rpc_infer);
    const agent_infer = new AgentInference();
    const tx_hash = await agent_infer.create_inference_agent(
        private_key,
        agent_address,
        prompt,
        rpc_infer
    );
    // const tx_hash = '0xf05832974c4b8b002e68029be724e72ac3cc88f6387df6632f6f5e426b439fc3';
    console.log(`infer tx_hash: ${tx_hash}`);

    const worker_hub_address = await agent_infer.get_worker_hub_address(
        agent_address,
        rpc_infer
    );
    console.log(`worker_hub_address : ${worker_hub_address}`);

    const content_response = await process_infer(
        chain_id_infer,
        tx_hash,
        rpc_infer,
        worker_hub_address
    );
    if (content_response) {
        const {state, tx} = await call_uniswap(
            private_key,
            chain_id_swap,
            content_response
        );
        return {state, tx};
    } else {
        return null;
    }
};

export const uni_swap_ai = async (command: string, args: any) => {
    console.log(command, args);
    switch (command) {
        case 'agent-infer': {
            const {state, tx} = await create_agent_infer(
                args.private_key || process.env.PRIVATE_KEY,
                args.chain_id || BSC_CHAIN_ID,
                args.chain_id_swap || ETH_CHAIN_ID || '0x1',
                args.agent_address || process.env.AGENT_ADDRESS,
                args.prompt
            );
            if (state != null) {
                console.log(`swap tx ${JSON.stringify(tx, null, 4)} state ${state}`);
            }

            return {state, tx, message: ''};
        }
        case 'models-infer': {
            break;
        }
        case 'api-infer': {
            try {
                const {state, tx, message} = await create_api_infer(
                    args.host || process.env.HOST,
                    args.prompt,
                    args.model || process.env.MODEL,
                    args.private_key || process.env.PRIVATE_KEY,
                    args.chain_id_swap || ETH_CHAIN_ID || '0x1',
                    args.api_key || process.env.API_KEY
                );

                if (!!tx) {
                    console.log(`swap tx ${JSON.stringify(tx, null, 4)} state ${state}`);
                }
                console.log(`Status: ${state}`);
                if (!!message) {
                    console.log(`Agent: ${message}`);
                }
                return {state, tx, message};
            } catch (e: any) {
                throw e;
            }
        }
    }
};

export const prompt = async (prompt: string, private_key: string) => {
    try {
        const {state, tx} = await uni_swap_ai('api-infer', {
            prompt: prompt,
            private_key: private_key,
            model: 'gpt-4o-mini',
            api_key: '',
            host: 'https://api.openai.com/v1',
        });
        console.log(`swap tx ${JSON.stringify(tx, null, 4)} state ${state}`);
        return `Swapped with tx ${tx.transactionHash}`;
    } catch (e) {
        return `Swapped err ${e?.message}`;
    }
};
// for browser
// window.prompt = prompt
