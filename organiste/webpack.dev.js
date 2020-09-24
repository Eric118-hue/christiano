const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode : 'development',
  devtool: 'inline-source-map',
  devServer : {
    contentBase: './dist',
    port: '3001',
    headers : {
      "Access-Control-Allow-Origin": "*"
    },
    host: '192.168.8.10',
    disableHostCheck: true,
    hot: true
  },
  output: {
	publicPath: 'http://192.168.8.10:3001/' //mila antsoina ty open /Applications/Google\ Chrome.app --args --disable-web-security --user-data-dir
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: '[name].css',
        chunkFilename: '[id].css',
    })
  ],
  module : {
    rules : [
          {
            test: /\.s?css$/,
            use : [
                'style-loader',
              'css-loader',
              {
                loader: 'postcss-loader', // Run post css actions
                options: {
                  plugins: function () { // post css plugins, can be exported to postcss.config.js
                    return [
                      require('precss'),
                      require('autoprefixer')
                    ];
                  }
                }
              },
              {
                  loader : 'sass-loader',
                  options: {
                    sourceMap: true
                }
              }
            ]
          }
      ]
  }
});
