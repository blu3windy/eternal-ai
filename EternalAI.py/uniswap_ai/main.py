import decimal
import logging
import time
import os
import argparse

from dotenv import load_dotenv
from uniswap_ai.const import RPC_URL, BSC_CHAIN_ID, BASE_CHAIN_ID
from uniswap_ai.uniswap_ai import UniSwapAI, SwapReq
from uniswap_ai.uniswap_ai_inference import HybridModelInference, InferenceProcessing, AgentInference

load_dotenv(".env")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')


def call_uniswap():
    ""
    # uniswapObj = UniSwapAI()
    # uniswapObj.swap_v3("", SwapReq(
    #     "0x0000000000000000000000000000000000000000",
    #     decimal.Decimal("0.1"),
    #     "0x7d29a64504629172a429e64183d6673b9dacbfce",
    #     decimal.Decimal("0.1")))


def process_infer(chain_id: str, tx_hash: str, rpc: str, worker_address: str):
    infer_processing = InferenceProcessing()
    infer_id = infer_processing.get_infer_id(worker_hub_address=worker_address, tx_hash=tx_hash, rpc=rpc)
    logging.info(f"infer id: {infer_id}")

    result = ""
    if chain_id == BASE_CHAIN_ID:
        while (True):
            try:
                infer_processing.get_assignments_by_inference(worker_hub_address=worker_address,
                                                              inference_id=infer_id,
                                                              rpc=rpc)
                break
            except Exception as e:
                logging.info(f'Can not get result for inference, try again')
                time.sleep(30)
    elif chain_id == BSC_CHAIN_ID:
        while (True):
            try:
                result = infer_processing.get_inference_by_inference_id(worker_hub_address=worker_address,
                                                                        inference_id=infer_id,
                                                                        rpc=rpc)
                break
            except Exception as e:
                logging.info(f'Can not get result for inference, try again')
                time.sleep(30)
    logging.info(f'result: {result}')
    return result


def create_agent_infer(private_key: str, chain_id: str, agent_address: str, prompt: str):
    rpc = RPC_URL.get(chain_id)
    agent_infer = AgentInference()
    tx_hash = agent_infer.create_inference_agent(private_key, agent_address, prompt, rpc)
    logging.info(f"infer tx_hash: {tx_hash}")

    worker_hub_address = agent_infer.get_worker_hub_address()
    logging.info(f'worker_hub_address : {worker_hub_address}')
    return process_infer(chain_id, tx_hash, rpc, worker_hub_address)


def create_hybrid_model_infer(private_key: str, chain_id: str, model_address: str, system_prompt: str, prompt: str,
                              worker_address: str):
    rpc = RPC_URL.get(chain_id)
    hybrid_infer = HybridModelInference()
    # tx_hash = hybrid_infer.create_inference_model(private_key, model_address, system_prompt, prompt, rpc)
    tx_hash = "0x9ff83107e360c1f6ab09ec0d9f3c6c5188868ff382bc9b822c9b7eb249820790"
    logging.info(f"infer tx_hash: {tx_hash}")

    return process_infer(chain_id, tx_hash, rpc, worker_address)


def main(args):
    if args.command == 'model-infer':
        create_hybrid_model_infer(
            args.pk or os.getenv("PRIVATE_KEY"),
            args.chain_id or BASE_CHAIN_ID,
            args.model_address or os.getenv("HYBRID_MODEL_ADDRESS"),
            args.system_prompt,
            args.prompt,
            args.worker_hub_address or os.getenv("WORKER_HUB_ADDRESS"))
    elif args.command == 'agent-infer':
        create_agent_infer(
            args.pk or os.getenv("PRIVATE_KEY"),
            args.chain_id or BSC_CHAIN_ID,
            args.agent_address or os.getenv("AGENT_ADDRESS"),
            args.prompt)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="UniSwap AI agent.")

    subparsers = parser.add_subparsers(dest='command', required=True)

    model_infer = subparsers.add_parser('model-infer', help='Infer to model contract')
    model_infer.add_argument('system_prompt', type=str, help='system prompt')
    model_infer.add_argument('prompt', type=str, help='user prompt')
    model_infer.add_argument('--pk', type=str, help='private key', required=False)
    model_infer.add_argument('--model_address', type=str, help='model address', required=False)
    model_infer.add_argument('--worker_hub_address', type=str, help='worker hub address', required=False)
    model_infer.add_argument('--chain_id', type=str, help='chain id', required=False)

    agent_infer = subparsers.add_parser('agent-infer', help='Infer to agent contract')
    agent_infer.add_argument('prompt', type=str, help='user prompt')
    agent_infer.add_argument('--pk', type=str, help='private key', required=False)
    agent_infer.add_argument('--agent_address', type=str, help='agent address', required=False)
    agent_infer.add_argument('--chain_id', type=str, help='chain id', required=False)

    # Parse arguments
    args = parser.parse_args()

    # Execute main logic
    main(args)
