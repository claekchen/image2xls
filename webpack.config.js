var path = require('path');

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.(jsx|js)?$/,
      loaders: ['babel-loader?presets[]=es2015,presets[]=react']
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    },{ 
      test: /\.(png|jpg)$/, 
      loader: 'url-loader?limit=25000' 
    }]
  }
};