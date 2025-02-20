import base64
import logging
import os

import requests
import simplejson as json

from dataclasses import dataclass, asdict
from typing import List
from web3 import Web3
from web3.types import HexStr
from web3.middleware import geth_poa_middleware
from uniswap_ai.const import HYBRID_MODEL_ABI, AGENT_ABI, RPC_URL, ETH_CHAIN_ID, WORKER_HUB_ABI, PROMPT_SCHEDULER_ABI, \
    LIGHTHOUSE_IPFS, IPFS


@dataclass()
class InferenceResponse:
    result_uri: str
    storage: str
    data: str


@dataclass
class Inference:
    user_prompt: str
    system_prompt: str


@dataclass()
class LLMInferMessage:
    content: str = ""
    role: str = ""


@dataclass()
class LLMInferRequest:
    messages: List[LLMInferMessage] = None
    max_token: int = 4096
    stream: bool = False


@dataclass()
class AgentInference:
    web3: Web3 = None
    agent_address: str = None

    def create_web3(self, rpc: str):
        if self.web3 is None:
            if rpc != "":
                self.web3 = Web3(Web3.HTTPProvider(rpc))
            else:
                # Default:
                self.web3 = Web3(Web3.HTTPProvider(RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_agent_address(self, agent_address: str):
        if self.agent_address is None or self.agent_address == "":
            self.agent_address = agent_address
            if self.agent_address == "":
                raise Exception("Agent address missing")

    def get_system_prompt(self, agent_address: str, rpc: str):
        logging.info(f"Get system prompt from agent...")

        self.create_web3(rpc)
        if self.web3.is_connected():
            self.get_agent_address(agent_address)
            agent_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.agent_address),
                                                    abi=AGENT_ABI)
            try:
                system_prompt = agent_contract.functions.getSystemPrompt().call()
                return system_prompt
            except Exception as e:
                logging.error(f'{e}')
                raise e
        return ""

    def get_worker_hub_address(self):
        self.get_agent_address('')
        agent_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.agent_address),
                                                abi=AGENT_ABI)
        return agent_contract.functions.getPromptSchedulerAddress().call()

    def create_inference_agent(self, private_key: str, agent_address: str, prompt: str, rpc: str):
        logging.info(f"Creating inference agent...")
        if private_key == "" or private_key is None:
            raise Exception("Private key missing")
        self.create_web3(rpc)
        if self.web3.is_connected():
            self.get_agent_address(agent_address)
            account = self.web3.eth.account.from_key(private_key)
            account_address = Web3.to_checksum_address(account.address)

            agent_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.agent_address),
                                                    abi=AGENT_ABI)
            system_prompt = self.get_system_prompt(agent_address, rpc)
            logging.info(f"system_prompt: {system_prompt}")
            req = LLMInferRequest()
            req.messages = [LLMInferMessage(content=prompt, role="user"),
                            LLMInferMessage(content=system_prompt, role="system")]
            json_request = json.dumps(asdict(req))

            func = agent_contract.functions.prompt(json_request.encode("utf-8"))
            txn = func.build_transaction({
                'from': account_address,
                # 'gas': 200000,
                # 'gasPrice': web3.toWei('50', 'gwei'),
                'nonce': self.web3.eth.get_transaction_count(account_address),
            })

            signed_txn = self.web3.eth.account.sign_transaction(txn, private_key)
            txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)

            tx_receipt = self.web3.eth.wait_for_transaction_receipt(txn_hash)
            logging.info(f"Transaction status: {tx_receipt['status']}")

            logging.info(f'Transaction hash: {self.web3.to_hex(txn_hash)}')
            return self.web3.to_hex(txn_hash)
        else:
            return None


@dataclass()
class HybridModelInference:
    web3: Web3 = None
    model_address: str = None

    def create_web3(self, rpc: str):
        if self.web3 is None:
            if rpc != "":
                self.web3 = Web3(Web3.HTTPProvider(rpc))
            else:
                # Default:
                self.web3 = Web3(Web3.HTTPProvider(RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_model_address(self, model_address: str):
        if self.model_address is None or self.model_address == "":
            self.model_address = model_address
            if self.model_address == "":
                raise Exception("No model")

    def create_inference_model(self, private_key: str, model_address: str,
                               system_prompt: str, prompt: str,
                               rpc: str):
        logging.info(f"Creating inference model...")
        if private_key == "" or private_key is None:
            raise Exception("Private key missing")
        self.create_web3(rpc)
        if self.web3.is_connected():
            logging.info(f"Private key {private_key}")
            self.get_model_address(model_address)
            account = self.web3.eth.account.from_key(private_key)
            account_address = Web3.to_checksum_address(account.address)
            logging.info(f"address: {account_address}")

            req = LLMInferRequest()
            req.messages = [LLMInferMessage(content=prompt, role="user"),
                            LLMInferMessage(content=system_prompt, role="system")]
            json_request = json.dumps(asdict(req))
            hybrid_model_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.model_address),
                                                           abi=HYBRID_MODEL_ABI)

            func = hybrid_model_contract.functions.infer(json_request.encode("utf-8"), True)
            txn = func.build_transaction({
                'from': account_address,
                # 'gas': 200000,
                # 'gasPrice': web3.toWei('50', 'gwei'),
                'nonce': self.web3.eth.get_transaction_count(account_address),
            })

            signed_txn = self.web3.eth.account.sign_transaction(txn, private_key)
            try:
                txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)

                tx_receipt = self.web3.eth.wait_for_transaction_receipt(txn_hash)
                logging.info(f"Transaction status: {tx_receipt['status']}")

                logging.info(f'Transaction hash: {self.web3.to_hex(txn_hash)}')
                return self.web3.to_hex(txn_hash)
            except Exception as e:
                raise e


@dataclass()
class InferenceProcessing:
    web3: Web3 = None
    workerhub_address: str = None

    def create_web3(self, rpc: str):
        if self.web3 is None:
            if rpc != "":
                self.web3 = Web3(Web3.HTTPProvider(rpc))
            else:
                # Default:
                self.web3 = Web3(Web3.HTTPProvider(RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_workerhub_address(self, worker_hub_address: str):
        if self.workerhub_address is None or self.workerhub_address == "":
            self.workerhub_address = worker_hub_address
            if self.workerhub_address == "":
                raise Exception(f"missing worker hub address")

    def get_assignments_by_inference(self, worker_hub_address: str, inference_id: int, rpc: str):
        self.create_web3(rpc)
        if self.web3.is_connected():
            self.get_workerhub_address(worker_hub_address)
            worker_hub_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.workerhub_address),
                                                         abi=WORKER_HUB_ABI)
            try:
                assignments_info = worker_hub_contract.functions.getAssignmentsByInference(inference_id).call()
                for assignment in assignments_info:
                    assignment_info = worker_hub_contract.functions.getAssignmentInfo(assignment).call()
                    logging.info(f'Assignments info: {assignment_info}')
                    output = assignment_info[7]
                    if len(output) != 0:
                        result = self.process_output_to_infer_response(output)
                        if result is not None:
                            return result
                        else:
                            continue
                    else:
                        continue
                raise Exception(f'Could not get result')
            except Exception as e:
                raise e
        else:
            raise Exception('Web3 not connected')

    def get_inference_by_inference_id(self, worker_hub_address: str, inference_id: int, rpc: str):
        self.create_web3(rpc)
        if self.web3.is_connected():
            self.get_workerhub_address(worker_hub_address)
            contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.workerhub_address),
                                              abi=PROMPT_SCHEDULER_ABI)
            try:
                inference_info = contract.functions.getInferenceInfo(inference_id).call()
                output = inference_info[10]
                if len(output) != 0:
                    result = self.process_output_to_infer_response(output)
                    if result is not None:
                        return result
                else:
                    raise Exception(f'Could not get result')
            except Exception as e:
                raise e
        raise Exception("Could not get inference info")

    def process_output(self, out: bytes):
        json_string = out.decode('utf-8')
        temp = json.loads(json_string)
        try:
            result = InferenceResponse(**temp)
            return result
        except:
            return None

    def process_output_to_infer_response(self, output: bytes):
        infer_reponse = self.process_output(output)
        if infer_reponse is None:
            return None
        if infer_reponse.storage == "lighthouse-filecoint" or "ipfs://" in infer_reponse.result_uri:
            light_house = infer_reponse.result_uri.replace(IPFS, LIGHTHOUSE_IPFS)
            light_house_reponse = requests.get(light_house)
            if light_house_reponse.status_code == 200:
                return light_house_reponse.text
            else:
                return None
        else:
            if infer_reponse.data != "":
                decoded = base64.b64decode(infer_reponse.data)
                decoded_string = decoded.decode('utf-8')
                return decoded_string
            return None

    def get_infer_id(self, worker_hub_address: str, tx_hash_hex: str, rpc: str):
        self.create_web3(rpc)
        if self.web3.is_connected():
            logging.info(f'Get infer Id from tx {tx_hash_hex}')
            tx_receipt = self.web3.eth.get_transaction_receipt(HexStr(tx_hash_hex))
            self.get_workerhub_address(worker_hub_address)
            if tx_receipt is None:
                logging.error("Transaction receipt not found.")
            else:
                # Access logs from the transaction receipt
                logs = tx_receipt['logs']
                if len(logs) > 0:
                    contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.workerhub_address),
                                                      abi=WORKER_HUB_ABI)
                    for log in logs:
                        try:
                            event_data = contract.events.NewInference().process_log(log)
                            # logging.info(f"Parsed Event Data: {event_data}")
                            if event_data.args is not None and event_data.args.inferenceId is not None:
                                return event_data.args.inferenceId
                        except Exception as e:
                            logging.error(e)

                    raise Exception("No Infer Id")

        else:
            raise Exception("not connected")
