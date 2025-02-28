const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import replace from '@rollup/plugin-replace';

module.exports = {
  input: 'src/index.ts',
  output: [
    // {
    //     file: 'dist/bundle.iife.js',
    //     format: 'iife',
    //     name: 'UniSwap',
    //     sourcemap: true
    // }

    {
      // dir: 'dist',
      format: 'cjs',
      file: 'dist/index.cjs.js',
      sourcemap: false,
    },
    {
      // dir: 'dist',
      format: 'umd',
      file: 'dist/index.umd.js',
      name: 'UniSwap',
      sourcemap: false,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './build.tsconfig.json', sourceMap: true }),
    terser(),
    json(),
    nodePolyfills(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      'process.env.PRIVATE_KEY': JSON.stringify('production'),
      'process.env.AGENT_ADDRESS': JSON.stringify('production'),
      'process.env.API_KEY': JSON.stringify('production'),
      preventAssignment: true,
    }),
  ],
  external: [...Object.keys(pkg.peerDependencies || {}), 'ethers'],
};
