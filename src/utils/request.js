/*
 * resultOperate  不同返回码进行不同的函数映射
 * httpCondition 微信http请求配置
 * baseUrl 接口环境配置
 * httpGet get请求 url-请求路径 data-请求数据 fn-请求成功的执行函数
 * httpPost post请求 url-请求路径 data-请求数据 fn-请求成功的执行函数
 * encrypt 对数据进行加密处理
 * requestUrl 请求去重
 */
import Taro from "@tarojs/taro";
import encrypt from "./keys";
import { toast } from "@/utils/utils";
import Router from "@/utils/router";
const filterHttpStatus = (value) => {
  if (value.includes("timeout")) {
    return "响应超时";
  } else if (value.includes("domain list")) {
    return "未配置合法域名";
  } else {
    return value;
  }
};
//http错误信息
const resultOperate = {
  2001: {
    type: "用户身份不存在",
    fn: () => {
      Router({
        routerName: "login",
      });
    },
  },
  5005: {
    type: "用户身份不存在",
    fn: () => {
      Router({
        routerName: "login",
      });
    },
  },
  5235: {
    type: "不是助力新用户",
    fn: () => {},
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
            // Taro.reLaunch({
            //   url: "/pages/index/perimeter/index",
            // });
          }
        },
      });
    },
  },
  5043: {
    type: "用户未实名",
    fn: () => {
      Taro.showModal({
        showCancel: "false",
        content: "请完成用户实名",
        success: (res) => {
          const { confirm } = res;
          if (confirm) {
            Router({
              routerName: "login",
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
    // baseUrl = "http://192.168.0.86:6020";
    baseUrl = "https://devgateway.dakale.net";
    // baseUrl = "https://pregateway.dakale.net";
    // baseUrl = "https://gateway1.dakale.net";
    break;
  case "production":
    // baseUrl = "https://pregateway.dakale.net";
    // baseUrl = "https://devgateway.dakale.net";
    baseUrl = "https://gateway1.dakale.net";
    break;
}
const httpCondition = {
  header: {
    apptype: "user",
    device: "weChat",
    "content-type": "application/x-www-form-urlencoded",
    "utm-source": "wechat",
    "utm-medium": Taro.getStorageSync("utm-medium"),
  },
  timeout: 60000,
  dataType: "json",
};
let requestUrl = [];
const loadBeadRequest = [
  "/user/userMoment/listMomentDetailByType",
  "/common/dictionary/listMomentBarrage",
  "/user/specialGoods/getPromotionInfo",
  "/user/userInfo/getUserShareCommission",
  "/user/userMerchant/getOwnerExistPromotionStatus",
  "/user/moment/relate/listMomentRelate",
];
export const httpGet = (obj, fn) => {
  const { header = {}, data = {} } = obj;
  if (!loadBeadRequest.includes(obj.url)) {
    Taro.showLoading({
      title: "加载中",
    });
  }
  if (
    Taro.getStorageSync("userInfo") &&
    Taro.getStorageSync("userInfo").mobile &&
    Taro.getStorageSync("userInfo").mobile.length === 11 &&
    Taro.getStorageSync("userInfo").token
  ) {
    obj.data = {
      token: Taro.getStorageSync("userInfo").token,
      ...obj.data,
    };
  }
  return new Promise((resolve, reject) => {
    Taro.request({
      ...httpCondition,
      header: {
        ...httpCondition.header,
        lnt: Taro.getStorageSync("lnt") || "",
        lat: Taro.getStorageSync("lat") || "",
        "district-code": Taro.getStorageSync("district-code") || "",
        "city-code": Taro.getStorageSync("city").cityCode || "",
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
          return resolve(content);
        } else {
          if (statusCode !== 200) {
            toast("服务路径不存在");
          } else if (!data.success) {
            const { resultDesc, resultCode } = data;
            if (resultOperate[resultCode]) {
              toast(resultDesc);
              resultOperate[resultCode].fn();
              return;
            }
            reject(res.data.content);
            return toast(resultDesc);
          }
        }
      },
      fail: (res) => {
        Taro.hideLoading();
        const { errMsg } = res;
        reject(errMsg);
        toast(filterHttpStatus(errMsg));
      },
      complete: () => {},
    });
  });
};

export const httpPost = (obj, fn, falg = true) => {
  const { header = {}, data = {} } = obj;
  Taro.showLoading({
    title: "加载中",
    mask: true,
  });
  if (
    Taro.getStorageSync("userInfo") &&
    Taro.getStorageSync("userInfo").mobile &&
    Taro.getStorageSync("userInfo").mobile.length === 11 &&
    Taro.getStorageSync("userInfo").token
  ) {
    obj.data = {
      token: Taro.getStorageSync("userInfo").token,
      ...obj.data,
    };
  }
  if (requestUrl.includes(obj.url)) {
    return;
  } else {
    requestUrl.push(obj.url);
    return new Promise((resolve, reject) => {
      Taro.request({
        ...httpCondition,
        header: {
          ...httpCondition.header,
          "content-type": "application/json",
          lnt: Taro.getStorageSync("lnt") || "",
          lat: Taro.getStorageSync("lat") || "",
          "city-code": Taro.getStorageSync("city").cityCode || "",
          "district-code": Taro.getStorageSync("district-code") || "",
          ...header,
        },
        url: baseUrl + obj.url,
        data: encrypt(obj.data) || {},
        method: "post",
        success: (res) => {
          Taro.hideLoading();
          const { data, statusCode } = res;
          if (statusCode === 200 && res.data.success) {
            const { content } = data;
            fn && fn(content, data);
            resolve(content, data);
          } else {
            if (statusCode !== 200) {
              toast("服务路径不存在");
            } else if (!data.success) {
              const { resultDesc, resultCode } = data;
              reject(res.data);
              if (resultOperate[resultCode]) {
                falg && toast(resultDesc);
                resultOperate[resultCode].fn();
                return;
              }
              return falg && toast(resultDesc);
            }
          }
        },
        fail: (res) => {
          Taro.hideLoading();
          const { errMsg } = res;
          falg && toast(filterHttpStatus(errMsg));
        },
        complete: () => {
          requestUrl = requestUrl.filter((item) => {
            return item !== obj.url;
          });
        },
      });
    });
  }
};
export const uploadFile = ({
  url = "",
  filePath,
  formData = {},
  name,
} = {}) => {
  return new Promise((resolve, reject) => {
    Taro.uploadFile({
      url: url,
      filePath: filePath,
      name: name,
      formData: formData,
      success: (res) => {
        console.log("上传接口数据", res);
        const { statusCode } = res;
        // if (res.code >= 200 && res.code < 300) {
        if (statusCode === 204) {
          resolve(res);
        } else {
          Taro.showModal({
            title: "提示",
            confirmText: "确定",
            showCancel: false,
            confirmColor: "#07c0c2",
            content: `${JSON.stringify(res)}`,
            success: function (res) {},
          });
          reject(res);
        }
      },
      fail: (res) => {
        toast("网络错误，请重新提交");
      },
    });
  });
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
