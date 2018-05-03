const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const IS_PRODUCTION = false;

module.exports = {
    entry: ["./src/index.tsx", "./src/index.css"],
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, '../../dist/client'),
    },
    devtool: 'source-map',
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
                test: /\.scss$/,
                use: [
                    { loader: 'style-loader' },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'sass-loader?sourceMap',
                        options: {
                            includePaths: ['./src/**/*'],
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
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
        new webpack.LoaderOptionsPlugin({
            debug: true
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            inject: 'body',
            filename: 'index.html'
        })
    ],
    devServer: {
        port: 8000,
        contentBase: './public',
        hot: true,
        noInfo: false,
        proxy: {
            '/api/*': {
                target: 'http://localhost:3000',
            },
        },
        historyApiFallback: true
    }
};