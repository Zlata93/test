const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {

    entry: {
        script: ['./src/js/script.js']
    },

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.(sa|sc|c)ss$/,

                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.svg/,
                use: {
                    loader: 'svg-url-loader',
                    options: {}
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './1.5.html',
            filename: './1.5.html',
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: './1.1.html',
            filename: './1.1.html',
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: './1.6.html',
            filename: './1.6.html',
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: './2.1.html',
            filename: './2.1.html',
            inject: true
        }),
        new HtmlWebpackPlugin({
            template: './3.1.html',
            filename: './3.1.html',
            inject: true
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css'
        }),
    ]
};
