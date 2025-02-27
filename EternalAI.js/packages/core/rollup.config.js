const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const pkg = require('./package.json');

const json = require('@rollup/plugin-json');
const builtins = require('rollup-plugin-node-builtins');
const globals = require('rollup-plugin-node-globals');

const { uglify } = require('rollup-plugin-uglify');

module.exports = {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    {
      file: 'dist/bundle.iife.js',
      format: 'iife',
      name: 'Core',
      sourcemap: true,
    },
    {
      file: 'dist/bundle.umd.mjs',
      format: 'umd',
      name: 'Core',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      browser: true,
      preferBuiltins: true,
    }),
    commonjs(),
    globals(),
    builtins(),
    typescript({ tsconfig: './build.tsconfig.json' }),
    terser(),
    json(),
    uglify(),
  ],
  external: [...Object.keys(pkg.peerDependencies || {}), 'ethers'],
};
