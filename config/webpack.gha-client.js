const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const config = require("../cenv-gha-client");

module.exports = {
  entry: {
    gha: './gha/gha.js'
  },
  resolve: {
    alias : {
      ryvendor : path.resolve(__dirname, '../vendor/'),
      ryapp : path.resolve(__dirname, '../gha/'),
      Theme : path.resolve(__dirname, '../gha'),
      ThemeMedias : path.resolve(__dirname, '../medias')
    },
    
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'GHA',
      template : 'gha/index.html',
      filename : 'reactcomponents.html'
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: '[name].gha.js',
    chunkFilename: '[name].gha.js',
    path: config.laravel.public,
    library: 'Ry'
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
