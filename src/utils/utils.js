import Taro, { useDidShow } from "@tarojs/taro";
import days from "dayjs";

export const goBack = function (fn) {
  Taro.navigateBack({
    delta: 1, // 返回上一级页面
    success: () => {
      fn && fn();
    },
  });
};
//返回 上一页
export const NavHeight = () => {
  let menu = wx.getMenuButtonBoundingClientRect();
  let res = Taro.getSystemInfoSync();
  return (
    res.statusBarHeight + menu.height + (menu.top - res.statusBarHeight) * 2
  );
};
//設置自定義導航欄 高度
export const toast = (value, fn) => {
  return Taro.showToast({
    title: value,
    icon: "none",
    duration: 3000,
    mask: true,
    success: () => {
      fn && fn();
    },
  });
};
//小提示弹窗
export const objStatus = (obj) => {
  if (Object.keys(obj).length > 0) {
    return true;
  }
  return false;
};
//判断对象里面是否有值
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
//保存照片进相册 path 照片路径
export const loginStatus = () => {
  const { token = "", mobile = "" } = Taro.getStorageSync("userInfo") || {};
  if (mobile.length === 11 && token) {
    return Taro.getStorageSync("userInfo");
  } else {
    return false;
  }
};
//用户是否登录
export const backgroundObj = function (url) {
  if (url) {
    return {
      background: `url(${url}) no-repeat center/cover`,
    };
  }
  return {};
};
//设置背景图片
export const getLat = () => {
  return Taro.getStorageSync("lat");
};
//用户精度
export const getLnt = () => {
  return Taro.getStorageSync("lnt");
};
//用户维度
export const filterStrList = (str) => {
  if (!str || str.length == 0) {
    return [];
  }
  return str.split(",");
};
//字符串标签 轉數組
export const filterPayStatus = (string, type = "", time) => {
  if (time && string === "1") {
    return "已发货";
  } else if (type === "expiredRefund") {
    return "订单已过期";
  } else if (type === "manualRefund" && string === "6") {
    return "申请退款中";
  } else if (type === "manualRefund" && string !== "1") {
    return "退款已完成";
  } else {
    switch (string) {
      case "0":
        return "待付款";
      case "1":
        return "待核销";
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
  }
};
//订单状态映射
export const fetchStorage = (key) => {
  return Taro.getStorageSync(key);
};
//读取微信缓存
export const fakeStorage = (key, val) => {
  return Taro.setStorageSync(key, val);
};
//设置微信缓存
export const fakeRemoveStorage = (key) => {
  return Taro.removeStorageSync(key);
};
//删除微信缓存
export const computedPrice = (price, scale) => {
  let size = (price * (scale / 100)).toFixed(3);
  size = size.substring(0, size.length - 1);
  if (size === "0.00") {
    return 0.01;
  } else return size;
};
//换算价格计算
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
  if (s && s !== "NaN") {
    return filterLimit(s);
  } else {
    return null;
  }
};
////地理位置

export const computedLimit = function (lat1, lng1, lat2, lng2) {
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
  return s * 1000;
};
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
export const filterLimit = (number) => {
  if (number < 1) {
    return number * 1000 + "m";
  } else return number + "km";
};
//换算具体
export const getDom = (id, fn) => {
  Taro.createSelectorQuery()
    .selectAll(id)
    .boundingClientRect(function (rect) {
      fn(rect);
    })
    .exec();
};
//获取微信元素位置信息
export const format = (time = "") => {
  if (new Date().getTime() > new Date(time.replace(/-/g, "/")).getTime()) {
    return true;
  }
  return false;
};
//商品判断是否开始售卖
export const setBuyRule = (val, day, max) => {
  switch (val) {
    case "personLimit":
      return `每人限购${max}份`;
    case "dayLimit":
      return `每人每天限购${day}份`;
  }
};
//商品规则对应文案
export const mapGo = (item) => {
  Taro.openLocation({
    latitude: parseFloat(item.lat),
    longitude: parseFloat(item.lnt),
    address: item.address || "",
    name: item.merchantName || "",
  });
};
//打开腾讯地图
export const filterWeek = (str) => {
  let string = [];
  if (str && str.includes("1,2,3,4,5,6,7")) {
    return `每天`;
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
export const computedBeanPrice = (price, scale) => {
  let size = (price * (1 - scale / 100)).toFixed(3);
  size = size.substring(0, size.length - 1);
  if (size === "0.00") {
    return 0.01;
  } else return size;
};
//换算价格计算
export const computedSize = (size) => {
  let width = Taro.getSystemInfoSync().windowWidth;
  let sizeScale = width / 375;
  return parseInt(sizeScale * size);
};
export const computedWinHeight = () => {
  return Taro.getSystemInfoSync().windowHeight;
};
//首页视频计算比例

export const computedClient = () => {
  let client = Taro.getMenuButtonBoundingClientRect() || {};
  return client;
};

//获取顶部 按钮高度
export const computedViewHeight = (id, fn) => {
  Taro.getSystemInfo({
    success: (res) => {
      const { windowHeight } = res;
      getDom(id, (res = []) => {
        if (res[0] && res[0].top) {
          fn && fn(windowHeight - res[0].top, windowHeight);
        }
      });
    },
    fail: () => {
      toast("获取设备信息失败 ，渲染出错");
    },
  });
};
//获取设备信息
export const setNavTitle = (title) => {
  Taro.setNavigationBarTitle({
    title: title,
    fail: (res) => {
      toast("未知异常");
    },
  });
};

/**
 * 数据回传监听
 * @param onEvnetChange 事件回调
 */
export function usePostBackData(onEvnetChange) {
  useDidShow(() => {
    const pages = Taro.getCurrentPages(); // 获取页面堆栈
    const currPage = pages[pages.length - 1]; // 获取上一页栈
    const { data } = currPage.data; // 获取上一页回传数据
    if (data) {
      onEvnetChange(data);
      const closeData = setTimeout(() => {
        currPage.setData({ data: {} }); // 返回参数
        clearTimeout(closeData);
      }, 1000);
    }
  });
}
/**
 * 数据回传
 */
export function navigatePostBack(data, back = true) {
  const pages = Taro.getCurrentPages(); // 获取当前页面栈
  if (pages.length > 1) {
    const beforePage = pages[pages.length - 2]; // 获取上一个页面实例对象
    beforePage.setData({ data: data }); // 返回参数
  }
  back && Taro.navigateBack({ delta: 1 }); //返回上一个页面
}

export const mapSelect = (fn) => {
  wx.chooseLocation({
    success: (val) => {
      const { address, name, latitude, longitude } = val;
      return fn({
        address: name,
        lat: latitude,
        lnt: longitude,
        location: address,
      });
    },
    fail: () => {
      toast("获取微信位置失败");
    },
  });
};
//选择地址

export const removeLogin = () =>
  Taro.removeStorage({
    key: "userInfo",
    success: (res) => {},
    fail: (res) => {
      toast("缓存清理错误");
    },
  });
//删除用户信息
export const filterGoods = (data) => {
  let { orderDesc = {}, orderType } = data;
  orderDesc = JSON.parse(orderDesc);
  const {
    reduceCoupon = {},
    specialGoods = {},
    rightCoupon = {},
    rightGoods = {},
    commerceGoods = {},
  } = orderDesc;
  return {
    ...commerceGoods,
    ...reduceCoupon,
    ...specialGoods,
    ...rightGoods,
    ...rightCoupon,
    ...orderDesc,
    ...data,
  };
};
export const filterPayfont = (string) => {
  if (string == "0" || string == "2" || string == "5") {
    return "待付";
  }
  return "实付";
};
//订单所显示文字
export const plTimeFilter = (val) => {
  if (val) {
    let time =
      parseInt(new Date().getTime() / 1000) -
      parseInt(new Date(val.replace(/-/g, "/")).getTime() / 1000);
    if (time < 3600) {
      return parseInt(time / 60) + "分钟前";
    } else if (time > 3600 && time < 86400) {
      return parseInt(parseInt(time / 60) / 60) + "小时前";
    } else if (time > 86400 && time < 31536000) {
      const dateTime = val.split(" ")[0].split("-");
      return dateTime[1] + "月" + dateTime[2] + "日";
    } else return val.split(" ")[0];
  } else return val;
};
export const computedVideoSize = (width = 0, height = 0) => {
  let widthScale = (width * 16) / 9;
  if (widthScale === height || widthScale <= (height * 9) / 16) {
    return true;
  } else {
    return false;
  }
};
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
export const computedTime = (time, scale = 86400000) => {
  return parseInt((days(new Date()).valueOf() - days(time).valueOf()) / scale);
};
//返回天数
export const removeStorage = (key) =>
  Taro.removeStorage({
    key: key,
    success: (res) => {},
    fail: (res) => {
      toast("缓存清理错误");
    },
  });
//清理缓存
export const filterSetting = (str) => {
  if (str.includes("km") && parseInt(str) > 5) {
    return `驾车约${parseInt(parseInt(str) * 2)}分钟`;
  } else if (str.includes("km") && parseInt(str) >= 1 && parseInt(str) <= 5) {
    return `骑车约${parseInt(str) * 8}分钟`;
  } else {
    return `骑车约${parseInt(str) / 100}分钟`;
  }
};
