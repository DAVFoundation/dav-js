const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'dav.js',
    sourceMapFilename: '[file].map',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};
