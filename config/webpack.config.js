const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode : 'development',
  entry: {
    app: './src/index.js'
  },
  devtool: 'inline-source-map',
  devServer : {
    contentBase: './dist',
    port: '3000',
    host: '0.0.0.0',
    hot: true
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Output Management'
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module : {
    rules : [
      {
        test: /\.css$/,
        use : [
          'style-loader',
          'css-loader',
          'sass-loader' // compiles Sass to CSS
        ]
      },
      {
        test : /\.(png|svg|jpg|gif)$/,
        use : [
          {
        	  loader: 'url-loader',
              options: { 
                  limit: 8000, // Convert images < 8kb to base64 strings
                  name: 'images/[hash]-[name].[ext]'
              }
          }
        ]
      }
    ]
  }
};