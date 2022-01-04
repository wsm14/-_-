import { httpGet, httpPost } from "@/utils/request";
export const fetchMainPage = (data = {}) => {
  return httpGet({
    url: "/user/userInfo/mainPage",
    data: data,
  });
};
//获取用户详情
export const fakeSubmitUserLocation = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/userLocation/saveUserLocation",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户每次打开小程序获取定位后提交定位信息
export const fakeUpdateLoginUserInfo = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/userInfo/updateLoginUserInfo",
      data: data,
    },
    (res) => fn(res)
  );
};
//修改用户信息

export const fetchSelfTourGoods = (data, fn) => {
  return httpGet(
    {
      url: "/user/specialGoods/getSelfTourGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取电商列表
export const fetchSpecialGoods = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/specialGoods/listSpecialGoodsByFilterType",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取特惠列表

export const getConfigNewcomerOrders = (data, fn) => {
  return httpGet(
    {
      url: "/user/config/newcomer/order/getConfigNewcomerOrders",
      data: data,
    },
    (res) => fn(res)
  );
};
//下单成功三单福利
export const getMerchantLat = (data, fn) => {
  httpGet(
    {
      url: "/user/userMerchant/listMapSearchMerchantByLatAndLnt",
      data: data,
    },
    (res) => fn(res)
  );
};
//通过地图搜索附近商家
export const fetchRightGoods = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/rightGoods/rightGoodsList",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//权益商品列表

export const fetchRightCoupon = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/rightGoods/rightCouponList",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//权益券列表
export const getUserWatchMomentEarn = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/userWatchMoment/getUserWatchMomentEarn",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取卡豆信息

export const getListWatchMomentBeanDetail = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/beanDetail/listWatchMomentBeanDetail",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取卡豆信息
export const fetchListCouponByFilterType = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/merchantMainCoupon/listCouponByFilterType",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取风向标券列表
