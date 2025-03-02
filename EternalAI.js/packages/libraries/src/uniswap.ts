import * as uniswap from '@uniswap/sdk-core';

if (typeof globalThis === 'undefined') {
  (globalThis as any) = global;
}

(globalThis as any).uniswap = uniswap;
