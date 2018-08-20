const path = require('path');
const webpack = require('webpack');
require('babel-polyfill');

module.exports = {
  entry: ['babel-polyfill', './build/SDKFactory.js'],
  output: {
    path: path.resolve(__dirname, 'dist/browser'),
    publicPath: '/',
    filename: 'dav.js',
    sourceMapFilename: '[file].map',
  },
  module: {
    noParse: /KafkaNode/,
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env':{
        'BROWSER': true
      }
    }),
  ] 
};
