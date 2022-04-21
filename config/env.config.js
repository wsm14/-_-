// const target = "https://devgateway.dakale.net";
const target = "https://gateway1.dakale.net";
// const target = "http://192.168.0.121:6020";


export default {
  // 开发环境 npm run dev:weapp
  dev: {
    env: {
      NODE_ENV: '"development"',
    },
    defineConstants: {
      APIURL: JSON.stringify(target),
     
    },
    mini: {
      miniCssExtractPluginOption: {
        ignoreOrder: true,
      },
    },
    h5: {},
  },
  // 生产环境 测试包 npm run test:weapp
  test: {
    env: {
      NODE_ENV: '"production"',
    },
    defineConstants: {
      APIURL: '"https://devgateway.dakale.net"',
   
    },
    mini: {
      optimizeMainPackage: {
        enable: true,
      },
    },
    h5: {},
  },
  // 生产环境 npm run build:weapp
  prod: {
    env: {
      NODE_ENV: '"production"',
    },
    defineConstants: {
      APIURL: '"https://gateway1.dakale.net"',
   
    },
    mini: {
      optimizeMainPackage: {
        enable: true,
      },
    },
    h5: {
      /**
       * 如果h5端编译后体积过大，可以使用webpack-bundle-analyzer插件对打包体积进行分析。
       * 参考代码如下：
       * webpackChain (chain) {
       *   chain.plugin('analyzer')
       *     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
       * }
       */
    },
  },
};
