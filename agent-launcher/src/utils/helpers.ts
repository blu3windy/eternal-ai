export const getExplorerByChain = ({
   chainId,
   type,
   address,
   extraLink,
}: {
  chainId: string;
  type: 'tx' | 'address' | 'account';
  address: string;
  extraLink?: string;
}) => {

   const chainIdToChainName: any = {
      // [ChainId.Avax]: 'avax',
      // [ChainId.ETH]: 'eth',
      // [ChainId.BSC]: 'bsc',
      // [ChainId.Ape]: 'apechain',
      // [ChainId.Polygon]: 'polygon',
      // [ChainId.Base]: 'base',
      // [ChainId.Optimism]: 'optimism',
      // [ChainId.Arbitrum]: 'arbitrum',
      // [ChainId.ZkSync]: 'zksync',
      // [ChainId.Solana]: 'sol',
      // [ChainId.Duck]: 'duckchain',
      // [ChainId.Story]: 'story',
      // [ChainId.Tron]: 'trx',
      // [ChainId.MonadTestnet]: 'monad-testnet',
      // [ChainId.MegaETHTestnet]: 'megaeth-testnet',
   };

   switch (chainId.toString()) {
   // case ChainId.ShardAI: {
   //   return `https://explorer.shard-ai.l2aas.com/${type}/${address}`;
   // }
   // case ChainId.HERMES: {
   //   return `https://explorer.symbiosis.eternalai.org/${type}/${address}`;
   // }
   // case ChainId.HyperEVM: {
   //   return `https://explorer.hyperlend.finance/${type}/${address}`;
   // }
   // case ChainId.Zeta: {
   //   return `https://explorer.zetachain.com/${type}/${address}`;
   // }
   // case ChainId.Mode: {
   //   return `https://modescan.io/${type}/${address}`;
   // }
   // case ChainId.Abstract: {
   //   return `https://explorer.testnet.abs.xyz/${type}/${address}`;
   // }
   // case ChainId.Bittensor: {
   //   return `https://bittensor.com/scan/${type}/${address}`;
   // }
   // case ChainId.MegaETHTestnet: {
   //   return ``;
   // }
   default: {
      if (chainIdToChainName[chainId.toString()]) {
         return `https://www.okx.com/web3/explorer/${
            chainIdToChainName[chainId.toString()]
         }/${type}/${address}`;
      }

      return extraLink;
   }
   }
};