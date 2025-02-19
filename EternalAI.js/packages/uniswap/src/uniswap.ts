import {ethers} from "ethers";
import {UniSwapABIV2, uniswapV2RouterAddress, RPC, ERC20ABI} from "@/const";

export async function swapV2(privateKey: any, tokenAAddress: any, tokenAAmount: string, tokenBAddress: any, tokenBAmountMin: string) {
    const provider = new ethers.providers.JsonRpcProvider(RPC);

    const wallet = new ethers.Wallet(privateKey, provider);

    const signer = provider.getSigner();

    const amountIn = ethers.utils.parseUnits(tokenAAmount, 18);
    const amountOutMin = ethers.utils.parseUnits(tokenBAmountMin, 18);
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

    const path = [tokenAAddress, tokenBAddress];

    const uniswapRouter = new ethers.Contract(uniswapV2RouterAddress, UniSwapABIV2, wallet);

    const tokenAContract = new ethers.Contract(tokenAAddress, ERC20ABI, wallet);

    await tokenAContract.approve(uniswapV2RouterAddress, amountIn);

    // Gọi hàm swap
    const tx = await uniswapRouter.swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        await wallet.getAddress(),
        deadline
    );

    await tx.wait();
    console.log("tx:", tx);
}
