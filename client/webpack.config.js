const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_PRODUCTION = false;

module.exports = {
    mode: IS_PRODUCTION ? "production" : "development",
    entry: "./src/index.tsx",
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, '../dist/client'),
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                loader: "ts-loader",
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.ts$/,
                loader: "ts-loader",
                exclude: /(node_modules|bower_components)/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            camelCase: true,
                            sourceMap: !IS_PRODUCTION,
                            minimize: IS_PRODUCTION
                        }
                    }
                ]
            },
            {
                test: /.jpe?g$|.gif$|.png$|.svg$|.woff$|.woff2$|.ttf$|.eot$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: 'body',
            filename: 'index.html'
        })
    ],
    devServer: {
        port: 8000,
        contentBase: './public',
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000',
            },
        },
        historyApiFallback: true
    }
};