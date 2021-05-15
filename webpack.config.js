const CopyPlugin = require("copy-webpack-plugin");
const { EnvironmentPlugin } = require("webpack");

const path = require("path");
const dist = path.resolve(__dirname, "dist");

module.exports = (env) => {
  return {
    mode: env.development ? "development" : "production",
    entry: {
      index: "./js/index.js"
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
