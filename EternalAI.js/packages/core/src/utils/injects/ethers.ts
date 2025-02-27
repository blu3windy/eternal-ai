import * as ethers from 'ethers';

// Ensure globalThis is defined
if (typeof globalThis === 'undefined') {
  (globalThis as any) = global;
}

export const injectEthers = (): typeof ethers => {
  if ((globalThis as any)['ethers']) {
    const module = (globalThis as any)['ethers'];
    return module as typeof ethers;
  }

  (globalThis as any)['ethers'] = ethers;
  const module = (globalThis as any)['ethers'];
  return module as typeof ethers;
};
