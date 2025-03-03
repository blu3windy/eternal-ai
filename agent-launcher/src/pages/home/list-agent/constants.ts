export const FilterChains = [
   {
      name: 'All chains',
      chainId: 0,
      icon: '/icons/blockchains/ic-btc.svg',
      banner: '/images/banners/bg-all-chain-min.png',
      path: 'all',
      label: 'All chains',
      metadata: {
         url: '/agents/metadata/All-chain.png',
      },
   },
   {
      name: 'Bitcoin',
      chainId: 222671,
      icon: '/icons/blockchains/ic-btc.svg',
      explorer: 'https://mempool.space/',
      path: 'bitcoin',
      banner: '/images/banners/bg-bitcoin.png',
      label: 'Bitcoin',
      metadata: {
         url: '/agents/metadata/Bitcoin.png',
      },
   },
   {
      name: 'Ethereum',
      chainId: 1,
      icon: '/icons/blockchains/ic-ether.png',
      explorer: 'https://etherscan.io/',
      path: 'ethereum',
      banner: '/images/banners/bg-ethereum.png',
      label: 'Ethereum',
      urlBuyEAI:
      'https://app.uniswap.org/swap?outputCurrency=0xa84f95eb3DaBdc1bbD613709ef5F2fD42CE5bE8d',
      metadata: {
         url: '/agents/metadata/Ethereum.png',
      },
   },
   {
      name: 'Base',
      chainId: 8453,
      icon: '/icons/blockchains/ic-base.png',
      explorer: 'https://basescan.org/',
      path: 'base',
      banner: '/images/banners/bg-base.png',
      label: 'Base',
      dex: 'Uniswap on Base',
      urlBuyEAI:
      'https://app.uniswap.org/swap?outputCurrency=0x4B6bF1d365ea1A8d916Da37FaFd4ae8C86d061D7&chain=base',
      metadata: {
         url: '/agents/metadata/Base.png',
      },
   },
   {
      name: 'Arbitrum',
      chainId: 42161,
      icon: '/icons/blockchains/ic_arbitrum.svg',
      explorer: 'https://arbiscan.io/',
      path: 'arbitrum',
      banner: '/images/banners/bg-arbitrum.png',
      label: 'Arbitrum',
      dex: 'Camelot',
      urlBuyEAI:
      'https://app.camelot.exchange/?token2=0xDB8C67e6CA293F43C75e106c70b97033cC2909E3',
      metadata: {
         url: '/agents/metadata/Arbitrum.png',
      },
   },
   {
      name: 'Solana',
      chainId: 101,
      icon: '/icons/blockchains/ic_solana.svg',
      explorer: 'https://solscan.io/',
      path: 'solana',
      banner: '/images/banners/bg-solana.png',
      label: 'Solana',
      urlBuyEAI:
      'https://raydium.io/swap/?inputMint=sol&outputMint=12KwPzKewFGgzs69pvHmUKvhiDBtkAFCKoNjv6344Rkm',
      metadata: {
         url: '/agents/metadata/Solana.png',
      },
   },
   {
      name: 'Bittensor',
      chainId: 964,
      icon: '/icons/blockchains/ic-tao.svg',
      explorer: 'https://bittensor.com/scan',
      path: 'tao',
      banner: '/images/banners/bg-bitensor.png',
      label: 'Bittensor',
      metadata: {
         url: '/agents/metadata/Bittensor.png',
      },
   },
   {
      name: 'ApeChain',
      chainId: 33139,
      icon: '/icons/blockchains/ic-ape.png',
      explorer: 'https://apescan.io/',
      path: 'ape',
      banner: '/images/banners/bg-ape.png',
      label: 'ApeChain',
      dex: 'Camelot',
      urlBuyEAI:
      'https://app.camelot.exchange/?token2=0x4B6bF1d365ea1A8d916Da37FaFd4ae8C86d061D7&token1=0x48b62137EdfA95a428D35C09E44256a739F6B557&chainId=33139',
      metadata: {
         url: '/agents/metadata/ApeChain.png',
      },
   },
   {
      name: 'BNB Chain',
      chainId: 56,
      icon: '/icons/blockchains/ic-bsc.png',
      explorer: 'https://bscscan.com/',
      path: 'bsc',
      banner: '/images/banners/bg-bnb.png',
      label: 'BNB Chain',
      dex: 'PancakeSwap',
      urlBuyEAI:
      'https://pancakeswap.finance/?outputCurrency=0x4B6bF1d365ea1A8d916Da37FaFd4ae8C86d061D7&chainId=56',
      metadata: {
         url: '/agents/metadata/BNBChain.png',
      },
   },
   {
      name: 'Polygon',
      chainId: 137,
      icon: '/icons/blockchains/ic_polygon.svg',
      explorer: 'https://polygonscan.com/',
      path: 'polygon',
      banner: '/images/banners/bg-polygon.png',
      label: 'Polygon',
      metadata: {
         url: '/agents/metadata/Polygon.png',
      },
   },
   {
      name: 'ZKsync',
      chainId: 324,
      icon: '/icons/blockchains/ic_zksync.svg',
      explorer: 'https://zkscan.io/',
      path: 'zksync',
      banner: '/images/banners/bg-zksync.png',
      label: 'ZKsync',
      metadata: {
         url: '/agents/metadata/ZKsync.png',
      },
   },
   {
      name: 'Avalanche',
      chainId: 43114,
      icon: '/icons/blockchains/ic_avax.svg',
      explorer: 'https://subnets.avax.network/c-chain',
      path: 'avax',
      banner: '/images/banners/bg-avax.png',
      label: 'Avalanche',
      urlBuyEAI:
      'https://app.uniswap.org/swap?outputCurrency=0xe30f980a7cE39805fD2B75f34a8BEf30b4c38859&chain=avalanche',
      metadata: {
         url: '/agents/metadata/Avalanche.png',
      },
   },
   {
      name: 'Tron',
      chainId: 728126428,
      icon: '/icons/blockchains/ic-tron.svg',
      explorer: 'https://tronscan.org/',
      path: 'tron',
      banner: '/images/banners/bg-tron.png',
      label: 'Tron',
      metadata: {
         url: '/agents/metadata/Tron.png',
      },
   },
   {
      name: 'Abstract',
      chainId: 11124,
      icon: '/icons/blockchains/ic-abs.png',
      explorer: 'https://explorer.testnet.abs.xyz/',
      path: 'abs',
      banner: '/images/banners/bg-abstract.png',
      label: 'Abstract',
      metadata: {
         url: '/agents/metadata/Abstract.png',
      },
   },
   {
      name: 'Mode',
      chainId: 34443,
      icon: '/icons/blockchains/ic-mode.jpeg',
      explorer: 'https://modescan.io/',
      path: 'mode',
      banner: '/images/banners/bg-mode.png',
      label: 'Mode',
      metadata: {
         url: '/agents/metadata/Mode.png',
      },
   },
   {
      name: 'ZetaChain',
      chainId: 7000,
      icon: '/icons/blockchains/ic-zeta.webp',
      explorer: 'https://explorer.zetachain.com/',
      path: 'zeta',
      banner: '/images/banners/bg-zeta.png',
      label: 'ZetaChain',
      metadata: {
         url: '/agents/metadata/Zeta.png',
      },
   },
   {
      name: 'StoryChain',
      chainId: 1514,
      icon: '/icons/blockchains/ic-story.svg',
      explorer: 'https://www.storyscan.xyz/',
      path: 'story',
      banner: '/images/banners/bg-story.png',
      label: 'StoryChain',
      metadata: {
         url: '/agents/metadata/Story.png',
      },
   },
   {
      name: 'DuckChain',
      chainId: 5545,
      icon: '/icons/blockchains/ic-duck.svg',
      explorer: 'https://scan.duckchain.io/',
      path: 'duck',
      banner: '/images/banners/bg-duck.png',
      label: 'DuckChain',
      metadata: {
         url: '/agents/metadata/DuckChain.png',
      },
   },
   {
      name: 'Symbiosis',
      chainId: 45762,
      icon: '/icons/blockchains/ic_nbs.svg',
      explorer: 'https://explorer.symbiosis.eternalai.org/',
      path: 'symbiosis',
      banner: '/images/banners/bg-symbiosis.png',
      label: 'Symbiosis',
      metadata: {
         url: '/agents/metadata/Symbiosis.png',
      },
   },
];

export const Models = [
   {
      title: 'All',
      value: '',
   },
   {
      title: 'DeepSeek V3',
      value: 'DeepSeek V3',
   },
   {
      title: 'DeepSeek R1 70B',
      value: 'DeepSeek-R1-Distill-Llama-70B',
   },
   {
      title: 'Hermes 3 70B',
      value: 'NousResearch/Hermes-3-Llama-3.1-70B-FP8',
   },
   {
      title: 'Llama 3.1 405B',
      value: 'neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16',
   },
   {
      title: 'Llama 3.3 70B',
      value: 'unsloth/Llama-3.3-70B-Instruct-bnb-4bit',
   },
   {
      title: 'INTELLECT-1 10B',
      value: 'PrimeIntellect/INTELLECT-1-Instruct',
   },
   {
      title: 'Dobby 70B',
      value: 'Dobby-Llama-3.3-70B',
   },
   {
      title: 'Dobby Mini 3.1 8B',
      value: 'SentientAGI/Dobby-Mini-Unhinged-Llama-3.1-8B',
   },
   {
      title: 'DeepHermes 8B',
      value: 'NousResearch/DeepHermes-3-Llama-3-8B-Preview',
   },
];
