export { default as Interact } from './interact';
export * as methods from './methods';
export * from './types';
export * from './constants';

import { Token } from '@uniswap/sdk-core';
const createToken = () => {
  return new Token(1, '0x123', 18, 'token', 'token');
};

export { createToken };
