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
    (res) => fn && fn(res)
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

export const fakeUserFollow = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/userFollow/saveUserFollow",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取关注
export const fakeRemoveFollow = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/userFollow/deleteUserFollow",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//取消关注

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
export const saveWatchBean = (data, fn) => {
  const { momentId, ownerId } = data;
  fakeUpdateMomentParam({ id: momentId, ownerId, updateType: "view" });
  return httpPost(
    {
      url: "/user/moment/watch/acquireMomentTipping",
      data: data,
    },
    (res) => fn(res)
  );
};
//看动态领取卡豆
export const fakeUpdateMomentParam = (data, fn) => {
  httpPost(
    {
      url: "/user/moment/updateMomentParam",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//新版异步更新动态参数

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
export const fakRewarde = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/moment/watch/antiReward",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//udc视频领豆
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
export const fetchPromotionStatus = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/getOwnerExistPromotionStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//是否促销
export const fakeMomentReward = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/moment/watch/ugcWatchMomentReward",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户获取ugc卡豆
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
export const listOtherMomentByType = (data, fn) => {
  httpGet(
    {
      url: "/user/userMoment/listOtherMomentByType",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
}; //获取商家动态

export const listMomentByUserId = (data, fn) => {
  httpGet(
    {
      url: "/user/userMoment/listMomentByUserId",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
}; //获取他人动态
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

export const fetchUserAcquiredPlatformGift = (data, fn) => {
  return httpGet(
    {
      url: "/user/user/platform/gift/getUserAcquiredPlatformGift",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取平台券

export const fakeAcquireMoment = (data) => {
  return httpPost({
    url: "/user/moment/watch/acquireMomentTippingAndCoupon",
    data: data,
  });
};
//领取卡豆并获取推广券

export const fakeLinkCoupon = (data) => {
  return httpPost({
    url: "/user/link/coupon/exchangeMomentLinkCoupon",
    data: data,
  });
};
//视频链路券兑换
export const fetchBeanAndEarn = (data = {}) => {
  return httpGet({
    url: "/user/userInfo/getBeanAndEarn",
    data: data,
  });
};
//视频链路券兑换
