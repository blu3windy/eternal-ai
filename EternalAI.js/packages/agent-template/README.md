
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

## Packages built-in
- ethers

## Note
Please don't change files as below. That is configuration for run test, and build production.
- rollup.config.js
- tsconfig.json
- build.config.json
- package.json

## Folder structure
```
├── LICENSE
├── README.md
├── build.tsconfig.json
├── dist
├── node_modules
├── package.json
├── rollup.config.js
├── scripts
│   └── main.ts // your test here
├── src
│   ├── index.ts
│   └── prompt
│       ├── index.ts //  your code here
│       └── types.ts
└── tsconfig.json
```