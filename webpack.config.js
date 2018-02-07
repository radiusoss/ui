'use strict';

/** Note: this require may need to be fixed to point to the build that exports the gulp-core-build-webpack instance. */
let webpackTaskResources = require('@microsoft/web-library-build').webpack.resources;
let webpack = webpackTaskResources.webpack;

let path = require('path');
let isProduction = process.argv.indexOf('--production') > -1;
let packageJSON = require('./package.json');

let webpackConfig = {

  context: path.join(__dirname, 'lib/'),

  entry: {
    [packageJSON.name]: './datalayer-ui.js'
  },

  output: {
    libraryTarget: 'umd',
    path: path.join(__dirname, '/dist'),
    filename: `[name]${isProduction ? '.min' : ''}.js`
  },

  devtool: 'source-map',
//  devtool: 'eval-source-map',

  devServer: {
    stats: 'none',
    historyApiFallback: true
  },

  externals: [
    { 'react': 'React' },
    { 'react-dom': 'ReactDOM' }
  ],

  module: {
/*
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        include: paths.appSrc,
      }
    ],
*/
    loaders: [
/*
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)(\?.*)?$/,
          /\.(ts|tsx)(\?.*)?$/,
          /\.css$/,
          /\.json$/,
          /\.svg$/
        ],
/*
        loader: 'url',
        query: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]'
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        loader : 'babel-loader',
        query: { 
          presets: ['es2015', 'stage-0', 'react'],
          cacheDirectory: false
        }
      },
      {
        test: /\.(ts|tsx)$/,
        include: paths.appSrc,
        loader: 'babel-loader!awesome-typescript-loader'
      },
*/
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        loader : 'babel-loader',
        query: { 
          presets: ['es2015', 'stage-0', 'react'],
          cacheDirectory: false
        }
      },
      {
        test: /\.(csv|tsv)$/,
        loader: 'dsv-loader'
      },
      {
        test: /\.(css|scss|less)$/,
        loader:'style!css!'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-loader'
      }
    ]
  },
/*  
  postcss: function() {
    return [
      autoprefixer({
        browsers: [
          '>1%',
          'last 4 versions',
          'Firefox ESR',
          'not ie < 9', // React doesn't support IE8 anyway
        ]
      }),
    ];
  },
*/
  plugins: [
    new webpack.DefinePlugin({
      // https://github.com/OfficeDev/office-ui-fabric-react/issues/1971
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    //  new WebpackNotifierPlugin()
  ]
/*  
  // @see https://github.com/request/request/issues/1529
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
*/
}

if (isProduction) {
  webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    minimize: true,
    compress: {
      warnings: false
    }
  }))
}

module.exports = webpackConfig
