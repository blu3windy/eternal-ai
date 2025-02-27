declare global {
  var globalThis: typeof globalThis & {
    [key: string]: unknown;
    ethers: ethers;
  };
}

export {};
