import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-porter';
import { uglify } from "rollup-plugin-uglify";

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
        input: 'src/pkk.js',        
        external: ['leaflet'],
        output: { 
            file: 'public/pkk.js',
            format: 'iife',
            sourcemap: false,
            exports: 'auto',
            name: 'Rosreestr',
            globals: {
                'leaflet': 'L'
            },
        },
        plugins: [                      
            resolve({ preferBuiltins: false }),
            commonjs(),            
            css({dest: 'public/pkk.css', minified: true}),           
            babel({                
                babelHelpers: 'bundled',
                extensions: ['.js', '.mjs'],
                exclude: ['node_modules/@babel/**', 'node_modules/core-js/**'],
                include: ['src/**']
            }),
			uglify()
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
    {
		input: 'src/worker/dataManager.js',
		output: [            
			{
				file: 'public/dataManager.js',
				format: 'iife',
				name: 'DataManager',
				sourcemap: false,
				globals: {
					'leaflet': 'L'
				},
			}
		],
		external: [],
		plugins: [    
			resolve({
				preferBuiltins: false
			}),
			commonjs(),            
			babel({
				extensions,
				babelHelpers: 'bundled',
				include: ['src/**/*'],
			}),
			uglify()
		],    
	}
];