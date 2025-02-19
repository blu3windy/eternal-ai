from web3 import Web3

def create_payload():
    print("create_payload method")

def send_infer():
    print("send_infer method")


class Infer:
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
        send_infer()
        print("Interact infer", self.web3.is_connected())