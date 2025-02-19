export const ABC = 1
export const RPC = "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID";

export const ERC20ABI = [
    "function approve(address spender, uint amount) external returns (bool)"
]

export const UniSwapABIV2 = [
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];

export const UniSwapABIV3 = [
    "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)"
];
export const uniswapV2RouterAddress = "0xYourUniswapV2RouterAddress";
export const uniswapV3RouterAddress = "0xYourUniswapV3RouterAddress";