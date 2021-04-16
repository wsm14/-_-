/*
 * toast 提示
 * filterHttpStatus 请求返回错误信息
 * goBack 返回上一页
 * imgList 过滤string轮播图
 * backgroundObj 头像样式
 * navigateTo 跳转
 * redirectTo 重定向
 * setPeople 计算人数
 * saveFollow 关注
 * deleteFollow 取消关注
 *
 * */
import Taro from "@tarojs/taro";
import { user } from "@/api/api";
import { httpPost } from "@/api/newRequest";
import { View } from "@tarojs/components";
import Router from "./router";
// import moment from 'moment'
export const navigateTo = (url, events) => {
  console.log(url);
  Taro.navigateTo({
    url: url,
    events: events || {},
  });
  //跳转
};
//頁面跳轉
export const redirectTo = (url) => {
  Taro.redirectTo({
    url: url,
  });
  //重定向
};
export const switchTab = (url) => {
  Taro.switchTab({
    url: url,
  });
  //跳转主页
};
//頁面重定向
export const NavHeight = () => {
  let menu = wx.getMenuButtonBoundingClientRect();
  let res = Taro.getSystemInfoSync();
  return (
    res.statusBarHeight + menu.height + (menu.top - res.statusBarHeight) * 2
  );
};
//設置自定義導航欄 高度
export const toast = (value) => {
  return Taro.showToast({
    title: value,
    icon: "none",
    duration: 2000,
  });
};
//彈窗
export const filterStrList = (str) => {
  if (!str || str.length == 0) {
    return [];
  }
  return str.split(",");
};
//字符串标签 轉數組
export const filterHttpStatus = (value) => {
  if (value.includes("timeout")) {
    return "响应超时";
  } else if (value.includes("domain list")) {
    return "未配置合法域名";
  } else {
    return value;
  }
};
//http错误信息
export const goBack = function (fn) {
  Taro.navigateBack({
    delta: 1, // 返回上一级页面
    success: () => {
      fn && fn();
    },
  });
};
//返回 上一页
export const imgList = function (listStr, url, key) {
  if (listStr && listStr.length > 0 && JSON.parse(listStr)) {
    return JSON.parse(listStr).map((item) => {
      item[key] = url + item[key];
      return item;
    });
  }
  return [];
};
//字符串图片 转 数组
export const computedHeight = function (width, height, newWidth) {
  let scale = 0;
  if (typeof width == "number" && typeof height == "number") {
    scale = width / height;
  }
  scale = parseInt(width || 0) / parseInt(height || 0);
  if (parseInt(newWidth / scale) > 340) {
    return 340;
  } else if (parseInt(newWidth / scale) < 160) {
    return 160;
  } else {
    return parseInt(newWidth / scale);
  }
};
//计算图片高度
export const backgroundObj = function (url) {
  if (url) {
    return {
      background: `url(${url}) no-repeat center/cover`,
    };
  }
  return {};
};
//设置背景图片
export const backgroundover = function (url) {
  return {
    background: `url(${url}) no-repeat`,
    backgroundSize: "100% 100%",
  };
};
//设置自适应背景图片
export const filterTime = function (time) {
  time = parseInt(time);
  if (time == 0) {
    return "00:00";
  }
  if (time < 10) {
    return `00:0${time}`;
  } else if (time >= 10 && time / 60 < 1) {
    return `00:${time}`;
  } else {
    let remainder = time % 60;
    let numeral = parseInt(time / 60);
    if (numeral < 10) {
      if (remainder < 10) {
        return `0${numeral}:0${remainder}`;
      } else {
        return `0${numeral}:${remainder}`;
      }
    } else {
      if (remainder < 10) {
        return `${numeral}:0${remainder}`;
      } else {
        return `${numeral}:${remainder}`;
      }
    }
  }
};
//过率时间
export const setPeople = function (num) {
  if (typeof num == "string") {
    if (num.length > 4) {
      let str = (parseInt(num) / 10000).toFixed(1) + "万";
      return str;
    }
    return num;
  } else {
    if (num >= 10000) {
      let str = (num / 10000).toString().split(".");
      if (str.length > 1) {
        return str[0] + "." + str[1][0] + "万";
      } else {
        return str[0] + "万";
      }
    }
    return num;
  }
};
//设置人数
export const saveFollow = function (obj, fn) {
  const {
    userDetails: { saveUserFollow },
  } = user;
  httpPost(
    {
      data: obj,
      url: saveUserFollow,
    },
    (res) => {
      fn();
    }
  );
};
//添加 关注
export const deleteFollow = function (obj, fn) {
  const {
    userDetails: { deleteUserFollow },
  } = user;
  httpPost(
    {
      data: obj,
      url: deleteUserFollow,
    },
    (res) => {
      fn();
    }
  );
};
//删除关注
export const saveCollection = function (obj, fn) {
  const {
    userDetails: { saveCollection },
  } = user;
  httpPost(
    {
      data: obj,
      url: saveCollection,
    },
    (res) => {
      fn();
    }
  );
};
//添加收藏
export const deleteCollection = function (obj, fn) {
  const {
    userDetails: { deleteCollection },
  } = user;
  httpPost(
    {
      data: obj,
      url: deleteCollection,
    },
    (res) => {
      fn();
    }
  );
};
//删除 收藏
export const saveFall = function (obj, fn) {
  const {
    userDetails: { updateKol },
  } = user;
  httpPost(
    {
      data: obj,
      url: updateKol,
    },
    (res) => {
      fn();
    }
  );
};
//添加点赞
export const deleteFall = function (obj, fn) {
  const {
    userDetails: { deleteKolMoments },
  } = user;
  httpPost(
    {
      data: obj,
      url: deleteKolMoments,
    },
    (res) => {
      fn();
    }
  );
};
//删除 点赞
export const setIntive = function (time, fn, limit = 1000) {
  let times;
  if (time <= 0) {
    fn(time);
    return;
  }
  return (times = setInterval(() => {
    time--;
    fn(time);
    if (time == 0) {
      clearInterval(times);
    }
  }, limit));
};

//定时器
function Rad(d) {
  return (d * Math.PI) / 180.0; //经纬度转换成三角函数中度分表形式。
}

export const GetDistance = function (lat1, lng1, lat2, lng2) {
  let radLat1 = Rad(lat1) || Rad(30.264561);
  let radLat2 = Rad(lat2);
  let radLng1 = Rad(lng1) || Rad(120.170189);
  let radLng2 = Rad(lng2);
  let a = radLat1 - radLat2;
  let b = radLng1 - radLng2;
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  s = s.toFixed(2);
  return filterLimit(s);
};
////地理位置
export const filterLogin = function (data) {
  switch (data) {
    case "1":
      return "授权手机号";
      break;
    case "2":
      return "授权用户信息";
      break;
  }
};
//设置权限 文字
export const onShareFriend = (options) => {
  // 设置转发内容 -- 适用于: 页面右上角 ... 和 页面按钮
  let shareObj = {
    title: `${options.title}`,
    imageUrl: `${options.img}`,
    success: function (res) {
      // 转发成功之后的回调
      if (res.errMsg == "shareAppMessage:ok") {
        toast("转发成功");
      }
    },
    fail: function (res) {
      // 转发失败之后的回调
      if (res.errMsg == "shareAppMessage:fail cancel") {
        // 用户取消转发
        toast("取消转发");
      } else if (res.errMsg == "shareAppMessage:fail") {
        // 转发失败，其中 detail message 为详细失败信息
        toast("转发失败");
      }
    },
    complete: function () {
      // 转发结束之后的回调（转发成不成功都会执行）
      console.log("---转发完成---");
    },
  };
  return shareObj;
};
//设置分享微信
export const onTimeline = (option) => {
  return {
    title: `${option.title}`,
    imageUrl: `${option.img}`,
  };
};
//设置分享朋友圈
export const filterLimit = (number) => {
  if (number < 1) {
    return number * 1000 + "m";
  } else return number + "km";
};
export const upLoadFile = (arr) => {
  let list = arr.map((item) => {
    return new Promise((resolve) => {
      Taro.getImageInfo({
        src: item,
        success: (result) => {
          resolve(result);
        },
      });
    });
  });
  return Promise.all(list);
};
export const addPhotosAlbum = (path) => {
  Taro.showLoading({
    title: "正在保存",
    mask: true,
  });
  Taro.saveImageToPhotosAlbum({
    filePath: path, //canvasToTempFilePath返回的tempFilePath
    success: (res) => {
      Taro.hideLoading();
      toast("成功保存相册");
    },
    fail: (err) => {
      Taro.hideLoading();
      toast("保存失败");
    },
    complete: () => {},
  });
};
export const goDown = () => {
  navigateTo("/pages/share/download/index");
};
export const filterSetting = (str) => {
  if (str.includes("km") && parseInt(str) > 5) {
    return `驾车约${parseInt(str)}分钟`;
  } else if (str.includes("km") && parseInt(str) >= 1 && parseInt(str) <= 5) {
    return `骑车约${parseInt(str) * 4}分钟`;
  } else {
    return `骑车约${parseInt(str) / 100}分钟`;
  }
};
export const filterActive = (type) => {
  let list = type
    .map((item, index) => {
      if (item === "0" && index === 0) {
        if (index === 0) {
          return "免预约";
        }
      } else if (item === "1") {
        if (index === 0) {
          return null;
        } else if (index === 1) {
          return "随时退";
        } else if (index === 2) {
          return "过期退";
        }
      } else return null;
    })
    .filter((item) => {
      return item !== null;
    });
  list = list.join(" | ");
  return list;
};
//过滤活动标签
export const filterPayStatus = (string) => {
  switch (string) {
    case "0":
      return "待付款";
    case "1":
      return "待使用";
    case "2":
      return "已关闭";
    case "3":
      return "已完成";
    case "4":
      return "已确认";
    case "5":
      return "预支付";
    case "6":
      return "申请退款中";
  }
};
export const filterPayfont = (string) => {
  if (string == "0" || string == "2" || string == "5") {
    return "待付";
  }
  return "实付";
};
//订单所显示文字
export const filterPayColor = (string) => {
  switch (string) {
    case "0":
      return "status_color2";
    case "1":
      return "status_color2";
    case "2":
      return "status_color1";
    case "3":
      return "status_color1";
    case "4":
      return "status_color2";
    case "5":
      return "status_color2";
    case "6":
      return "status_color2";
  }
};
//订单列表颜色配置

export const filterGoodsStatus = (status) => {
  switch (status) {
    case 0:
      return "";
    case 1:
      return "0";
    case 2:
      return "1";
    case 3:
      return "6";
    // case '4': return '已确认';
    // case '5': return '预支付';
    // case '6': return '申请退款中'
  }
};
//订单列表索引映射状态值
export const objStatus = (obj) => {
  if (Object.keys(obj).length > 0) {
    return true;
  }
  return false;
};
export const filterWeek = (str) => {
  let string = [];
  if (str && str.includes("1,2,3,4,5,6,7")) {
    return `每周${["一", "二", "三", "四", "五", "六", "日"].join("、")}`;
  } else if (str) {
    string = str.split(",");
    string = string.map((item) => {
      if (item == "1") {
        return (item = "一");
      } else if (item == "2") {
        return (item = "二");
      } else if (item == "3") {
        return (item = "三");
      } else if (item == "4") {
        return (item = "四");
      } else if (item == "5") {
        return (item = "五");
      } else if (item == "6") {
        return (item = "六");
      } else if (item == "7") {
        return (item = "日");
      }
    });
    return `每周${string.join("、")}`;
  }
  return str;
};
export const getLat = () => {
  return Taro.getStorageSync("lat");
};
export const getLnt = () => {
  return Taro.getStorageSync("lnt");
};
export const getDom = (id, fn) => {
  Taro.createSelectorQuery()
    .selectAll(id)
    .boundingClientRect(function (rect) {
      fn(rect);
    })
    .exec();
};
export const filterGoods = (data) => {
  let { orderDesc } = data;
  orderDesc = JSON.parse(orderDesc);
  let { kolGoods, specialGoods } = orderDesc;
  if (!kolGoods && !specialGoods) {
    return data;
  } else if (!kolGoods) {
    orderDesc.kolGoods = orderDesc.specialGoods;
    orderDesc = JSON.stringify(orderDesc);
    return {
      ...data,
      orderDesc: orderDesc,
    };
  } else return data;
};
export const removeLogin = () =>
  Taro.removeStorage({
    key: "userInfo",
    success: (res) => {},
    fail: (res) => {
      toast("缓存清理错误");
    },
  });
//返回dom节点
export const mapGo = (item) => {
  Taro.openLocation({
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lnt),
    address: item.address || "",
    name: item.merchantName || "",
  });
};
export const removeStorage = (key) =>
  Taro.removeStorage({
    key: key,
    success: (res) => {},
    fail: (res) => {
      toast("缓存清理错误");
    },
  });
export const computedClient = () => {
  let client = Taro.getMenuButtonBoundingClientRect();
  return client;
};

//tags 排版

export const loginStatus = () => {
  const { token = "", mobile = "" } = Taro.getStorageSync("userInfo") || {};
  if (mobile.length === 11 && token) {
    return Taro.getStorageSync("userInfo");
  } else {
    return false;
  }
};

export const format = (time = "") => {
  if (new Date().getTime() > new Date(time.replace(/-/g, "/")).getTime()) {
    return true;
  }
  return false;
};
export const setBuyRule = (val, day, max) => {
  switch (val) {
    case "unlimited":
      return "每人不限购买数量";
    case "personLimit":
      return `每人限购${max}份`;
    case "dayLimit":
      return `每人每天限购${day}份`;
  }
};
export const computedPrice = (price, scale) => {
  let size = (price * (scale / 100)).toFixed(3);
  return size.substring(0, size.length - 1);
};
