import webpack from 'webpack'
import path from 'path'

console.log('process.env.NODE_ENV:', process.env.NODE_ENV)

const isDev = process.env.NODE_ENV !== 'production'

const config = {
  mode: isDev ? 'development' : 'production',
  entry: path.join(__dirname, 'demo', 'js', 'demo.js'),
  output: {
    path: path.join(__dirname, 'demo', 'js'),
    filename: 'demo.min.js'
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                  debug: true,
                  modules: 'umd',
                  corejs: 3
                }
              ],
              '@babel/preset-react'
            ],
            plugins: []
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      )
    })
  ]
}

if (isDev) {
  config.cache = true
  config.devtool = 'source-map'
}

export default config
