import logging
import argparse
from dotenv import load_dotenv

from uniswap_ai import uni_swap_ai

load_dotenv(".env")
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

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
    uni_swap_ai(args)
