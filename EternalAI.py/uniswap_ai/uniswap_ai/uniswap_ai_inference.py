import logging
import os
import simplejson as json

from dataclasses import dataclass, asdict
from typing import List
from web3 import Web3
from web3.middleware import geth_poa_middleware
from uniswap_ai.const import HYBRID_MODEL_ABI, HYBRID_MODEL_ADDRESS, AGENT_ABI, RPC_URL, ETH_CHAIN_ID, \
    WORKER_HUB_ADDRESS, WORKER_HUB_ABI


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
    model: str = ""
    max_token: int = 4096
    stream: bool = False


@dataclass()
class AgentInference:
    web3: Web3 = None
    agent_address: str = None

    def create_web3(self, rpc: str = ""):
        if self.web3 is None:
            if rpc != "":
                self.web3 = Web3(Web3.HTTPProvider(rpc))
            else:
                self.web3 = Web3(Web3.HTTPProvider(os.getenv("HYBRID_MODEL_RPC_URL")))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_agent_address(self, model: str):
        if self.agent_address is None or self.agent_address == "":
            if model != "":
                self.agent_address = model
            elif HYBRID_MODEL_ADDRESS != "":
                self.agent_address = HYBRID_MODEL_ADDRESS
            else:
                self.agent_address = os.getenv("HYBRID_MODEL_ADDRESS")

    def create_inference_agent(self, private_key: str, rpc: str = "", agent_address: str = "", model: str = ""):
        logging.info(f"Creating inference agent...")

        self.create_web3(rpc)
        if self.web3.is_connected():
            if private_key is None or len(private_key) == 0:
                private_key = os.getenv("PRIVATE_KEY")

            self.get_agent_address()
            account = self.web3.eth.account.from_key(private_key)
            account_address = Web3.to_checksum_address(account.address)

            req = LLMInferRequest()
            # req.model = "NousResearch/Hermes-3-Llama-3.1-70B-FP8"
            if model == "":
                raise Exception("invalid model name")
            req.model = model
            req.messages = [LLMInferMessage(content="Can you tell me about BTC", role="user"),
                            LLMInferMessage(content="You are a BTC master", role="system")]
            json_request = json.dumps(asdict(req))
            agent_contract = self.web3.eth.contract(address=Web3.to_checksum_address(self.agent_address),
                                                    abi=AGENT_ABI)

            func = agent_contract.functions.prompt(json_request.encode("utf-8"))
            txn = func.build_transaction({
                'from': account_address,
                # 'gas': 200000,
                # 'gasPrice': web3.toWei('50', 'gwei'),
                'nonce': self.web3.eth.get_transaction_count(account_address),
            })

            signed_txn = self.web3.eth.account.sign_transaction(txn, private_key)
            txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
            logging.info(f'Transaction hash: {self.web3.to_hex(txn_hash)}')


@dataclass()
class HybridModelInference:
    web3: Web3 = None
    model_address: str = None

    def create_web3(self, rpc: str = ""):
        if self.web3 is None:
            if rpc != "":
                self.web3 = Web3(Web3.HTTPProvider(rpc))
            else:
                # Default:
                self.web3 = Web3(Web3.HTTPProvider(RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_model_address(self, model_address: str = ""):
        if self.model_address is None or self.model_address == "":
            if model_address != "":
                self.model_address = model_address
            elif HYBRID_MODEL_ADDRESS != "":
                self.model_address = HYBRID_MODEL_ADDRESS
            else:
                self.model_address = os.getenv("HYBRID_MODEL_ADDRESS")

    def create_inference_model(self, private_key: str, rpc: str = "", model_address: str = "", model: str = ""):
        logging.info(f"Creating inference model...")

        self.create_web3(rpc)
        if self.web3.is_connected():
            if private_key is None or len(private_key) == 0:
                private_key = os.getenv("PRIVATE_KEY")
            logging.info(f"Private key {private_key}")
            self.get_model_address(model_address)
            account = self.web3.eth.account.from_key(private_key)
            account_address = Web3.to_checksum_address(account.address)
            logging.info(f"address: {account_address}")

            req = LLMInferRequest()
            # req.model = "NousResearch/Hermes-3-Llama-3.1-70B-FP8"
            if model == "":
                raise Exception("invalid model name")
            req.model = model
            req.messages = [LLMInferMessage(content="Can you tell me about BTC", role="user"),
                            LLMInferMessage(content="You are a BTC master", role="system")]
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
            txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
            logging.info(f'Transaction hash: {self.web3.to_hex(txn_hash)}')


@dataclass()
class InferenceProcessing:
    web3: Web3 = None
    workerhub_address: str = None

    def create_web3(self, rpc: str = ""):
        if self.web3 is None:
            if rpc != "":
                self.web3 = Web3(Web3.HTTPProvider(rpc))
            else:
                # Default:
                self.web3 = Web3(Web3.HTTPProvider(RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def get_workerhub_address(self):
        self.workerhub_address = WORKER_HUB_ADDRESS

    def get_infer_id(self, tx_hash: str, rpc: str = ""):
        self.create_web3(rpc)
        if self.web3.is_connected():
            logging.info(f'Get infer Id from tx {tx_hash}')
            tx_receipt = self.web3.eth.get_transaction_receipt(tx_hash)
            self.get_workerhub_address()
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
                            logging.info(f"Parsed Event Data: {event_data}")
                            if event_data.args is not None and event_data.args.inferenceId is not None:
                                return event_data.args.inferenceId
                        except Exception as e:
                            logging.error(e)

                    raise Exception("No Infer Id")

        else:
            raise Exception("not connected")
