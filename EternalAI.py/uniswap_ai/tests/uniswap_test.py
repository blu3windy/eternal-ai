import pytest

from uniswap_ai.main import call_uniswap


def test_sum():
    assert 1 + 1 == 2


def test_uniswap():
    try:
        call_uniswap("", """<think>
                                                    Okay, so I need to figure out how to respond to the user's request. They want to swap 0.03 ETH to USDT on Uniswap using the Ethereum chain. 
    
                                                    First, I remember that the response needs to be in a specific JSON format. The example provided shows that the JSON should include "token_in", "token_in_amount", and "token_out". 
    
                                                    I should identify the input token, which is ETH, and the amount is 0.03. The output token is USDT. 
    
                                                    I also need to make sure the token addresses are correct and comply with ERC20 standards. I think ETH is the native token, so it doesn't have an address, but USDT does. However, the example didn't include addresses, so maybe I don't need to add them here.
    
                                                    Putting it all together, the JSON should have "token_in" as "ETH", "token_in_amount" as 0.03, and "token_out" as "USDT".
                                                    </think>
    
                                                    ```json
                                                    {
                                                      "token_in": "ETH",
                                                      "token_in_amount": 0.03,
                                                      "token_out": "USDT"
                                                    }
                        ```""")
    except:
        assert 1 == 2
    return
