import {Web3} from "web3";
import {AGENT_ABI, ETH_CHAIN_ID, IPFS, LIGHTHOUSE_IPFS, PROMPT_SCHEDULER_ABI, RPC_URL, WORKER_HUB_ABI} from "./const";
import {poaMiddleware, stringToBytes} from "./utils";

export class InferenceResponse {
    result_uri: string
    storage: string
    data: string

    constructor(result_uri: string, storage: string, data: string) {
        this.result_uri = result_uri;
        this.storage = storage;
        this.data = data;
    }

    static fromJSON(json: string): InferenceResponse {
        const parsed = JSON.parse(json);
        return Object.assign(new InferenceResponse('', '', ''), parsed);
    }
}

export class LLMInferMessage {
    content?: string = ""
    role?: string = ""

    constructor(content: string, role: string) {
        this.content = content
        this.role = content
    }
}

export class LLMInferRequest {
    messages: LLMInferMessage[] = []
    max_token?: number = 4096
    stream?: boolean = false
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

export class AgentInference {
    web3: any = null
    agent_address: string = ""

    create_web3 = (rpc: string) => {
        if (this.web3 == null) {
            if (rpc != "") {
                this.web3 = new Web3(rpc || Web3.givenProvider)
            } else {
                this.web3 = new Web3(RPC_URL.ETH_CHAIN_ID)
            }
            this.web3.middleware = {
                onion: {
                    inject: async () => {
                        const chain_id = await this.web3.eth.getChainId();
                        this.web3.eth.sendTransaction = poaMiddleware({chain_id: chain_id})(this.web3.eth.sendTransaction);
                    },
                },
            };
            this.web3.middleware.onion.inject();
        }
    }

    get_agent_address = (agent_address: string) => {
        if (!this.agent_address) {
            this.agent_address = agent_address
            if (this.agent_address == "") {
                throw new Error("Agent address missing")
            }
        }
    }

    get_system_prompt = async (agent_address: string, rpc: string) => {
        console.log("Get system prompt from agent...")
        this.create_web3(rpc)
        if (await this.web3.eth.net.isListening()) {
            this.get_agent_address(agent_address)
            const agent_contract = new this.web3.eth.Contract(AGENT_ABI, this.agent_address)
            try {
                const system_prompt = await agent_contract.methods.getSystemPrompt().call();
                return system_prompt;
            } catch (e) {
                console.log(e);
                throw e
            }
        }
        return ""
    }

    get_worker_hub_address = async (agent_address: string, rpc: string) => {
        this.create_web3(rpc)
        this.get_agent_address(agent_address)
        const agent_contract = new this.web3.eth.Contract(AGENT_ABI, this.agent_address)
        return await agent_contract.methods.getPromptSchedulerAddress().call()
    }

    create_inference_agent = async (private_key: string, agent_address: string, prompt: string, rpc: string) => {
        console.log("Creating inference agent...")
        if (!private_key) {
            throw new Error("Private key missing");
        }
        this.create_web3(rpc)
        if (await this.web3.eth.net.isListening()) {
            this.get_agent_address(agent_address);
            console.log("this.agent_address", this.agent_address)
            const account = this.web3.eth.accounts.privateKeyToAccount(private_key);
            this.web3.eth.accounts.wallet.add(account);
            const account_address = account.address

            const agent_contract = new this.web3.eth.Contract(AGENT_ABI, this.agent_address)
            const system_prompt = await this.get_system_prompt(agent_address, rpc)
            // console.log(`system_prompt: ${system_prompt}`)

            const req = new LLMInferRequest()
            req.messages = [
                new LLMInferMessage(prompt, "user"),
                new LLMInferMessage(system_prompt, "system")
            ];

            const json_request = JSON.stringify(req)
            const func = agent_contract.methods.prompt(stringToBytes(json_request));
            const gasPrice = await this.web3.eth.getGasPrice();
            const gas = await func.estimateGas();
            const nonce = await this.web3.eth.getTransactionCount(account.address);
            const transaction = {
                from: account_address,
                to: this.agent_address,
                gas: gas,
                gaPrice: this.web3.utils.toWei("1", "gwei"),
                nonce: nonce,
                data: func.encodeABI(),
                maxPriorityFeePerGas: this.web3.utils.toWei("1", "gwei"),
                maxFeePerGas: this.web3.utils.toWei("1", "gwei")
            };

            // console.log(transaction)

            const signedTransaction = await this.web3.eth.accounts.signTransaction(transaction, private_key);
            console.log("----------------------")
            const tx = await this.web3.eth.sendSignedTransaction(signedTransaction.rawTransaction);

            const tx_receipt = await waitForTransactionReceipt(this.web3, tx.transactionHash);
            console.log(`Transaction status: ${tx_receipt.status}`)

            console.log(`Transaction hash: ${tx_receipt.transactionHash}`)
            return tx_receipt.transactionHash;
        } else {
            return null
        }
    }

}

export class InferenceProcessing {
    web3: any = null
    workerhub_address: string = ""

    create_web3 = (rpc: string) => {
        if (this.web3 == null) {
            if (rpc != "") {
                this.web3 = new Web3(rpc || Web3.givenProvider)
            } else {
                this.web3 = new Web3(RPC_URL.ETH_CHAIN_ID)
            }
        }
    }

    get_workerhub_address = (worker_hub_address: string) => {
        if (!this.workerhub_address) {
            this.workerhub_address = worker_hub_address
            if (!this.workerhub_address) {
                throw new Error("missing worker hub address")
            }
        }
    }

    get_assignments_by_inference = async (worker_hub_address: string, inference_id: string, rpc: string) => {
        return null;
    }

    get_inference_by_inference_id = async (worker_hub_address: string, inference_id: number, rpc: string) => {
        this.create_web3(rpc);
        if (await this.web3.eth.net.isListening()) {
            this.get_workerhub_address(worker_hub_address)

            const contract = new this.web3.eth.Contract(PROMPT_SCHEDULER_ABI, this.workerhub_address);
            try {
                const inference_info = await contract.methods.getInferenceInfo(inference_id).call()
                const output = inference_info[10]
                const bytesData = this.web3.utils.hexToBytes(output);
                if (bytesData.length != 0) {
                    const result = await this.process_output_to_infer_response(bytesData);
                    if (result) {
                        return result;
                    } else {
                        return null;
                    }
                } else {
                    throw new Error(`waiting process inference ${inference_id}`)
                }
            } catch (e) {
                throw e;
            }
        } else {
            throw new Error("Web3 not connected");
        }
    }

    process_output = (out: any) => {
        const decoder = new TextDecoder('utf-8');
        const str: string = decoder.decode(out);
        try {
            const result = InferenceResponse.fromJSON(str)
            return result;
        } catch (e) {
            return null;
        }
    }

    process_output_to_infer_response = async (output: any) => {
        const infer_reponse = this.process_output(output);
        if (!infer_reponse) {
            return null
        } else {
            if (infer_reponse.storage == "lighthouse-filecoint" || infer_reponse.result_uri.includes("ipfs://")) {
                const light_house = infer_reponse.result_uri.replace(IPFS, LIGHTHOUSE_IPFS)
                const light_house_reponse = await fetch(light_house)
                if (light_house_reponse.ok) {
                    const result = await light_house_reponse.text();
                    return result;
                }
                return null;
            } else {
                if (infer_reponse.data != "") {
                    const decodedString = atob(infer_reponse.data);
                    return decodedString;
                }
                return null;
            }
        }
    }

    get_infer_id = async (worker_hub_address: string, tx_hash_hex: string, rpc: string) => {
        this.create_web3(rpc);
        if (await this.web3.eth.net.isListening()) {
            console.log(`Get infer Id from tx ${tx_hash_hex}`)
            this.get_workerhub_address(worker_hub_address);
            const tx_receipt = await this.web3.eth.getTransactionReceipt(tx_hash_hex);
            if (!tx_receipt || tx_receipt.status != 1) {
                console.log("Transaction receipt not found.")
            } else {
                const logs = tx_receipt.logs;
                if (logs.length > 0) {
                    const contract = new this.web3.eth.Contract(WORKER_HUB_ABI, this.workerhub_address);
                    for (const log of logs) {
                        try {
                            const event = WORKER_HUB_ABI.find(event => (event.type === "event" && event.name === 'NewInference'))
                            if (event) {
                                const decoded = this.web3.eth.abi.decodeLog(
                                    event.inputs,
                                    log.data,
                                    log.topics.slice(1)
                                );
                                // console.log("-------log.data", decoded);
                                const inferenceId = decoded.inferenceId;
                                // console.log('Inference ID:', inferenceId);
                                return inferenceId;
                            } else {
                                throw new Error("No Infer Id")
                            }
                        } catch (error) {
                            continue;
                        }
                    }
                    throw new Error("No Infer Id")
                }
            }
        } else {
            throw new Error("not connected")
        }
    }
}