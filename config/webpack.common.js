const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: {
    manager : './app/manager.js',
    cardit : './app/cardit.js',
    ryadmin : './app/admin.js',
    airline : './app/airline.js',
    agent : './app/agent.js'
  },
  resolve: {
    alias : {
      ryvendor : path.resolve(__dirname, '../vendor/'),
      ryapp : path.resolve(__dirname, '../app/'),
      Theme : path.resolve(__dirname, '../app'),
      ThemeMedias : path.resolve(__dirname, '../medias')
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Leg 2',
      template : 'app/index.html',
      filename : 'reactcomponents.html'
    }),
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  output: {
    filename: '[name].amelior.js',
    chunkFilename: '[name].amelior.js',
    path: '/mnt/hgfs/empire/var/www/macentrale/leg2/public',
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