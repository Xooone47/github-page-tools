/**
 * @file babel settings
 * @author Deland
 */
module.exports = {
    'plugins': [
        [
            '@babel/plugin-proposal-decorators',
            {
                'legacy': true,
            },
        ],
        '@babel/plugin-proposal-optional-chaining', // foo?.bar?.a
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-object-rest-spread',
        'react-require',
        [
            'import',
            {
                'libraryName': 'antd',
                'libraryDirectory': 'es',
                'style': true,
            },
        ],
        [
            '@babel/plugin-transform-runtime',
            {
                'regenerator': true,
            },
        ],
    ],
    'presets': [
        '@babel/preset-env',
        '@babel/preset-react',
        [
            '@babel/preset-typescript',
            {
                'isTSX': true,
                'allExtensions': true,
            },
        ],
    ],
    'env': {
        'test': {
            'plugins': [
                [
                    'import',
                    {
                        'libraryName': 'antd',
                        'style': false,
                    },
                ],
            ],
        },
    },
};
