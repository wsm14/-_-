const path = require("path");
const config = {
  projectName: "dakale-webNew-miniprogram",
  date: "2020-10-9",
  designWidth: 750,
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2,
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: [],
  defineConstants: {},
  copy: {
    patterns: [],
    options: {},
  },
  framework: "react",
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {},
      },

      url: {
        enable: true,
        config: {
          limit: 1024, // 设定转换尺寸上限
        },
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
    enableSourceMap: false,
    csso: {
      enable: false,
    },
  },
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {},
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]",
        },
      },
    },
  },
  alias: {
    "@/api": path.resolve(__dirname, "..", "src/api"),
    "@/components": path.resolve(__dirname, "..", "src/components"),
    "@/common": path.resolve(__dirname, "..", "src/common"),
    "@/layout": path.resolve(__dirname, "..", "src/layout"),
    "@/server": path.resolve(__dirname, "..", "src/server"),
  },
  // copy: {
  //   patterns: [
  //     { from: "cloud", to: "dist/cloud" }, // 指定需要 copy 的目录
  //   ],
  // },
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  if (process.env.NODE_ENV === "pre") {
    return merge({}, config, require("./pre"));
  }
  return merge({}, config, require("./prod"));
};
