const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    apv : './organiste/app/apv.js'
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
      title: 'Organiste',
      template : './organiste/app/index.html',
      filename : 'index.html'
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: '[name].amelior.js',
    chunkFilename: '[name].amelior.js',
    path: '/mnt/hgfs/empire/var/www/apv/public',
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