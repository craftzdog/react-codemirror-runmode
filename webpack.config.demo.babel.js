import webpack from 'webpack'
import path from 'path'

const config = {
  entry: path.join(__dirname, 'demo', 'js', 'demo.js'),
  output: {
    path: path.join(__dirname, 'demo', 'js'),
    filename: 'demo.min.js'
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: ['babel-loader']
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ]
}

if (process.env.NODE_ENV !== 'production') {
  config.cache = true
  config.devtool = 'source-map'
}

export default config
