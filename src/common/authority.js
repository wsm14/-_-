import Taro, { getCurrentInstance, getCurrentPages } from "@tarojs/taro";
import { toast, addPhotosAlbum, navigateTo } from "@/common/utils";
import { saveMarkBean } from "@/server/perimeter";
import router from "./router";
import qs from "qs";

export const setLocation = (fn) => {
  Taro.getLocation({
    type: "wgs84",
    success: (res) => {
      var latitude = res.latitude;
      var longitude = res.longitude;
      var speed = res.speed;
      var accuracy = res.accuracy;
      Taro.setStorageSync("lnt", longitude);
      Taro.setStorageSync("lat", latitude);
      fn && fn(res);
    },
    fail: function (res) {
      console.log("fail" + JSON.stringify(res));
    },
  });
};
export const setMap = (fn) => {
  Taro.getLocation({
    type: "gcj02",
    success: (res) => {
      var latitude = res.latitude;
      var longitude = res.longitude;
      var speed = res.speed;
      var accuracy = res.accuracy;
      Taro.setStorageSync("lnt", longitude);
      Taro.setStorageSync("lat", latitude);
      fn && fn(res);
    },
    fail: function (res) {
      console.log("fail" + JSON.stringify(res));
    },
  });
};
//获取当前位置

export const startLocationUpdate = (fn) => {
  Taro.startLocationUpdate({
    success: (res) => {
      Taro.onLocationChange((res) => {
        var latitude = res.latitude;
        var longitude = res.longitude;
        Taro.setStorageSync("lnt", longitude);
        Taro.setStorageSync("lat", latitude);
        fn && fn(res);
      });
    },
    fail: function (res) {
      console.log("fail" + JSON.stringify(res));
    },
  });
};
//获取实时定位
export const login = (obj) => {
  let authLogin = obj;
  if (
    authLogin &&
    Object.keys(authLogin).length > 5 &&
    authLogin.mobile.length === 11
  ) {
    return "0";
  } else if (
    authLogin &&
    Object.keys(authLogin).length > 5 &&
    authLogin.mobile.length !== 11
  ) {
    return "1";
  } else {
    return "2";
  }
};
//获取定位
/*
 *
 * map
 *
 *
 * */
export const authUpdateGeography = (fn) => {
  Taro.getSetting({
    success: (res) => {
      if (!res.authSetting["scope.userLocation"]) {
        Taro.authorize({
          scope: "scope.userLocation",
          success: (res) => {
            startLocationUpdate(fn);
          },
          fail: (res) => {
            Taro.showModal({
              title: "获取位置失败",
              content: "请允许「哒卡乐」使用你的定位，为你推荐更多周边店铺",
              success: function (res) {
                if (res.confirm) {
                  Taro.openSetting({
                    success: (dataAu) => {
                      if (dataAu.authSetting["scope.userLocation"] == true) {
                        toast("授权成功");
                        startLocationUpdate(fn);
                      } else {
                        toast("授权失败,已配置默认定位");
                        fn &&
                          fn({
                            latitude: 30.229271,
                            longitude: 120.255384,
                          });
                      }
                    },
                  });
                } else if (res.cancel) {
                  toast("授权失败,已配置默认定位");
                  fn &&
                    fn({
                      latitude: 30.229271,
                      longitude: 120.255384,
                    });
                }
              },
            });
          },
        });
      } else {
        startLocationUpdate(fn);
      }
    },
    fail: (res) => {
      toast("授权接口调用失败，请检查网络");
    },
  });
};
//获取实时定位
/*
 *
 * map
 *
 *
 * */
export const authPhotosAlbum = (path) => {
  Taro.getSetting({
    success: (res) => {
      if (!res.authSetting["scope.writePhotosAlbum"]) {
        Taro.authorize({
          scope: "scope.writePhotosAlbum",
          success: (res) => {
            addPhotosAlbum(path);
          },
          fail: (res) => {
            Taro.showModal({
              title: "是否要打开设置页面",
              content: "需要您设置保存照片权限",
              success: function (res) {
                if (res.confirm) {
                  Taro.openSetting({
                    success: (dataAu) => {
                      if (
                        dataAu.authSetting["scope.writePhotosAlbum"] == true
                      ) {
                        toast("授权成功");
                        //再次授权，调用wx.getLocation的API
                      } else {
                        toast("授权失败");
                      }
                    },
                  });
                } else if (res.cancel) {
                  toast("授权失败");
                }
              },
            });
          },
        });
      } else {
        addPhotosAlbum(path);
      }
    },
    fail: (res) => {
      toast("授权接口调用失败，请检查网络");
    },
  });
};
//保存相册
export const authWxLogin = (fn) => {
  Taro.login({
    success: function (res) {
      if (res.code) {
        fn && fn(res.code);
      } else {
        toast("获取用户登录态失败！" + res.errMsg);
      }
    },
  });
};
//微信openId
export const internet = (obj, fn) => {
  Taro.onNetworkStatusChange(function (res) {
    const { isConnected, networkType } = res;
    if (isConnected == false && networkType == "none") {
      Taro.showToast({
        title: "网络错误",
        icon: "none",
        duration: 2000,
      });
    } else {
      if (Object.keys(obj).length < 5) {
        fn && fn();
      }
    }
  });
};
//网络环境
export const scanCode = (data) => {
  if (
    Taro.getStorageSync("userInfo") &&
    Taro.getStorageSync("userInfo").mobile &&
    Taro.getStorageSync("userInfo").mobile.length === 11 &&
    Taro.getStorageSync("userInfo").token
  ) {
    Taro.scanCode({
      onlyFromCamera: false,
      success: (results) => {
        const { path, scanType, result } = results;
        if (scanType === "QR_CODE") {
          let data = qs.parse(result.split("?")[1]);
          if (
            result.includes("https://www.dakale.net") &&
            data.action === "pay" &&
            data.merchantId
          ) {
            return router({
              routerName: "codePay",
              args: {
                merchantId: data.merchantId,
              },
            });
          } else if (
            result.includes("https://www.dakale.net") &&
            data.action === "mark" &&
            data.merchantId
          ) {
            getAuthStatus({
              key: "location",
              success: () => {
                saveMarkBean({ merchantId: data.merchantId }, (res) => {
                  const {
                    resultCode,
                    merchantLnt,
                    merchantLat,
                    merchantAddress,
                    beanAmount,
                    merchantName = "",
                  } = res;
                  if (resultCode && resultCode === "40012") {
                    router({
                      routerName: "makeError",
                      args: {
                        code: resultCode,
                      },
                    });
                  } else {
                    router({
                      routerName: "merchantDetails",
                      args: {
                        merchantId: data.merchantId,
                        beanAmount,
                      },
                    });
                  }
                }).catch((val) => {
                  const { resultCode } = val;
                  router({
                    routerName: "makeError",
                    args: {
                      code: resultCode,
                    },
                  });
                });
              },
              fail: () => {
                router({
                  routerName: "makeError",
                  args: {
                    code: 10086,
                  },
                });
              },
            });
          } else {
            Taro.showModal({
              showCancel: "false",
              content: "二维码无效，请重新扫描哒卡乐二维码",
            });
            return;
          }
        }
      },
      fail: (res) => {
        // Taro.showModal({
        //   showCancel: "false",
        //   content: "扫码失败",
        // });
      },
    });
  } else {
    navigateTo("/pages/auth/index");
  }
};

export const scanCard = () => {
  return loginBtn(() => {
    Taro.scanCode({
      onlyFromCamera: false,
      success: (results) => {
        const { path, scanType, result } = results;
        if (scanType === "QR_CODE") {
          let data = qs.parse(result.split("?")[1]);
          if (
            result.includes("https://www.dakale.net") &&
            data.action === "mark" &&
            data.merchantId
          ) {
            getAuthStatus({
              key: "location",
              success: () => {
                saveMarkBean({ merchantId: data.merchantId }, (res) => {
                  const {
                    resultCode,
                    merchantLnt,
                    merchantLat,
                    merchantAddress,
                    beanAmount,
                    merchantName = "",
                  } = res;
                  if (resultCode && resultCode === "40012") {
                    router({
                      routerName: "makeError",
                      args: {
                        code: resultCode,
                      },
                    });
                  } else {
                    router({
                      routerName: "merchantDetails",
                      args: {
                        merchantId: data.merchantId,
                        beanAmount,
                      },
                    });
                  }
                }).catch((val) => {
                  const { resultCode } = val;
                  router({
                    routerName: "makeError",
                    args: {
                      code: resultCode,
                    },
                  });
                });
              },
              fail: () => {
                router({
                  routerName: "makeError",
                  args: {
                    code: 10086,
                  },
                });
              },
            });
          } else {
            Taro.showModal({
              showCancel: "false",
              content: "二维码无效，请重新扫描哒卡乐打卡码",
            });
            return;
          }
        } else {
          Taro.showModal({
            showCancel: "false",
            content: "扫码类型错误",
          });
        }
        // return
      },
      fail: (res) => {},
    });
  });
};

export const loginBtn = (callback) => {
  const { token = "", mobile = "" } = Taro.getStorageSync("userInfo") || {};
  if (mobile.length === 11 && token) {
    callback && callback(Taro.getStorageSync("userInfo"));
  } else {
    navigateTo("/pages/auth/index");
  }
};
//腾讯地图key值

export const getSettingAuth = (obj) => {
  const { key, success, fail, title, content, cancel = "" } = obj;
  const getUserAuth = {
    location: "scope.userLocation",
    photo: "scope.writePhotosAlbum",
  }[key];
  Taro.getSetting({
    success: (res) => {
      if (!res.authSetting[getUserAuth]) {
        Taro.authorize({
          scope: getUserAuth,
          success: (res) => {
            success && success();
          },
          fail: (res) => {
            Taro.showModal({
              title: title,
              content: content,
              success: function (res) {
                if (res.confirm) {
                  Taro.openSetting({
                    success: (dataAu) => {
                      if (dataAu.authSetting[getUserAuth] == true) {
                        success && success();
                        toast("授权成功");
                      } else {
                        fail && fail();
                        toast(`授权失败,${cancel}`);
                      }
                    },
                  });
                } else if (res.cancel) {
                  fail && fail();
                  cancel && toast(cancel);
                }
              },
            });
          },
        });
      } else {
        success && success();
      }
    },
    fail: (res) => {
      toast("授权接口调用失败，请检查网络");
    },
  });
};
export const getAuthStatus = (obj) => {
  const { key, success, fail } = obj;
  const getUserAuth = {
    location: "scope.userLocation",
    photo: "scope.writePhotosAlbum",
  }[key];
  Taro.authorize({
    scope: getUserAuth,
    success: (res) => {
      success && success(true);
    },
    fail: (res) => {
      fail && fail(false);
    },
  });
};

export const mapTx = "V44BZ-PNPR4-Z6PUO-X2YUZ-5GAVO-MRBYQ";
