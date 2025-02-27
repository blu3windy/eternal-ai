import { default as Immutable } from 'immutable';
import * as ethers from 'ethers';

// Ensure globalThis is defined
if (typeof globalThis === 'undefined') {
  (globalThis as any) = global;
}

const inject = <T = any>(packageName: 'Immutable' | 'ethers'): T => {
  if ((globalThis as any)[packageName]) {
    return (globalThis as any)[packageName];
  }

  switch (packageName) {
    case 'Immutable':
      (globalThis as any)[packageName] = Immutable;

    case 'ethers':
      (globalThis as any)[packageName] = ethers;
  }
  return (globalThis as any)[packageName];
};

export default inject;
