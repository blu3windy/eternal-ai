import {BSC_CHAIN_ID, getRPC, RPC_URL, V1, V2} from "./const";
import {AgentInference, InferenceProcessing} from "./inference";
import {sleep} from "./utils";
import {SwapReq, UniSwapAI} from "./swap";

export const call_uniswap = async (private_key: string, chain_id: number, rpc: string, content: string) => {
    console.log(`**** call uniswap with content **** \n\n
            ${content} \n\n end content ****\n\n\n`)
    try {
        const jsonMatch = content.match(/(\{.*?\})/s);
        if (jsonMatch) {
            content = jsonMatch[0];
        } else {
            console.log("No JSON content found.");
        }

        // console.log(`**** call uniswap with content ${content}`)

        const uniswap_obj = new UniSwapAI()
        const req = SwapReq.fromJSON(content)
        await req.convert_in_out()
        console.log(`**** call uniswap with req **** \n ${JSON.stringify(req, null, 4)}`)
        const {state, tx} = await uniswap_obj.swap_v3(private_key, req, chain_id, rpc)
        return {state, tx};
    } catch (e) {
        return null
    }
}


export const process_infer = async (chain_id: string, tx_hash: string, rpc: string, worker_address: string) => {
    if (V1.includes(chain_id) && V2.includes(chain_id)) {
        console.log(`${chain_id} is not support`)
        return null
    }

    const infer_processing = new InferenceProcessing();
    const infer_id = await infer_processing.get_infer_id(worker_address, tx_hash, rpc);
    console.log(`infer id: ${infer_id}`)

    let result: any = "";
    if (V1.includes(chain_id)) {
        while (true) {
            try {
                result = await infer_processing.get_assignments_by_inference(
                    worker_address,
                    infer_id,
                    rpc)
                break;
            } catch (e) {
                console.log('Can not get result for inference, try again')
                await sleep(30);
            }
        }
    } else if (V2.includes(chain_id)) {
        while (true) {
            try {
                result = await infer_processing.get_inference_by_inference_id(
                    worker_address,
                    infer_id,
                    rpc)
                break;
            } catch (e) {
                console.log('Can not get result for inference, try again', e)
                await sleep(30);
            }
        }
    } else {
        console.log(`${chain_id} is not support`)
        return null;
    }

    if (result) {
        // console.log(`result: ${result}`)
    } else {
        console.log('result: None')
    }
    return result
}

export const create_agent_infer = async (private_key: string, chain_id: string, agent_address: string, prompt: string) => {
    const rpc = getRPC(chain_id)
    if (!rpc) {
        return null;
    }
    console.log("rpc", rpc)
    const agent_infer = new AgentInference()
    // const tx_hash = await agent_infer.create_inference_agent(private_key, agent_address, prompt, rpc)
    const tx_hash = '0x731dd5cafe4b5e9b530ec60900285eb6e46cf0a244bd5a664be8946e1e0f1523';
    console.log(`infer tx_hash: ${tx_hash}`)

    const worker_hub_address = await agent_infer.get_worker_hub_address(agent_address, rpc)
    console.log(`worker_hub_address : ${worker_hub_address}`)

    const content_response = await process_infer(chain_id, tx_hash, rpc, worker_hub_address)
    if (content_response) {
        const {state, tx} = await call_uniswap(private_key, parseInt(chain_id, 16), rpc, content_response);
        return {state, tx}
    } else {
        return null
    }
}

export const uni_swap_ai = async (command: string, args: any) => {
    switch (command) {
        case "agent-infer": {
            const {state, tx} = await create_agent_infer(
                args.private_key || process.env.PRIVATE_KEY,
                args.chain_id || BSC_CHAIN_ID,
                args.agent_address || process.env.AGENT_ADDRESS,
                args.prompt
            )
            console.log(`swap tx ${tx} state ${state}`);
        }
    }
}