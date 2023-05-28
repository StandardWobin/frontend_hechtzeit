const path = require("path");

module.exports = {
  devServer: {
    server: "https",
    hot: true,
    host: "localhost",
    proxy: {
      "^/api/*": {
        target: "https://localhost:1337",
        changeOrigin: true,
      },

      "^/socket.io/*": {
        target: "https://localhost:1337",
        ws: true,
        changeOrigin: true,
      },
    },
  },

  runtimeCompiler: true,
  lintOnSave: false,

  configureWebpack: {
    resolve: {
      alias: {
        components: path.resolve(__dirname, "src/components/"),
      },
    },
  },
};
