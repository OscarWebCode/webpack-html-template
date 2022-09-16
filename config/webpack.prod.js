const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const { merge } = require('webpack-merge');

const paths = require('./paths');
const common = require('./webpack.common');

module.exports = merge(common, {
    mode: 'production',
    devtool: false,
    output: {
        path: paths.build,
        publicPath: '/',
        filename: 'js/[name].[contenthash].bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                            modules: false,
                        },
                    },
                    'sass-loader',
                ],
            },
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/[name].[contenthash].css',
            chunkFilename: '[id].css',
        }),
        new ImageminWebpWebpackPlugin(),
        new ReplaceInFileWebpackPlugin([
            {
                dir: 'dist',
                test: /\.html$/,
                rules: [
                    {
                        search: /\.jpg/gi,
                        replace: '.webp',
                    },
                    {
                        search: /\.jpeg/gi,
                        replace: '.webp',
                    },
                    {
                        search: /\.png/gi,
                        replace: '.webp',
                    },
                ],
            },
        ]),
        new FileManagerPlugin({
            events: {
                onEnd: {
                  delete: ['./dist/images/**.jpg', './dist/images/**.jpeg', './dist/images/**.png'],
                },
            },
        }),
    ],
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.squooshMinify,
                    options: {
                        // encodeOptions: {
                        //     mozjpeg: {
                        //         // That setting might be close to lossless, but it’s not guaranteed
                        //         // https://github.com/GoogleChromeLabs/squoosh/issues/85
                        //         quality: 100,
                        //     },
                        //     webp: {
                        //         lossless: 1,
                        //     },
                        //     avif: {
                        //         // https://github.com/GoogleChromeLabs/squoosh/blob/dev/codecs/avif/enc/README.md
                        //         cqLevel: 0,
                        //     },
                        // },
                    },
                },
            }),
        ],
        runtimeChunk: {
            name: 'runtime',
        },
    },
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000,
    },
});
