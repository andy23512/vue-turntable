import { resolve } from 'path'
import webpack from 'webpack'
import autoprefixer from 'autoprefixer'

const babel = {
  presets: [
    'env',
    'stage-3',
  ],
}

const config = {
  context: resolve('app'),
  entry: {
    app: './index.js',
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        include: resolve('app/src'),
        use: [
          { loader: 'file-loader', options: { context: resolve('app/src'), name: '[path][name].html' } },
          { loader: 'extract-loader' },
          { loader: 'html-loader', options: { conservativeCollapse: false } },
          { loader: 'pug-html-loader', options: { data: { hash: Math.random().toString(36).substr(2, 5) }, pretty: true, exports: false } },
        ],
      },
      {
        test: /\.sass$/,
        include: resolve('app/src'),
        use: [
          { loader: 'file-loader', options: { name: '[name].css' } },
          { loader: 'extract-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: { plugins: [autoprefixer] } },
          { loader: 'sass-loader', options: { outputStyle: 'expanded' } },
        ],
      },
      {
        test: /\.js$/,
        include: resolve('app/src'),
        use: { loader: 'babel-loader', options: babel },
      },
      {
        test: /\.vue$/,
        include: [resolve('app/page'), resolve('app/comp')],
        use: {
          loader: 'vue-loader',
          options: {
            preserveWhitespace: false,
            postcss: { plugins: [autoprefixer] },
            loaders: { js: 'babel-loader?' + JSON.stringify(babel) },
          },
        },
      },
      {
        test: /\.(gif|jpg|png|svg)$/,
        include: resolve('app/res'),
        use: { loader: 'file-loader', options: { name: '[hash:7].[ext]', outputPath: 'res/', publicPath: '/' } },
      },
      {
        test: /favicon\.ico$/,
        include: resolve('app/res'),
        use: { loader: 'file-loader', options: { name: 'favicon.ico' } },
      },

      // Semantic UI
      {
        test: /\.css$/,
        include: resolve('node_modules/semantic-ui-reset'),
        use: [
          { loader: 'style-loader', options: { insertAt: 'top' } },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.css$/,
        include: resolve('node_modules/semantic-ui-css'),
        use: [
          { loader: 'style-loader', options: { insertAt: 'top' } },
          { loader: 'css-loader' },
        ],
      },
      {
        test: /\.(eot|png|svg|ttf|woff2|woff)$/,
        include: resolve('node_modules/semantic-ui-css'),
        use: { loader: 'file-loader', options: { name: '[hash:7].[ext]', outputPath: 'res/', publicPath: '/' } },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      '$': 'jquery/dist/jquery.slim.js',
      jQuery: 'jquery/dist/jquery.slim.js',
      Rx: 'rxjs/bundles/Rx.js'
    }),
  ],
  output: {
    path: resolve('public'),
    filename: '[name].js',
  },
  resolve: {
    alias: {
      src: resolve('app/src'),
      res: resolve('app/res'),
      '~src': resolve('app/src'),
      '~res': resolve('app/res'),
      '~page': resolve('app/page'),
      '~comp': resolve('app/comp'),
    },
  },
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    stats: 'minimal',
    inline: true,
    contentBase: false,
    disableHostCheck: true,
    historyApiFallback: true,
    proxy: { '/api': 'http://localhost:8000' },
  },
  devtool: 'source-map',
}

if(process.env.NODE_ENV === 'production') {
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
    new webpack.optimize.UglifyJsPlugin({ output: { comments: false } }),
    new webpack.LoaderOptionsPlugin({ minimize: true }),
  ])
}

export default config
