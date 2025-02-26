import {AGENT_ABI, ETH_CHAIN_ID, IPFS, LIGHTHOUSE_IPFS, PROMPT_SCHEDULER_ABI, RPC_URL, WORKER_HUB_ABI} from "./const";
import {stringToBytes, waitForTransactionReceipt} from "./utils";
import {ethers} from "ethers";

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
        this.role = role
    }
}

export class LLMInferRequest {
    messages: LLMInferMessage[] = []
    max_token?: number = 4096
    stream?: boolean = false
}

export class AgentInference {
    web3_provider: any = null
    agent_address: string = ""

    create_web3_provider = (rpc: string) => {
        if (this.web3_provider == null) {
            if (rpc != "") {
                this.web3_provider = new ethers.providers.JsonRpcProvider(rpc)
            } else {
                this.web3_provider = new ethers.providers.JsonRpcProvider(RPC_URL.ETH_CHAIN_ID)
            }
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
        this.create_web3_provider(rpc)
        if (await this.web3_provider.getNetwork()) {
            this.get_agent_address(agent_address)
            const agent_contract = new ethers.Contract(this.agent_address, AGENT_ABI, this.web3_provider)
            try {
                const system_prompt = await agent_contract.getSystemPrompt();
                return system_prompt;
            } catch (e) {
                console.log(e);
                throw e
            }
        }
        return ""
    }

    get_worker_hub_address = async (agent_address: string, rpc: string) => {
        this.create_web3_provider(rpc)
        this.get_agent_address(agent_address)
        const agent_contract = new ethers.Contract(this.agent_address, AGENT_ABI, this.web3_provider)
        return await agent_contract.getPromptSchedulerAddress()
    }

    create_inference_agent = async (private_key: string, agent_address: string, prompt: string, rpc: string) => {
        console.log("Creating inference agent...")
        if (!private_key) {
            throw new Error("Private key missing");
        }
        this.create_web3_provider(rpc)
        if (await this.web3_provider.getNetwork()) {
            this.get_agent_address(agent_address);
            console.log("this.agent_address", this.agent_address)
            const wallet = new ethers.Wallet(private_key, this.web3_provider)
            const account_address = wallet.address
            // console.log(await wallet.getBalance())

            const agent_contract = new ethers.Contract(this.agent_address, AGENT_ABI, wallet)
            // const system_prompt = await this.get_system_prompt(agent_address, rpc)
            // console.log(`system_prompt: ${system_prompt}`)

            const req = new LLMInferRequest()
            req.messages = [
                new LLMInferMessage(prompt, "user"),
                // new LLMInferMessage(system_prompt, "system")
            ];

            const json_request = JSON.stringify(req)
            const prompt_data = stringToBytes(json_request);
            const call_data = agent_contract.interface.encodeFunctionData('prompt', [prompt_data]);
            const [nonce, gasLimit, gasPrice] = await Promise.all([
                this.web3_provider.getTransactionCount(wallet.address),
                agent_contract.estimateGas.prompt(prompt_data),
                wallet.provider.getGasPrice()
            ])
            const transaction = {
                from: account_address,
                to: this.agent_address,
                gasLimit: gasLimit,
                gasPrice: gasPrice,
                nonce: nonce,
                data: call_data,
            };
            const tx = await wallet.sendTransaction(transaction);
            console.log(`send tx: ${tx.hash}`)
            const tx_receipt = await waitForTransactionReceipt(this.web3_provider, tx.hash, 3);
            console.log(`Transaction status: ${tx_receipt.status}`)

            console.log(`Transaction hash: ${tx_receipt.transactionHash}`)
            return tx_receipt.transactionHash;
        } else {
            return null
        }
    }

}

export class InferenceProcessing {
    web3_provider: any = null
    workerhub_address: string = ""

    create_web3_provider = (rpc: string) => {
        if (this.web3_provider == null) {
            if (rpc != "") {
                this.web3_provider = new ethers.providers.JsonRpcProvider(rpc)
            } else {
                this.web3_provider = new ethers.providers.JsonRpcProvider(RPC_URL.ETH_CHAIN_ID)
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
        this.create_web3_provider(rpc);
        if (await this.web3_provider.eth.net.isListening()) {
            this.get_workerhub_address(worker_hub_address)
            const worker_hub_contract = new this.web3_provider.eth.Contract(WORKER_HUB_ABI, this.workerhub_address);
            const assignments_info = await worker_hub_contract.methods.getAssignmentsByInference(inference_id).call()
            for (const assignment of assignments_info) {
                const assignment_info = await worker_hub_contract.methods.getAssignmentInfo(assignment).call()
                const output = assignment_info[7]
                const bytesData = this.web3_provider.utils.hexToBytes(output);
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
            }
        } else {
            throw new Error("Web3 not connected");
        }
    }

    get_inference_by_inference_id = async (worker_hub_address: string, inference_id: number, rpc: string) => {
        this.create_web3_provider(rpc);
        if (await this.web3_provider.getNetwork()) {
            this.get_workerhub_address(worker_hub_address)

            const contract = new ethers.Contract(this.workerhub_address, PROMPT_SCHEDULER_ABI, this.web3_provider);
            try {
                const inference_info = await contract.getInferenceInfo(inference_id)
                const output = inference_info[10]
                const bytesData = ethers.utils.arrayify(output);
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
                console.log("light", light_house)
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
        this.create_web3_provider(rpc);
        if (await this.web3_provider.getNetwork()) {
            console.log(`Get infer Id from tx ${tx_hash_hex}`)
            this.get_workerhub_address(worker_hub_address);
            const tx_receipt = await this.web3_provider.getTransactionReceipt(tx_hash_hex);
            if (!tx_receipt || tx_receipt.status != 1) {
                console.log("Transaction receipt not found.")
            } else {
                const logs = tx_receipt.logs;
                if (logs.length > 0) {
                    const contract = new ethers.Contract(this.workerhub_address, WORKER_HUB_ABI, this.web3_provider);
                    for (const log of logs) {
                        try {
                            const iface = new ethers.utils.Interface(WORKER_HUB_ABI)
                            const decodedLog = iface.parseLog(log)
                            if (decodedLog.name == "NewInference") {
                                const inferenceId = decodedLog.args.inferenceId;
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