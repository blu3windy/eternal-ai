from web3 import Web3
from uniswap.const import rpc_url
from dataclasses import dataclass
import os
from dotenv import load_dotenv

load_dotenv()


@dataclass
class SwapReq:
    token_a: str
    token_b: str
    token_a_amount: int
    token_b_out_min: int


@dataclass
class UniSwap:
    web3: Web3

    def swap(self, privateKey: str, req: SwapReq):
        if self.web3 is None:
            self.web3 = Web3(Web3.HTTPProvider(rpc_url))
        print(self.web3.is_connected())
        if privateKey is None or len(privateKey) == 0:
            privateKey = os.getenv("PRIVATE_KEY")
        account = self.web3.eth.account.from_key(privateKey)
        account_address = account.address

        amount_in = self.web3.to_wei(req.token_a_amount, 'ether')
        amount_out_min = web3.to_wei(req.token_b_out_min, 'ether')
        deadline = self.web3.eth.get_block('latest')['timestamp'] + 120

        uniswap_router = self.web3.eth.contract(address=uniswap_router_address, abi=uniswap_router_abi)
        txn = uniswap_router.functions.swapExactTokensForTokens(
            amount_in,
            amount_out_min,
            [token_a, token_b],
            account.address,
            deadline
        ).buildTransaction({
            'from': account_address,
            'gas': 200000,
            # 'gasPrice': web3.toWei('50', 'gwei'),
            'nonce': self.web3.eth.get_transaction_count(account_address),
        })

        signed_txn = self.web3.eth.account.sign_transaction(txn, private_key)
        txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)

        print(f'Transaction hash: {self.web3.to_hex(txn_hash)}')
