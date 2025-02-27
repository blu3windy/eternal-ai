import {APIInference} from "../../uniswap/src/inference";
import {SYSTEM_PROMPT} from "./const";

export const create_api_infer = async (
    host: string,
    prompt: string,
    model: string,
    private_key: string,
    api_key: string
): Promise<any> => {
    const api_infer = new APIInference(host);
    api_infer.set_api_key(api_key);
    try {
        const resp = await api_infer.create_infer(prompt, SYSTEM_PROMPT, model);
        let content_response = await api_infer.process_output(resp);
        return {state: null, tx: null, message: content_response}
    } catch (e: any) {
        throw e
    }

}

export const polymarket_ai = async (command: string, args: any) => {
    console.log(command, args);
    switch (command) {
        case 'api-infer': {
            try {
                const {state, tx, message} = await create_api_infer(
                    args.host || process.env.HOST,
                    args.prompt,
                    args.model || process.env.MODEL,
                    args.private_key || process.env.PRIVATE_KEY,
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
                throw e
            }
        }
    }
    return {message: ""};
}

// for browser
/*export const prompt = async (prompt: string, private_key: string) => {
    try {
        const {state, tx} = await uni_swap_ai("api-infer", {
            prompt: prompt,
            private_key: private_key,
            model: "gpt-4o-mini",
            api_key: "",
            host: "https://api.openai.com/v1",
        })
        console.log(`swap tx ${JSON.stringify(tx, null, 4)} state ${state}`);
        return `Swapped with tx ${tx.transactionHash}`;
    } catch (e) {
        return `Swapped err ${e?.message}`;
    }

}

window.prompt = prompt*/
