import { CHAIN_TYPE } from "@constants/chains";
import ERC20ABI from "@contract/abis/ERC20.json";
import GenericContract from "@contract/common";
import { ContractParams } from "@contract/interfaces";
import { ERC20 } from "@contract/interfaces/ERC20";
import { IToken } from "@interfaces/token";
import { useAuth } from "@pages/authen/provider";
import { ethers } from "ethers";
import { formatEther, parseEther } from "ethers/lib/utils";
import { isNativeToken } from "./constants";
import BigNumber from "bignumber.js";

class CTokenContract extends GenericContract {
  private erc20: ERC20 | undefined = undefined;

  public walletAuth = useAuth();
  public signer = this.walletAuth.signer;

  public getERC20Contract = (params: ContractParams) => {
    const { contractAddress } = params;
    this.erc20 = new ethers.Contract(
      contractAddress,
      ERC20ABI,
      this.getProviderByChain(params.chain)
    ) as ERC20;
    return this.erc20;
  };

  public getTokenInfo = async ({
    contractAddress,
    chain = CHAIN_TYPE.BASE,
  }: {
    contractAddress: string;
    chain?: CHAIN_TYPE;
  }): Promise<IToken> => {
    const [name, symbol] = await Promise.all([
      this.getERC20Contract({ contractAddress, chain }).name(),
      this.getERC20Contract({ contractAddress, chain }).symbol(),
    ]);

    console.log("name, symbol", name, symbol);

    return {
      name: name,
      symbol,
      address: contractAddress,
    } as any;
  };

  isNeedApprove = async ({
    token_address,
    spender_address,
    chain = CHAIN_TYPE.BASE,
  }: {
    token_address: string;
    spender_address: string;
    chain?: CHAIN_TYPE;
  }) => {
    try {
      if (isNativeToken(token_address)) return false;

      const _wallet = this.signer?.address as any;
      const response = await this.getERC20Contract({
        contractAddress: token_address,
        chain,
      }).allowance(_wallet, spender_address);

      return BigNumber.from(response).lt(parseEther("1"));
    } catch (error) {
      console.log("error >>> isNeedApprove", error);

      return true;
    }
  };

  public getTokenBalance = async (
    tokenAddress: string,
    chain: CHAIN_TYPE = CHAIN_TYPE.BASE,
    walletAddress?: string
  ) => {
    try {
      const latestAddress: string =
        walletAddress || (this.signer?.address as string);

      if (
        chain === CHAIN_TYPE.BASE || chain === CHAIN_TYPE.ETERNAL
          ? isNativeToken(tokenAddress)
          : false
      ) {
        const balance = await this.getProviderByChain(chain)?.getBalance(
          latestAddress
        );

        return formatEther(balance).toString();
      }

      const balance = await this.getERC20Contract({
        contractAddress: tokenAddress,
        chain,
      }).balanceOf(latestAddress as string);

      console.log("getTokenBalance balance", balance);

      return formatEther(balance).toString();
    } catch (e) {
      console.log("error getTokenBalance", e);

      return "0";
    }
  };

  approveToken = async ({
    token_address,
    spender_address,
    chain = CHAIN_TYPE.BASE,
  }: {
    token_address: string;
    spender_address: string;
    chain?: CHAIN_TYPE;
  }) => {
    const erc20Contract = this.getERC20Contract({
      contractAddress: token_address,
      chain,
    });

    const chainID = this.getChainId(chain);

    const calldata = erc20Contract.interface.encodeFunctionData("approve", [
      spender_address,
      ethers.constants.MaxUint256,
    ]);

    const tx = await this.walletAuth?.sendTransaction({
      data: calldata,
      to: token_address,
      chainId: Number(chainID),
      wait: true,
    });

    return tx;
  };

  async getEstimateGas({
    from,
    to,
    transferAmount,
    tokenAddress,
    chain = CHAIN_TYPE.BASE
  }: {
    from: string;
    to: string;
    transferAmount: string;
    tokenAddress?: string;
    chain?: CHAIN_TYPE;
  }) {
    try {
      const provider = this.getProviderByChain(chain);
      const value = parseEther(
        new BigNumber(transferAmount).toString()
      );

      if (tokenAddress && !isNativeToken(tokenAddress)) {
        // For ERC20 tokens
        const contract = this.getERC20Contract({
          contractAddress: tokenAddress,
          chain,
        });
        const estimateGas = await contract.estimateGas.transfer(to, value);
        return formatEther(estimateGas).toString();
      } else {
        // For native token
        const estimateGas = await provider.estimateGas({
          from: from,
          to: to,
          value: value,
        });
        return formatEther(estimateGas).toString();
      }
    } catch (e) {
      console.log("Error estimating gas:", e);
      return "0";
    }
  }
}

export default CTokenContract;
