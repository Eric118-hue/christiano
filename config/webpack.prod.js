const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(common, {
  mode : 'production',
  //watch : true,
  watchOptions: {
    ignored : [/node_modules/, '/home/airmaildata/www/*']
  },
  optimization: {
      splitChunks : {
          chunks : 'all'
      }
  },
  /*externals : {
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_'
    }
  },*/
  plugins : [
    new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].manager.css",
        chunkFilename: "style[id].manager.css"
    }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
  ],
  devtool: 'source-map',
  module : {
    rules : [
          {
            test: /\.s?css$/,
            use : [
                MiniCssExtractPlugin.loader,
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