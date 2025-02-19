import pytest
from uniswap.uniswap import UniSwap


def test_sum():
    assert 1 + 1 == 2


def test_uniswap():
    uniswap = UniSwap()
    uniswap.swap("", 0.1, "", 0.1)
