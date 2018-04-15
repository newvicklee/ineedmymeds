const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = { 
  entry: {
      main: './frontend/index.js',
  },  
  output: {
      path: path.resolve(__dirname, 'frontend/dist'),
      filename: '[name].bundle.js',
  },  
  devServer: {
      proxy: {
          "/api": {
              target: 'http://localhost:5000',
              pathRewrite: { '^/api': '' },
          },
      historyApiFallback: true,
  },
  module: {
    rules: [
      {   
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },  
      {   
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: true }
          }
        ]
      },  
      {   
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },  
      {   
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader"
        ]
      }   
    ]   
  },  
  plugins: [
    new HtmlWebPackPlugin({
      template: "./frontend/index.html",
      filename: "./index.html"
    }), 
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })  
  ]
};

