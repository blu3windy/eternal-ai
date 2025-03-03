const resolve = require('@rollup/plugin-node-resolve').default;
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const {terser} = require('rollup-plugin-terser');
const pkg = require('./package.json');
import json from '@rollup/plugin-json';
// import nodePolyfills from 'rollup-plugin-polyfill-node';
// import replace from '@rollup/plugin-replace';

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
                }
            }
        },
    },
];

module.exports = {
    input: 'src/index.ts',
    output: [
        {
            file: 'dist-main/bundle.es.js',
            format: 'umd',
            name: 'UnisSwap', // please specify the name of the module
            sourcemap: false,
            globals: {
                ethers: 'ethers',
            },
        },
    ],
    plugins: [
        resolve(),
        commonjs(),
        typescript({tsconfig: './build.tsconfig.main.json', sourceMap: true}),
        terser(),
        json(),
        ...removeModulePackages(),
    ],
    external: [...Object.keys(pkg.peerDependencies || {}), "ethers"],
};
