/*
 * resultOperate  不同返回码进行不同的函数映射
 * httpCondition 微信http请求配置
 * baseUrl 接口环境配置
 * httpGet get请求 url-请求路径 data-请求数据 fn-请求成功的执行函数
 * httpPost post请求 url-请求路径 data-请求数据 fn-请求成功的执行函数
 * encrypt 对数据进行加密处理
 * requestUrl 请求去重
 */
import Taro, { getCurrentPages } from "@tarojs/taro";

import encrypt from "./keys";

import {
  toast,
  filterHttpStatus,
  navigateTo,
  redirectTo,
} from "@/common/utils";

const resultOperate = {
  2001: { type: "用户身份不存在", link: "/pages/auth/index" },
  5005: {
    type: "用户身份不存在",
    link: "/pages/auth/index",
    fn: () => {},
  },
  4003: {
    type: "商家今日已被打卡",
    link: "/pages/perimeter/repeatStatus/index",
    fn: () => {},
  },
  5019: {
    type: "商家今日已被打卡",
    fn: () => {
      Taro.showModal({
        showCancel: "false",
        content: "商家不允许打卡，请到指定打卡商家哦",
      });
    },
  },
  4001: {
    type: "动态已下架",
    fn: () => {
      Taro.showModal({
        showCancel: "false",
        content: "动态已下架",
        success: (res) => {
          const { confirm } = res;
          if (confirm) {
            Taro.reLaunch({
              url: "/pages/index/perimeter/index",
            });
          }
        },
      });
    },
  },
};

let baseUrl = "";

const env =
  process.env.NODE_ENV === "development" ? "development" : "production";

switch (env) {
  case "development":
    baseUrl = "https://devgateway.dakale.net";
    // baseUrl = 'https://pregateway.dakale.net'
    // baseUrl = 'https://gateway1.dakale.net'
    break;
  case "production":
    baseUrl = "https://pregateway.dakale.net";
    // baseUrl = 'https://devgateway.dakale.net'
    // baseUrl = 'https://gateway1.dakale.net'
    break;
}

const httpCondition = {
  header: {
    apptype: "user",
    device: "weChat",
    "content-type": "application/x-www-form-urlencoded",
  },
  timeout: 10000,
  dataType: "json",
};
let requestUrl = [];
const loadBeadRequest = [
  "/user/userMoment/listMomentDetailByType",
  "/common/dictionary/listMomentBarrage",
];
export const httpGet = (obj, fn) => {
  const { header = {} } = obj;
  if (!loadBeadRequest.includes(obj.url)) {
    Taro.showLoading({
      title: "加载中",
    });
  }
  if (
    Taro.getStorageSync("userInfo") &&
    Taro.getStorageSync("userInfo").mobile.length === 11 &&
    Taro.getStorageSync("userInfo").token
  ) {
    obj.data.token = Taro.getStorageSync("userInfo").token;
  }
  Taro.request({
    ...httpCondition,
    header: {
      ...httpCondition.header,
      lnt: Taro.getStorageSync("lnt"),
      lat: Taro.getStorageSync("lat"),
      "city-code": Taro.getStorageSync("city").cityCode || "3301",
      ...header,
    },
    url: baseUrl + obj.url,
    data: encrypt(obj.data) || {},
    method: "get",
    success: (res) => {
      if (!loadBeadRequest.includes(obj.url)) {
        Taro.hideLoading();
      }
      const { data, statusCode } = res;
      if (statusCode === 200 && res.data.success) {
        const { content } = data;
        fn && fn(content);
      } else {
        if (statusCode !== 200) {
          toast("服务路径不存在");
        } else if (!data.success) {
          const { resultDesc, resultCode } = data;
          if (resultOperate[resultCode]) {
            toast(resultDesc);
            resultOperate[resultCode].fn();
            return navigateTo(resultOperate[resultCode].link);
          }
          return toast(resultDesc);
        }
      }
    },
    fail: (res) => {
      Taro.hideLoading();
      const { errMsg } = res;
      toast(filterHttpStatus(errMsg));
    },
    complete: () => {},
  });
};

export const httpPost = (obj, fn) => {
  const { header = {} } = obj;
  Taro.showLoading({
    title: "加载中",
    mask: true,
  });
  if (
    Taro.getStorageSync("userInfo") &&
    Taro.getStorageSync("userInfo").mobile.length === 11 &&
    Taro.getStorageSync("userInfo").token
  ) {
    obj.data.token = Taro.getStorageSync("userInfo").token;
  }
  if (requestUrl.includes(obj.url)) {
    return;
  } else {
    requestUrl.push(obj.url);
    Taro.request({
      ...httpCondition,
      header: {
        ...httpCondition.header,
        "content-type": "application/json",
        lnt: Taro.getStorageSync("lnt"),
        lat: Taro.getStorageSync("lat"),
        "city-code": Taro.getStorageSync("city").cityCode || "3301",
        ...header,
      },
      url: baseUrl + obj.url,
      data: encrypt(obj.data) || {},
      method: "post",
      success: (res) => {
        Taro.hideLoading();
        console.log(res);
        const { data, statusCode } = res;
        if (statusCode === 200 && res.data.success) {
          const { content } = data;
          fn && fn(content, data);
        } else {
          if (statusCode !== 200) {
            toast("服务路径不存在");
          } else if (!data.success) {
            const { resultDesc, resultCode } = data;
            if (resultOperate[resultCode]) {
              toast(resultDesc);
              resultOperate[resultCode].fn();
              resultOperate[resultCode].link &&
                navigateTo(resultOperate[resultCode].link);
              return;
            }
            return toast(resultDesc);
          }
        }
      },
      fail: (res) => {
        Taro.hideLoading();
        const { errMsg } = res;
        toast(filterHttpStatus(errMsg));
      },
      complete: () => {
        requestUrl = requestUrl.filter((item) => {
          return item !== obj.url;
        });
      },
    });
  }
};

export const httpOtherGet = (obj, fn) => {
  Taro.request({
    ...httpCondition,
    header: {
      ...httpCondition.header,
      lnt: Taro.getStorageSync("lnt"),
      lat: Taro.getStorageSync("lat"),
    },
    url: obj.url,
    data: obj.data || {},
    method: "get",
    success: (res) => {
      const { data, statusCode } = res;
      if (statusCode === 200) {
        fn && fn(data);
      } else {
        toast("请求失败...");
      }
    },
    fail: (res) => {
      const { errMsg } = res;
      toast(filterHttpStatus(errMsg));
    },
    complete: () => {},
  });
};
