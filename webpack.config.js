var webpack = require('webpack');

module.exports = {
  entry: [
    './src/index.js'
  ],
  output: {
    filename: './extension/assets/js/memespot-sug.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,        
        exclude: /node_modules/,
        //loaders: ['babel?presets[]=es2015'],
        loader: "babel",
        query: {
          presets: ['react','es2015']
        }
      }
    ]
  }
};

