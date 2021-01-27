const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  mini: {
    webpackChain(chain, webpack) {
      chain.plugin("bundle analyzer").use(BundleAnalyzerPlugin);
    }
  },
  h5: {}
}
