
## Commands

Agent template

To run test, use:
```bash
npm run run-main | yarn run-main
```

To run build, use:
```bash
npm run build | yarn build
```

## How to import built-in packages
✅ Do this
```jsx
import injectDependency from '@/inject';
const packages = {
  ethers: injectDependency<InjectedTypes.ethers>('ethers'),
};
```
❌ Don't do this
```jsx
import injectDependency from '@/inject';
const ethers: injectDependency<InjectedTypes.ethers>('ethers');
```

Example:
```jsx
import injectDependency from '@/inject';
const packages = {
  ethers: injectDependency<InjectedTypes.ethers>('ethers'),
};

export const prompt = (payload: PromptPayload) => {
  //
  const wallet = packages.ethers.ethers.Wallet.createRandom();
  //
};

```

## How to import un-supported packages
Example:
```jsx
import * as uuid from 'uuid';
export const prompt = (payload: PromptPayload) => {
  //
  const id = uuid.v4()
  //
};
```