const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = require('./paths');

module.exports = {
    entry: [paths.src + '/index.ts'],
    output: {
        path: paths.build,
        filename: '[name].bundle.js',
        publicPath: '/',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.public,
                    to: 'assets',
                    globOptions: {
                        ignore: ['*.DS_Store'],
                    },
                    noErrorOnMissing: true,
                },
                {
                    from: 'src/images',
                    to: 'images',
                },
            ],
        }),
        new HtmlWebpackPlugin({
            title: 'Oscar HTML Template',
            template: paths.src + '/pages/index.html',
            filename: 'index.html',
        }),
        new HtmlWebpackPlugin({
            title: 'Oscar HTML Page',
            template: paths.src + '/pages/page.html',
            filename: './page.html',
        }),
    ],
    module: {
        rules: [
            { test: /\.js$/, use: ['babel-loader'] },
            { test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource' },
            { test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline' },
            { test: /\.tsx?$/, loader: 'ts-loader' },
        ],
    },
    resolve: {
        modules: [paths.src, 'node_modules'],
        extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
        alias: {
            '@': paths.src,
            assets: paths.public,
        },
    },
};
