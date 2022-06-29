// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpack = require("webpack");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rimraf = require("rimraf");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const HtmlWebpackPlugin = require("html-webpack-plugin");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const inProject = path.resolve.bind(path, __dirname);
const inProjectSrc = (file) => inProject("src", file);

const config = {
  entry: {
    main: [inProjectSrc("index")],
  },
  output: {
    path: inProject("dist"),
    publicPath: "/",
    filename: "bundle.[hash].js",
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: path.resolve(__dirname, "node_modules/"),
        use: ["babel-loader"],
      },
      // https://github.com/microsoft/monaco-editor/blob/master/docs/integrate-esm.md
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
    loaders: [
      // Typescript
      { test: /\.tsx?$/, loader: "ts-loader" },
    ],
  },
  resolve: {
    modules: [inProject("src"), "node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  devServer: {
    contentBase: path.join("dist"),
    port: 8080,
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    {
      apply: (compiler) => {
        rimraf.sync(compiler.options.output.path);
      },
    },
    new webpack.HotModuleReplacementPlugin(),
    new MonacoWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: inProject("public/index.html"),
    }),
    new MiniCssExtractPlugin(),
  ],
};

config.module.rules.push({
  test: /\.(sass|scss)$/,
  loader: [
    "css-hot-loader",
    {
      loader: "typings-for-css-modules-loader",
      options: {
        modules: true,
        namedExport: true,
      },
    },
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        url: false,
        modules: {
          localIdentName: "[name]__[local]__[hash:base64:5]",
        },
      },
    },
    {
      loader: "sass-loader",
    },
  ],
});

config.module.rules.push({
  test: /\.(css)$/,
  loader: [
    "css-hot-loader",
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        url: false,
        modules: {
          localIdentName: "[local]",
        },
      },
    },
  ],
});

config.module.rules.push({
  test: /\.worker\.ts$/,
  loader: "worker-loader",
});
config.resolve.push({
  extensions: [".ts", ".js"],
});

module.exports = config;
