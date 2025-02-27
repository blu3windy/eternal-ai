declare global {
  var globalThis: typeof globalThis & {
    [key: string]: any;
    Immutable: Immutable;
    ethers: ethers;
  };
}

export {};
