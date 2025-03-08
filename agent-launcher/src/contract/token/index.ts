import { CHAIN_TYPE } from "@constants/chains";
import ERC20ABI from "@contract/abis/ERC20.json";
import GenericContract from "@contract/common";
import { ContractParams } from "@contract/interfaces";
import { ERC20 } from "@contract/interfaces/ERC20";
import { IToken } from "@interfaces/token";
import { ethers } from "ethers";

class CTokenContract extends GenericContract {
  private erc20: ERC20 | undefined = undefined;

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
}

export default CTokenContract;
