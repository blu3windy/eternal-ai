const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.iife.js',
      format: 'iife',
      name: 'UniSwap',
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './build.tsconfig.json' }),
    terser(),
    json(),
    nodePolyfills()
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};
