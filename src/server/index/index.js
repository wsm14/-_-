import { httpGet, httpPost } from "@/api/newRequest";
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

export const getUserMomentDetailById = (data, fn) => {
  httpGet(
    {
      url: "/user/userMoment/getUserMomentDetailById",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取动态详情
export const saveWatchBean = (data, fn) => {
  httpPost(
    {
      url: "/user/beanDetail/saveWatchBeanDetailByUserId",
      data: data,
    },
    (res) => fn(res)
  );
};
//看动态领取卡豆

export const saveMerchantCollection = (data, fn) => {
  httpPost(
    {
      url: "/user/merchantCollection/saveMerchantCollection",
      data: data,
    },
    (res) => fn(res)
  );
};
//收藏商家
export const closeMerchantCollection = (data, fn) => {
  httpPost(
    {
      url: "/user/merchantCollection/deleteMerchantCollection",
      data: data,
    },
    (res) => fn(res)
  );
};
//取消收藏商家

export const updateMomentsLikeAmount = (data, fn) => {
  httpPost(
    {
      url: "/user/merchantLike/updateMomentsLikeAmount",
      data: data,
    },
    (res) => fn(res)
  );
};
//点赞商家

export const deleteMomentsLikeAmount = (data, fn) => {
  httpPost(
    {
      url: "/user/merchantLike/deleteMomentsLikeAmount",
      data: data,
    },
    (res) => fn(res)
  );
};
//点赞商家

export const getUserMomentList = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/userMoment/listMomentDetailByType",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取连刷视频动态

export const saveMomentType = (data = {}, fn) => {
  httpPost(
    {
      url: "/user/userMoment/listMomentDetailByType",
      data: data,
    },
    (res) => fn(res)
  );
};
//设置分享数量

export const getPromotionInfo = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/specialGoods/getPromotionInfo",
      data: data,
    },
    (res) => fn(res)
  );
};
//设置分享数量

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

export const checkPuzzleBeanLimitStatus = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/userMoment/checkUserPuzzleBeanLimitStatus",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取卡豆状态

export const fetchSpecialGoods = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/specialGoods/listSpecialGoodsByFilterType",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取特惠列表

export const fetchUserShareCommission = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/userInfo/getUserShareCommission",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取卡豆分层信息

export const updateUserMomentParam = (data = {}, fn) => {
  httpPost(
    {
      url: "/user/userMoment/updateUserMomentParam",
      data: data,
    },
    (res) => fn(res)
  );
};
//添加分享数量

