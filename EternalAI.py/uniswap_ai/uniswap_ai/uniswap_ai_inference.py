import json
import logging
from dataclasses import dataclass
from typing import List

from web3 import Web3
import os

from uniswap_ai.const import HYBRID_MODEL_RPC_URL, HYBRID_MODEL_ABI, HYBRID_MODEL_ADDRESS


@dataclass
class Inference:
    user_prompt: str
    system_prompt: str


@dataclass
class LLMInferMessage:
    content: str
    role: str


@dataclass
class LLMInferRequest:
    messages: List[LLMInferMessage]
    model: str
    seed: int
    max_token: int
    temperature: float
    stream: bool


@dataclass
class HybridModelInference:
    web3: Web3 = None
    model_address: str = None

    def create_inference_model(self, privateKey: str):
        logging.info(f"Creating inference model...")

        if self.web3 is None:
            self.web3 = Web3(Web3.HTTPProvider(HYBRID_MODEL_RPC_URL))
        if self.web3.is_connected():
            if privateKey is None or len(privateKey) == 0:
                privateKey = os.getenv("PRIVATE_KEY")

            if self.model_address is None or self.model_address == "":
                self.model_address = HYBRID_MODEL_ADDRESS
                if self.model_address == "":
                    self.model_address = os.getenv("HYBRID_MODEL_ADDRESS")
            account = self.web3.eth.account.from_key(privateKey)
            account_address = Web3.to_checksum_address(account.address)

            req = LLMInferRequest
            req.model = "NousResearch/Hermes-3-Llama-3.1-70B-FP8"
            req.messages = [LLMInferMessage(content="Can you tell me about BTC", role="user"),
                            LLMInferMessage(content="You are a BTC master", role="system")]
            json_request = json.dumps(req)
            hybrid_model_contract = self.web3.eth.contract(address=self.model_address, abi=HYBRID_MODEL_ABI)

            txn = hybrid_model_contract.functions.infer(json_request, True).buildTransaction({
                'from': account_address,
                'gas': 200000,
                # 'gasPrice': web3.toWei('50', 'gwei'),
                'nonce': self.web3.eth.get_transaction_count(account_address),
            })

            signed_txn = self.web3.eth.account.sign_transaction(txn, privateKey)
            txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
            logging.info(f'Transaction hash: {self.web3.to_hex(txn_hash)}')
