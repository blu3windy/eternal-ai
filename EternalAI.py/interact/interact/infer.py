from dotenv import load_dotenv
import logging
from dataclasses import dataclass, asdict
from typing import List
from web3 import Web3
from web3.types import HexStr
from web3.middleware import geth_poa_middleware
import os
import simplejson as json
import requests
import base64

from interact.const import HYBRID_MODEL_ABI, RPC_URL, ETH_CHAIN_ID, WORKER_HUB_ABI, PROMPT_SCHEDULER_ABI, LIGHTHOUSE_IPFS, IPFS

load_dotenv()

@dataclass
class LLMInferMessage:
    content: str = ""
    role: str = ""

@dataclass
class LLMInferRequest:
    messages: List[LLMInferMessage] = None
    model: str = ""
    max_token: int = 4096
    stream: bool = False

@dataclass
class AgentInference:
    web3: Web3 = None
    agent_address: str = None

    def create_web3(self, rpc: str):
        if self.web3 is None:
            self.web3 = Web3(Web3.HTTPProvider(rpc or RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_agent_address(self, agent_address: str):
        if not self.agent_address:
            self.agent_address = agent_address
            if not self.agent_address:
                raise Exception("Agent address missing")

    def get_system_prompt(self, agent_address: str, rpc: str):
        logging.info("Get system prompt from agent...")
        self.create_web3(rpc)
        if self.web3.is_connected():
            self.get_agent_address(agent_address)
            agent_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.agent_address), abi=AGENT_ABI)
            try:
                return agent_contract.functions.getSystemPrompt().call()
            except Exception as e:
                logging.error(e)
                raise e
        return ""

    def get_worker_hub_address(self):
        self.get_agent_address('')
        agent_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.agent_address), abi=AGENT_ABI)
        return agent_contract.functions.getPromptSchedulerAddress().call()

    def create_inference_agent(self, private_key: str, agent_address: str, prompt: str, rpc: str):
        logging.info("Creating inference agent...")
        if not private_key:
            raise Exception("Private key missing")
        self.create_web3(rpc)
        if self.web3.is_connected():
            self.get_agent_address(agent_address)
            account = self.web3.eth.account.from_key(private_key)
            account_address = Web3.to_checksum_address(account.address)
            agent_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.agent_address), abi=AGENT_ABI)
            system_prompt = self.get_system_prompt(agent_address, rpc)
            logging.info(f"system_prompt: {system_prompt}")
            req = LLMInferRequest(messages=[LLMInferMessage(content=prompt, role="user"), LLMInferMessage(content=system_prompt, role="system")])
            json_request = json.dumps(asdict(req))
            func = agent_contract.functions.prompt(json_request.encode("utf-8"))
            txn = func.build_transaction({'from': account_address, 'nonce': self.web3.eth.get_transaction_count(account_address)})
            signed_txn = self.web3.eth.account.sign_transaction(txn, private_key)
            txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
            tx_receipt = self.web3.eth.wait_for_transaction_receipt(txn_hash)
            logging.info(f"Transaction status: {tx_receipt['status']}")
            logging.info(f'Transaction hash: {self.web3.to_hex(txn_hash)}')
            return self.web3.to_hex(txn_hash)
        return None

@dataclass
class InferenceProcessing:
    web3: Web3 = None
    workerhub_address: str = None

    def create_web3(self, rpc: str):
        if self.web3 is None:
            self.web3 = Web3(Web3.HTTPProvider(rpc or RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_workerhub_address(self, worker_hub_address: str):
        if not self.workerhub_address:
            self.workerhub_address = worker_hub_address
            if not self.workerhub_address:
                raise Exception("Missing worker hub address")

    def get_assignments_by_inference(self, worker_hub_address: str, inference_id: int, rpc: str):
        self.create_web3(rpc)
        if self.web3.is_connected():
            self.get_workerhub_address(worker_hub_address)
            worker_hub_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.workerhub_address), abi=WORKER_HUB_ABI)
            try:
                assignments_info = worker_hub_contract.functions.getAssignmentsByInference(inference_id).call()
                for assignment in assignments_info:
                    assignment_info = worker_hub_contract.functions.getAssignmentInfo(assignment).call()
                    logging.info(f'Assignments info: {assignment_info}')
                    output = assignment_info[7]
                    if output:
                        result = self.process_output_to_infer_response(output)
                        if result:
                            return result
                raise Exception("Could not get result")
            except Exception as e:
                raise e
        else:
            raise Exception('Web3 not connected')

    def get_inference_by_inference_id(self, worker_hub_address: str, inference_id: int, rpc: str):
        self.create_web3(rpc)
        if self.web3.is_connected():
            self.get_workerhub_address(worker_hub_address)
            contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.workerhub_address), abi=PROMPT_SCHEDULER_ABI)
            try:
                inference_info = contract.functions.getInferenceInfo(inference_id).call()
                output = inference_info[10]
                if output:
                    result = self.process_output_to_infer_response(output)
                    if result:
                        return result
                raise Exception("Could not get result")
            except Exception as e:
                raise e
        raise Exception("Could not get inference info")

    def process_output(self, out: bytes):
        json_string = out.decode('utf-8')
        temp = json.loads(json_string)
        try:
            return InferenceResponse(**temp)
        except:
            return None

    def process_output_to_infer_response(self, output: bytes):
        infer_response = self.process_output(output)
        if not infer_response:
            return None
        if infer_response.storage == "lighthouse-filecoint" or "ipfs://" in infer_response.result_uri:
            light_house = infer_response.result_uri.replace(IPFS, LIGHTHOUSE_IPFS)
            light_house_response = requests.get(light_house)
            if light_house_response.status_code == 200:
                return light_house_response.text
            return None
        if infer_response.data:
            decoded = base64.b64decode(infer_response.data)
            return decoded.decode('utf-8')
        return None

    def get_infer_id(self, worker_hub_address: str, tx_hash_hex: str, rpc: str):
        self.create_web3(rpc)
        if self.web3.is_connected():
            logging.info(f'Get infer Id from tx {tx_hash_hex}')
            tx_receipt = self.web3.eth.get_transaction_receipt(HexStr(tx_hash_hex))
            self.get_workerhub_address(worker_hub_address)
            if not tx_receipt:
                logging.error("Transaction receipt not found.")
            else:
                logs = tx_receipt['logs']
                if logs:
                    contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.workerhub_address), abi=WORKER_HUB_ABI)
                    for log in logs:
                        try:
                            event_data = contract.events.NewInference().process_log(log)
                            if event_data.args and event_data.args.inferenceId:
                                return event_data.args.inferenceId
                        except Exception as e:
                            logging.error(e)
                    raise Exception("No Infer Id")
        else:
            raise Exception("Not connected")

@dataclass
class Infer:
    web3: Web3 = None
    model_address: str = None

    def create_web3(self, rpc: str):
        if self.web3 is None:
            self.web3 = Web3(Web3.HTTPProvider(rpc or RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_model_address(self, model_address: str):
        if not self.model_address:
            self.model_address = model_address
            if not self.model_address:
                raise Exception("No model")

    def create_inference_model(self, private_key: str, model_address: str, system_prompt: str, prompt: str, rpc: str):
        logging.info("Creating inference model...")
        if not private_key:
            raise Exception("Private key missing")
        self.create_web3(rpc)
        if self.web3.is_connected():
            logging.info(f"Private key {private_key}")
            self.get_model_address(model_address)
            account = self.web3.eth.account.from_key(private_key)
            account_address = Web3.to_checksum_address(account.address)
            logging.info(f"address: {account_address}")
            req = LLMInferRequest(messages=[LLMInferMessage(content=prompt, role="user"), LLMInferMessage(content=system_prompt, role="system")])
            json_request = json.dumps(asdict(req))
            hybrid_model_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.model_address), abi=HYBRID_MODEL_ABI)
            func = hybrid_model_contract.functions.infer(json_request.encode("utf-8"), True)
            txn = func.build_transaction({'from': account_address, 'nonce': self.web3.eth.get_transaction_count(account_address)})
            signed_txn = self.web3.eth.account.sign_transaction(txn, private_key)
            try:
                txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
                tx_receipt = self.web3.eth.wait_for_transaction_receipt(txn_hash)
                logging.info(f"Transaction status: {tx_receipt['status']}")
                logging.info(f'Transaction hash: {self.web3.to_hex(txn_hash)}')
                return self.web3.to_hex(txn_hash)
            except Exception as e:
                raise e

    def get_web3(self):
        return self.web3

    def get_provider(self):
        return self.web3.provider

    def get_contract(self, address, abi):
        return self.web3.eth.contract(address=address, abi=abi)

    def infer(self):
        create_payload()
        send_infer()
        print("Interact infer", self.web3.is_connected())