module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        "assets": "@/assets",
        "components": "@/components",
        "utils": "@/utils",
        "views": "@/views",
        "network": "@/network",
      },
    },
  },
  publicPath: "./",
};
