const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = {
  env: {
    NODE_ENV: '"development"',
    path: "",
  },
  defineConstants: {},
  mini: {
    webpackChain(chain, webpack) {
      chain.plugin("bundle analyzer").use(BundleAnalyzerPlugin);
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true,
    },
  },
  h5: {},
};
