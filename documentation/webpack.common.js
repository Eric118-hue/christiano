const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const config = require("../cenv");

module.exports = {
  entry: {
    documentation : './documentation/app/documentation.js'
  },
  resolve: {
    alias : {
      ryvendor : path.resolve(__dirname, '../vendor/'),
      ryapp : path.resolve(__dirname, '../app/')
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Leg 2 Developer Documentation',
      template : './documentation/app/index.html',
      filename : 'index.html'
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: '[name].cc.js',
    chunkFilename: '[name].cc.js',
    path: '/home/airmaildata/www/storage/app/public/docs/diagrams',
    library: 'ControlCode'
  },
  module : {
    rules : [
        {
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['react']
              }
            }
          },
      {
        test : /\.(ttf|otf|eot|svg|woff(2)?)$/,
        use : [
          {
            loader: 'file-loader',
            options: {
                name: 'medias/fonts/[name].[ext]'
            }
          }
        ]
      },
      {
        test : /\.(png|svg|jpg|gif?)$/,
        use : [
            {
                loader: 'file-loader',
                options: {
                    name: 'medias/images/[name].[ext]'
                }
            }
        ]
      }
    ]
  }
};
