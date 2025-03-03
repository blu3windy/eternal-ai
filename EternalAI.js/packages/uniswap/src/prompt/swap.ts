import { WETH_TOKEN } from '../libs/constants';
import { API_URL, ETH_CHAIN_ID, getRPC, ZeroAddress } from '../const';
import { Token } from '@uniswap/sdk-core';
import {
  changeWallet,
  createWallet,
  TransactionState,
} from '../libs/providers';
import { createTrade, executeTrade } from '../libs/trading';
import { CurrentConfig, Environment } from '../libs/config';
import {
  getCurrencyBalance,
  getCurrencyDecimal,
  unwrapETH,
  wrapETH,
} from '../libs/wallet';
import { TTokenInfo, TTransactionResponse } from '../types';

export class SwapReq {
  function_name: string;
  token_in: string = '';
  token_in_address: string = '';
  token_in_amount: number = 0;
  token_out: string = '';
  token_out_address: string = '';

  constructor(
    function_name: string,
    token_in: string,
    token_in_address: string,
    token_in_amount: number,
    token_out: string,
    token_out_address: string
  ) {
    this.function_name = function_name;
    this.token_in = token_in;
    this.token_in_address = token_in_address;
    this.token_in_amount = token_in_amount;
    this.token_out = token_out;
    this.token_out_address = token_out_address;
  }

  static fromJSON(json: string): SwapReq {
    const parsed = JSON.parse(json);
    return Object.assign(new SwapReq('', '', '', 0, '', ''), parsed);
  }

  convert_in_out = async () => {
    if (this.token_in.toLowerCase() == 'eth') {
      // this.token_in_address = ZeroAddress;
      this.token_in_address = WETH_TOKEN.address;
      this.token_in = 'WETH';

      // get balance of eth
    } else {
      const token_address = await this.convert_token_address(this.token_in);
      if (!token_address) this.token_in_address = ZeroAddress;
      else this.token_in_address = token_address;
    }

    if (this.token_out.toLowerCase() == 'eth') {
      this.token_out_address = ZeroAddress;
      // this.token_out_address = WETH_TOKEN.address;
      // this.token_out = 'WETH';
    } else {
      const token_address = await this.convert_token_address(this.token_out);
      if (!token_address) this.token_out_address = ZeroAddress;
      else this.token_out_address = token_address;
    }
  };

  get_token_address_from_info = (token_info: any, symbol: string) => {
    let result = null;
    if (token_info['symbol'] && token_info['symbol'] == symbol) {
      if (token_info['platforms']) {
        if (token_info['platforms']['ethereum']) {
          result = token_info['platforms']['ethereum'];
        }
      }
    }
    return result;
  };

  get_price = async (token_address: string): Promise<TTokenInfo | null> => {
    // TODO
    const res = await fetch(
      `${API_URL}coin-price/${token_address}?chain=${ETH_CHAIN_ID}`
    );
    if (res.ok) {
      const data = await res.json();
      return data.usdPriceFormatted;
    } else {
      return null;
    }
  };

  convert_token_address = async (symbol: string) => {
    symbol = symbol.toLowerCase();
    let result = null;
    const token_info_response = await fetch(`${API_URL}coins/` + symbol);
    if (token_info_response.ok) {
      const data = await token_info_response.json();
      result = this.get_token_address_from_info(data, symbol);
    }
    if (!result) {
      const token_info_list_response = await fetch(
        `${API_URL}list-coins?include_platform=true&status=active`
      );
      if (token_info_list_response.ok) {
        const list: any = await token_info_list_response.json();
        for (const token_info of list) {
          result = this.get_token_address_from_info(token_info, symbol);
          if (result) break;
        }
      }
    }

    return result;
  };
}

export class UniSwapAI {
  swap_v3 = async (
    privateKey: string,
    req: SwapReq,
    chain_id: string
  ): Promise<TTransactionResponse> => {
    if (privateKey == '') {
      throw new Error('invalid private key');
    }
    CurrentConfig.env = Environment.MAINNET;
    //
    CurrentConfig.rpc.mainnet = getRPC(chain_id);
    CurrentConfig.wallet.privateKey = privateKey;
    const newWallet = createWallet();

    // check if one token is ETH, change to WETH

    // init config token
    const tokenIn = new Token(
      parseInt(chain_id, 16),
      req.token_in_address,
      // "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      await getCurrencyDecimal(newWallet.provider, req.token_in_address),
      req.token_in,
      req.token_in
    );
    CurrentConfig.tokens.in = tokenIn;
    CurrentConfig.tokens.amountIn = req.token_in_amount;

    let tokenOut: Token;
    if (req.token_out_address == ZeroAddress) {
      tokenOut = new Token(
        parseInt(chain_id, 16),
        WETH_TOKEN.address,
        await getCurrencyDecimal(newWallet.provider, WETH_TOKEN.address),
        WETH_TOKEN.symbol,
        WETH_TOKEN.name
      );
    } else {
      tokenOut = new Token(
        parseInt(chain_id, 16),
        req.token_out_address,
        await getCurrencyDecimal(newWallet.provider, req.token_out_address),
        req.token_out,
        req.token_out
      );
    }
    CurrentConfig.tokens.out = tokenOut;

    if (req.token_in_address == WETH_TOKEN.address) {
      const wethBalance = await getCurrencyBalance(
        newWallet.provider,
        newWallet.address,
        WETH_TOKEN
      );

      if (Number(wethBalance) < req.token_in_amount) {
        // wrap eth with enough amount
        await wrapETH(req.token_in_amount);
      }
    }

    const tokenInBalance = await getCurrencyBalance(
      newWallet.provider,
      newWallet.address,
      CurrentConfig.tokens.in
    );
    console.log(
      `Wallet ${newWallet.address}: ${tokenInBalance} ${req.token_in}`
    );
    changeWallet(newWallet);

    if (Number(tokenInBalance) <= req.token_in_amount) {
      return {
        state: TransactionState.Failed,
        tx: null,
        message: 'swap_v3 error: insufficient balance',
      };
    }

    try {
      const trade = await createTrade();
      const { state, tx } = await executeTrade(trade);

      if (
        tx &&
        state === TransactionState.Sent &&
        req.token_out_address == ZeroAddress
      ) {
        const amountOut = trade.swaps[0].outputAmount.toExact();
        await unwrapETH(Number(amountOut));
      }

      return { state: null, tx: null };
    } catch (e) {
      //   console.log(`Error executeTrade ${e}`);
      return {
        state: TransactionState.Failed,
        tx: null,
        message: 'swap_v3 error: ' + (e as Error).message,
      };
    }
    // return { state: null, tx: null };
  };
}
