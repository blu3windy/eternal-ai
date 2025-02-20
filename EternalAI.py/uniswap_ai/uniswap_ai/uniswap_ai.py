import logging
import os
import decimal

from web3 import Web3
from web3.middleware import geth_poa_middleware
from uniswap.constants import ETH_ADDRESS
from uniswap_ai.const import RPC_URL, ETH_CHAIN_ID
from dataclasses import dataclass
from uniswap import Uniswap


@dataclass
class SwapReq:
    token_in: str
    token_in_amount: decimal
    token_out: str
    token_out_out_min: decimal


@dataclass
class UniSwapAI:
    web3: Web3 = None

    def create_web3(self, rpc: str = ""):
        if self.web3 is None:
            if rpc != "":
                self.web3 = Web3(Web3.HTTPProvider(rpc))
            else:
                # Default:
                self.web3 = Web3(Web3.HTTPProvider(RPC_URL[ETH_CHAIN_ID]))
            self.web3.middleware_onion.inject(geth_poa_middleware, layer=0)

    def swap_v3(self, privateKey: str, req: SwapReq, rpc: str = ""):
        if privateKey is None or len(privateKey) == 0:
            raise Exception('Private key missing')
        self.create_web3(rpc)
        if self.web3.is_connected():
            account = self.web3.eth.account.from_key(privateKey)
            account_address = Web3.to_checksum_address(account.address)

            """Checks price impact for a pool with liquidity."""
            uni_swap = Uniswap(address=account_address, private_key=privateKey, web3=self.web3, version=3)

            token_a = Web3.to_checksum_address(req.token_in)
            amount_in = self.web3.to_wei(req.token_in_amount, 'ether')

            token_b = Web3.to_checksum_address(req.token_out)

            # Compare the results with the output of:
            logging.info(f"https://app.uniswap.org/#/swap?use=v3&inputCurrency={token_a}&outputCurrency={token_b}")
            impact = uni_swap.estimate_price_impact(token_a, token_b, amount_in, fee=10000)
            logging.info(f"Impact for buying VXV on v3 with {amount_in / 10 ** 18} ETH:  {impact}")

            if token_a != ETH_ADDRESS:
                approved = uni_swap._is_approved(token_b)
                logging.info(f"approved: {approved}")

                if not approved:
                    logging.info("call approved")
                    uni_swap.approve(token_b, max_approval=None)

                    approved = uni_swap._is_approved(token_b)
                    logging.info(f"check approved again: {approved}")

            logging.info(f"call swap")
            tx = uni_swap.make_trade(token_a, token_b, amount_in, uni_swap.address)
            logging.info(f"sending tx: {tx.to_checksum_address()}")
            return tx

    # def swap(self, privateKey: str, req: SwapReq):
    #     if self.web3 is None:
    #         self.web3 = Web3(Web3.HTTPProvider(rpc_url))
    #     if self.web3.is_connected():
    #         if privateKey is None or len(privateKey) == 0:
    #             privateKey = os.getenv("PRIVATE_KEY")
    #
    #         account = self.web3.eth.account.from_key(privateKey)
    #         account_address = account.address
    #
    #         amount_in = self.web3.to_wei(req.token_a_amount, 'ether')
    #         amount_out_min = self.web3.to_wei(req.token_b_out_min, 'ether')
    #         deadline = self.web3.eth.get_block('latest')['timestamp'] + 120
    #
    #         if self.uniswap_router_address == "":
    #             self.uniswap_router_address = "0xe592427a0aece92de3edee1f18e0157c05861564"
    #
    #         uniswap_router = self.web3.eth.contract(address=self.uniswap_router_address, abi=uniswap_router_abi)
    #         txn = uniswap_router.functions.swapExactTokensForTokens(
    #             amount_in,
    #             amount_out_min,
    #             [token_a, token_b],
    #             account.address,
    #             deadline
    #         ).buildTransaction({
    #             'from': account_address,
    #             'gas': 200000,
    #             # 'gasPrice': web3.toWei('50', 'gwei'),
    #             'nonce': self.web3.eth.get_transaction_count(account_address),
    #         })
    #
    #         signed_txn = self.web3.eth.account.sign_transaction(txn, private_key)
    #         txn_hash = self.web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    #
    #         logging.info(f'Transaction hash: {self.web3.to_hex(txn_hash)}')
    #     else:
    #         raise Exception('Uniswap: web3 is not connected')
