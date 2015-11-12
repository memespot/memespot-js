var webpack = require('webpack');

module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    './src/index.js'
  ],
  output: {
    filename: 'lib/memespot-sug.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,        
        exclude: /node_modules/,
        loaders: ['babel?presets[]=es2015']
      }
    ]
  }
};

