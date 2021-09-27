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
  return httpGet(
    {
      url: "/user/moment/ownerMomentDetail",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取动态详情
export const saveWatchBean = (data, fn) => {
  return httpPost(
    {
      url: "/user/moment/watch/acquireMomentTipping",
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

export const fakeInsertUserCollectionMoment = (data, fn) => {
  httpPost(
    {
      url: "/user/userCollection/saveUserCollection",
      data: data,
    },
    (res) => fn(res)
  );
};
//收藏视频
export const fakeDeleteUserCollection = (data, fn) => {
  httpPost(
    {
      url: "/user/userCollection/deleteUserCollection",
      data: data,
    },
    (res) => fn(res)
  );
};
//取消收藏视频

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
  return httpGet(
    {
      url: "/user/moment/listMainMoment",
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
      url: "/common/userActive/getPuzzleBeanLimitStatus",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取卡豆状态

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

export const fetchUserShareCommission = (data = {}, fn) => {
  return httpGet(
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
export const fetchSpecialForRecommend = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/specialGoods/listSpecialForRecommend",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取附近热销特惠
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

export const fetchRecommendMerchantList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/mainRecommendMerchantList",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取风向标商家

export const fetchMomentComment = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/momentComment/listMomentComment",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取视频评论

export const fakeMomentComment = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/momentComment/saveMomentComment",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取视频评论

export const fetchMomentRelate = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/moment/relate/listMomentRelate",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取视频关联数据

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
export const fakeNewUserVideo = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/moment/watch/newUserVideoMomentAcquire",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//新手视频领豆
