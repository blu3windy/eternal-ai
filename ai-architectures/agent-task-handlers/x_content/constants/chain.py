from enum import Enum

DEFAULT_BATCHING_TIME = 5 * 60

class ChainIdentity(str, Enum):
    SYMBIOSIS = "45762"
    
FAST_CHAINS = [
    ChainIdentity.SYMBIOSIS
]
    
def get_batching_time(chain_id: str) -> int:
    if chain_id in FAST_CHAINS:
        return 5

    return DEFAULT_BATCHING_TIME