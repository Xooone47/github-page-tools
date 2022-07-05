/* eslint-disable @typescript-eslint/no-var-requires */
/**
 * @file webpack settings
 * @author Deland
 */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBuildNotifierPlugin = require('webpack-build-notifier');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {merge} = require('webpack-merge');

const useSpeedMeasure = false;

const getIsEnableCssModules = resourcePath => {
    const relativePath = path.relative(__dirname, resourcePath);

    // node_modules和src/styles中的样式文件不开启css modules
    if (relativePath.startsWith('node_modules') || relativePath.startsWith('src/styles')) {
        return false;
    }

    return true;
};

const getPlugins = mode => {
    const isDevMode = mode === 'development';

    const commonPlugins = [
        new HtmlWebpackPlugin({
            title: 'FExpy',
            template: './src/index.html',
            filename: isDevMode ? 'index.html' : '../index.html',
            inject: 'body',
        }),
        new webpack.DefinePlugin({
            __ENV__: JSON.stringify((process.env.env || 'dev').toLowerCase()),
        }),
        new MiniCssExtractPlugin({
            filename: isDevMode ? '[name].css' : 'css/[name].[contenthash].css',
            chunkFilename: isDevMode ? '[id].css' : 'css/[id].[contenthash].css',
            // antd bug，https://github.com/ant-design/ant-design/issues/14895，组件引入顺序可能会导致css order问题
            // 这里忽略warning
            ignoreOrder: true,
        }),
    ];

    const devPlugins = [
        // new webpack.HotModuleReplacementPlugin(),    // TODO
        new WebpackBuildNotifierPlugin({ // 构建完弹窗通知
            title: 'Project Build',
            suppressSuccess: false,
        }),
        new FriendlyErrorsWebpackPlugin({
            compilationSuccessInfo: {
                messages: ['App is running on: http://localhost:4747'],
                clearConsole: false,
            },
            additionalTransformers: [
                error => {
                    if (error.name === 'ESLintError') {
                        return Object.assign({}, error, {
                            type: 'quiet-eslint-error', // 定义特殊的type，使其匹配不上任何formatter，则不会打印到控制台
                        });
                    }
                    return error;
                },
            ],
        }),
        new ReactRefreshWebpackPlugin(),
        new ESLintPlugin({
            extensions: ['js', 'jsx', 'ts', 'tsx'],
            failOnError: false,
        }),
        new ForkTsCheckerWebpackPlugin({
            typescript: {
                diagnosticOptions: {
                    semantic: true,
                    syntactic: true,
                },
            },
            logger: {
                devServer: false,
            },
        }),
    ];

    if (mode === 'production') {
        return commonPlugins;
    } else {
        return [
            ...commonPlugins,
            ...devPlugins,
        ];
    }
};

const devConfigs = {
    devtool: 'inline-source-map',
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'build', 'static'),
        publicPath: '/assets/',
    },
    devServer: {
        port: 4747,
        host: '0.0.0.0',
        static: [
            {
                directory: path.join(__dirname, 'public'),
                watch: {
                    interval: 500,
                },
            },
            {
                directory: path.join(__dirname, 'static'),
                watch: {
                    interval: 500,
                },
            },
        ],
        historyApiFallback: {
            index: '/assets/',
            rewrites: [
                {
                    from: /^[^/rest/v1].*$/,
                    to: 'index.html',
                },
            ],
        },
        // proxy: {
        //     '/rest': {
        //         target: 'http://',
        //         secure: false
        //     }
        // },
        hot: true,
        client: {
            overlay: false,
        },
    },
};

const prodConfigs = {
    output: {
        filename: 'js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'build', 'static'),
        publicPath: '/static/',
    },
};

const getConfigs = (env, argv) => {
    const {mode} = argv;
    const isDevMode = mode === 'development';

    const commonConfigs = {
        entry: './src/index.js',
        resolve: {
            extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
            modules: ['node_modules'],
            alias: {
                '@': path.resolve(__dirname, 'src'),
                'react-dom': '@hot-loader/react-dom',
            },
        },
        cache: {
            type: 'filesystem',
            buildDependencies: {
                config: [__filename],
            },
        },
        watchOptions: {
            aggregateTimeout: 600,
            ignored: [
                '**/node_modules',
                path.join(__dirname, '*.*'), // ignore the files on root dir
            ],
        },
        module: {
            rules: [
                {
                    test: /(\.jsx|\.js|\.ts|\.tsx)$/,
                    use: [
                        'thread-loader',
                        {
                            loader: 'babel-loader',
                            options: {
                                configFile: path.join(__dirname, 'configs/babel.config.js'),
                                cacheDirectory: true,
                                plugins: [isDevMode && require.resolve('react-refresh/babel')].filter(Boolean),
                            },
                        },
                    ],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(less|css)$/,
                    use: [
                        isDevMode ? 'css-hot-loader' : null, // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34#issuecomment-378594368
                        {
                            loader: MiniCssExtractPlugin.loader,
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                modules: {
                                    auto: getIsEnableCssModules,
                                    localIdentName: '[path][name]__[local]--[hash:base64:5]',
                                },
                                esModule: false,
                            },
                        },
                        {
                            loader: 'postcss-loader', // need "node": ">= 10.13.0"
                            options: {
                                postcssOptions: {
                                    config: path.join(__dirname, 'configs', 'postcss.config.js'),
                                },
                            },
                        },
                        {
                            loader: 'less-loader',
                            options: {
                                javascriptEnabled: true,
                            },
                        },
                    ].filter(Boolean),
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10000,
                        },
                    },
                    generator: {
                        filename: 'img/[name].[hash:7][ext][query]',
                    },
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10000,
                        },
                    },
                    generator: {
                        filename: 'media/[name].[hash:7][ext][query]',
                    },
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                    type: 'asset',
                    parser: {
                        dataUrlCondition: {
                            maxSize: 10000,
                        },
                    },
                    generator: {
                        filename: 'fonts/[name].[hash:7][ext][query]',
                    },
                },
            ],
        },
        optimization: {
            chunkIds: 'deterministic',
            // namedChunks: true,
            splitChunks: {
                chunks: 'all',
                maxInitialRequests: 10,
                cacheGroups: {
                    react: {
                        name: 'react',
                        // eslint-disable-next-line
                        test: /[\\/]node_modules[\\/](react|redux|recoil|react-dom|react-router|@hot-loader[\\/]react-dom|react-router-dom|react-redux|redux-thunk)[\\/]/,
                        priority: 20,
                    },
                    antd: {
                        name: 'antd',
                        test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
                        priority: 10,
                    },
                    vendors: {
                        name: 'vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true,
                    },
                },
            },
        },
        plugins: getPlugins(mode),
    };

    const targetConfigs = isDevMode ? devConfigs : prodConfigs;

    let result = merge(commonConfigs, targetConfigs);

    if (useSpeedMeasure) {
        const smp = new SpeedMeasurePlugin();
        result = smp.wrap(result);
    }

    return result;
};

module.exports = getConfigs;

// 这个东西暂时有bug
// 构建时展示打包过程各部件的耗时
// const smp = new SpeedMeasurePlugin({
//     disable: process.env.ANALYZE // 进行analyze时不运行，避免污染stat.json的输出
// });

// module.exports = smp.wrap(getConfigs);
