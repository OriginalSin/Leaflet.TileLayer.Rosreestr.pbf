import { babel } from '@rollup/plugin-babel';
//import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-porter';

const extensions = [
  '.js', '.jsx', '.ts', '.tsx', '.css'
];

export default [
    {
        input: 'src/index.js',        
        output: { 
            file: 'public/main.js',
            format: 'iife',
            sourcemap: true,
            exports: 'auto',
            name: 'Test',
            globals: {
                'leaflet': 'L'
            },
        },
        plugins: [                      
            resolve({ preferBuiltins: false }),
            commonjs(),            
            css({dest: 'public/main.css', minified: false}),           
            babel({                
                babelHelpers: 'bundled',
                extensions: ['.js', '.mjs'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['src/**']
            }),
        ],
    },
    {
        input: 'src/TileLayer.Rosreestr.pbf.js', 
        external: ['leaflet'],
        output: { 
            file: 'dist/index.js',
            format: 'iife',
            exports: 'auto',
            sourcemap: true,            
            name: 'RosreestrPlugin',
            globals: {
                'leaflet': 'L'
            },            
        },
        plugins: [                      
            resolve({ preferBuiltins: false }),
            commonjs(),            
            babel({
                babelHelpers: 'bundled',
                extensions: ['.js', '.mjs'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['src/**']
            }),
        ],
    },    

];