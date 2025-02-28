const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const {terser} = require('rollup-plugin-terser');
const pkg = require('./package.json');
import json from '@rollup/plugin-json';
// import nodePolyfills from 'rollup-plugin-polyfill-node';
// import replace from '@rollup/plugin-replace';

module.exports = {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist-main/bundle.es.js',
            format: 'es',
        }
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript({tsconfig: './build.tsconfig.main.json', sourceMap: true}),
        terser(),
        json(),
    ],
    external: [...Object.keys(pkg.peerDependencies || {}), "ethers"],
};
