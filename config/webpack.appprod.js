const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode : 'production',
  plugins : [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
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
                  loader : 'sass-loader'
              }
            ]
          }
      ]
  }
});