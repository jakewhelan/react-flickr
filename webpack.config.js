const { HotModuleReplacementPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

module.exports = {
  mode: 'development',
  entry: {
    index: [
      'intersection-observer',
      'whatwg-fetch',
      '@babel/polyfill',
      'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
      './client/src/app.component.js'
    ]
  },
  output: {
    path: path.join(process.cwd(), 'client/dist'),
    filename: 'app.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { modules: false }],
                ['@babel/preset-react', { modules: false }]
              ],
              plugins: [
                '@babel/plugin-proposal-class-properties'
              ]
            }
          }
        ]
      },
      {
        test: /(\.scss|\.css)$/,
        use: [
          { loader: 'file-loader' },
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' },
          {
            loader: 'sass-loader',
            options: {
              implementation: require('dart-sass')
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './client/src/index.html',
      filename: './index.html'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles.css'
    })
  ]
}
