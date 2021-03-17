const presets = [
    [
        "@babel/env", {    
            "useBuiltIns": "usage",
            "corejs": {
                "version": "3.8.3",
                "proposals": false
            },
            "targets": "ie 10"
        }
    ]
];

const plugins = [
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
];

module.exports = { presets, plugins };