const path = require("path");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    entry: {
      dev: ["./example/app.js"]
    },
    output: {
      filename: "app.js",
      path: path.resolve(__dirname, "example"),
      publicPath: "/assets/",
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        'monaco-editor': path.resolve('node_modules/monaco-editor/esm/vs/editor/editor.main.js'),
        'monaco-ext': path.resolve(__dirname, 'src'),
        // 'monaco-ext/themes': path.resolve(__dirname, 'themes'),
      },
      fallback: {
        "path": require.resolve("path-browserify"),
        "fs": false,
        "util": false
      }
    },
    module: {
      rules: [
        {
          test: /(\.js?$)|(\.jsx?$)/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
				  use: ['style-loader', 'css-loader']
        },
        {
          test: /\.wasm$/,
          type: 'asset/resource'
        },
        {
          test: /\.tmLanguage\.json$/,
          type: 'json'
        }
      ]
    },
    plugins: [new MonacoWebpackPlugin()],
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      static: [
        {
          directory: path.join(__dirname, 'example'),
          publicPath: "/",
        },
        {
          directory: path.join(__dirname, 'example'),
          publicPath: "/assets/",
        },
      ],
      historyApiFallback: true
    }
}