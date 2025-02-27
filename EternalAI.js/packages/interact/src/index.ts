// import * as Immutable from 'immutable';
import * as ethersType from 'ethers';

import inject from './libs';

export const abc = () => {
  // const immutable = inject<typeof Immutable>('Immutable');
  // console.log(immutable);
  // const map = immutable.Map();
  // console.log(map);

  const ethers = inject<typeof ethersType>('ethers');
  console.log(ethers);
  const provider = new ethers.providers.JsonRpcProvider(
    'https://base.llamarpc.com'
  );
  console.log(provider);
  return provider;
};

abc();
