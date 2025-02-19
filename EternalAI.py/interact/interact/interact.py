from web3 import Web3
from infer import infer, create_payload

class Interact:
    def __init__(self):
        infura_url = "https://node.eternalai.org"
        web3 = Web3(Web3.HTTPProvider(infura_url))
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
        infer()
        print("Interact infer", self.web3.is_connected())