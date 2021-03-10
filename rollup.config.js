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
            name: 'Test',
            globals: {
                'leaflet': 'L'
            },
        },
        plugins: [                      
            resolve({
				preferBuiltins: false
                // customResolveOptions: {
                    // moduleDirectory: ['node_modules', 'src']
                // },
            }),
            commonjs(),            
            css({dest: 'public/main.css', minified: false}),
            // cpy([
                // {files: 'src/images/*.*', dest: 'public/assets/images'},
                // {files: 'src/ImageBitmapLoader-worker.js', dest: 'public'},
            // ]),
			// babel({ babelHelpers: 'bundled' })
			
            babel({                
                babelHelpers: 'bundled',
                extensions: ['.js', '.mjs'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['example/**', 'src/**']
            }),
        ],
    },    
];