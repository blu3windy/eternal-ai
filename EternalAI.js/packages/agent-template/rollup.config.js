const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

const json = require('@rollup/plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');
const inject = require('@rollup/plugin-inject');

const { uglify } = require('rollup-plugin-uglify');
import gzipPlugin from 'rollup-plugin-gzip';
import replace from '@rollup/plugin-replace';

const removeModulePackages = () => [
  {
    name: 'remove-require-packages',
    generateBundle(options, bundle) {
      for (const fileName in bundle) {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.code) {
          // Replace all occurrences of require("ethers") or require('ethers')
          chunk.code = chunk.code.replace(
            /require\((['"])ethers\1\)/g,
            'global.ethers'
          );
          chunk.code = chunk.code.replace(
            /require\((['"])@uniswap\/sdk-core\1\)/g,
            'global.uniswap'
          );
        }
      }
    },
  },
];

module.exports = {
  input: ['./src/index.ts'],
  output: [
    {
      // dir: 'dist',
      format: 'umd',
      file: 'dist/index.umd.js',
      name: 'agentTemplate', // please specify the name of the module
      sourcemap: false,
      globals: {
        ethers: 'ethers',
        uniswap: '@uniswap/sdk-core',
      },
    },
  ],
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    resolve({}),
    inject({}),
    commonjs(),
    globals(),
    builtins(),
    typescript({
      tsconfig: './build.tsconfig.json',
    }),
    ...removeModulePackages(),
    terser(),
    json(),
    uglify(),
    gzipPlugin(),
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {}),
    'ethers',
    '@uniswap/sdk-core',
  ],
};
