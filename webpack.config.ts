import path from "node:path";
import { Configuration } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import MarkdocWebpackPlugin from "./markdoc-webpack-plugin.js";
import markdocConfig from "./markdoc.config.js";

const configuration: Configuration = {
  mode: "none",
  entry: ["./index.ts", "./index.css"],
  resolve: {
    extensionAlias: { ".js": [".ts", ".js"] },
  },
  module: {
    rules: [
      {
        test: /.ts$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
        exclude: "/node_modules/",
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new MarkdocWebpackPlugin({
      content: {
        dir: "content",
        pattern: "**/*.md",
      },
      layout: {
        dir: "templates/layouts",
        defaultName: "default",
        ext: ".ejs",
      },
      htmlWebpackPluginOptions: {
        title: "Andrew Shaw Care",
        meta: {
          description: "The personal web site of Andrew Shaw Care",
          viewport: "width=device-width, initial-scale=1",
        },
        scriptLoading: "module",
        xhtml: true,
      },
      markdocConfig: markdocConfig,
    }),
  ],
  output: {
    filename: "main.js",
    path: path.resolve("dist"),
  },
};

export default configuration;
