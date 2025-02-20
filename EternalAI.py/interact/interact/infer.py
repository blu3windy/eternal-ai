
from dotenv import load_dotenv

import logging
from dataclasses import dataclass, asdict
from typing import List

from web3 import Web3
from web3.middleware import geth_poa_middleware

import os
import simplejson as json

load_dotenv()

def create_payload():




    print("create_payload method")

def send_infer():
    logging.info(f"Creating inference model...")
    if web3 is None:
        if HYBRID_MODEL_RPC_URL != "":
                web3 = Web3(Web3.HTTPProvider(HYBRID_MODEL_RPC_URL))
        else:
                web3 = Web3(Web3.HTTPProvider(os.getenv("HYBRID_MODEL_RPC_URL")))
                web3.middleware_onion.inject(geth_poa_middleware, layer=0)
    if web3.is_connected():
            if privateKey is None or len(privateKey) == 0:
                privateKey = os.getenv("PRIVATE_KEY")

            if model_address is None or model_address == "":
                model_address = HYBRID_MODEL_ADDRESS
                if model_address == "":
                    model_address = os.getenv("HYBRID_MODEL_ADDRESS")
            account = web3.eth.account.from_key(privateKey)
            account_address = Web3.to_checksum_address(account.address)

            req = LLMInferRequest()
            req.model = "NousResearch/Hermes-3-Llama-3.1-70B-FP8"
            req.messages = [LLMInferMessage(content="Can you tell me about BTC", role="user"),
                            LLMInferMessage(content="You are a BTC master", role="system")]
            json_request = json.dumps(asdict(req))
            hybrid_model_contract = web3.eth.contract(address=Web3.to_checksum_address(model_address),
                                                           abi=HYBRID_MODEL_ABI)

            func = hybrid_model_contract.functions.infer(json_request.encode("utf-8"), True)
            txn = func.build_transaction({
                'from': account_address,
                # 'gas': 200000,
                # 'gasPrice': web3.toWei('50', 'gwei'),
                'nonce': web3.eth.get_transaction_count(account_address),
            })

            signed_txn = web3.eth.account.sign_transaction(txn, privateKey)
            txn_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
            logging.info(f'Transaction hash: {web3.to_hex(txn_hash)}')
    print("send_infer method")

def get_agent(id):
    # HYBRID_MODEL_RPC_URL
    # HYBRID_MODEL_ADDRESS

    print("get_agent method")

class Infer:
    def __init__(self):
        # infura_url = "https://node.eternalai.org"
        # web3 = Web3(Web3.HTTPProvider(infura_url))
        self.web3 = web3
    
    def get_web3(self):
        return self.web3

    def get_provider(self):
        return self.web3.provider

    def get_contract(self, address, abi):
        contract = self.web3.eth.contract(address=address, abi=abi)
        return contract

    def infer(self):
        create_payload()
        send_infer()
        print("Interact infer", self.web3.is_connected())