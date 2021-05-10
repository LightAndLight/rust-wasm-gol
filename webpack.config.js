const CopyPlugin = require("copy-webpack-plugin");

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
      new CopyPlugin({
        patterns: [
          { from: "html/index.html", to: dist },
        ]
      })
    ],
    experiments: {
      asyncWebAssembly: true
    }
  }
};
