const CopyPlugin = require("copy-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

const path = require("path");
const dist = path.resolve(__dirname, "dist");

module.exports = (env) => {
  return {
    mode: env.development ? "development" : "production",
    devtool: env.development ? "inline-source-map" : null,
    entry: {
      index: "./js/index.js"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: [
            "ts-loader"
          ]
        },
      ],
    },
    resolveLoader: {
      modules: process.env.NODE_PATH.split(":")
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      path: dist,
      filename: "index.js"
    },
    plugins: [
      new EnvironmentPlugin({
        DEBUG: env.development ? true : false,
      }),
      new CopyPlugin({
        patterns: [
          { from: "html/index.html", to: dist },
        ]
      })
    ],
    experiments: {
      syncWebAssembly: true
    }
  }
};
