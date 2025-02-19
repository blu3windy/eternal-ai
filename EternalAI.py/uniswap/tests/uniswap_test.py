import pytest

from uniswap.uniswap import sum_number


def test_sum():
    assert sum_number(1, 2) == 3
    assert 1 + 1 == 2
