import injectDependency from './inject';

const packages = {
  ethers: injectDependency<InjectedTypes.ethers>('ethers'),
};

export const prompt = () => {
  const wallet = packages.ethers.ethers.Wallet.createRandom();
  return wallet.address;
};
