import { httpGet, httpPost } from "@/utils/request";
export const fakeMarkBean = (data, fn) => {
  return httpPost(
    {
      url: "/user/beanDetail/saveMarkBeanDetailByUserId",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//打卡领豆接口

export const fetchSpecialGoods = (data, fn) => {
  return httpGet(
    {
      url: "/user/specialGoods/getSpecialGoodsDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取
export const fakeSaveCollection = (data) => {
  return httpPost({
    data: data,
    url: "/user/userCollection/saveUserCollection",
  });
};
//添加收藏
export const fakeDeleteCollection = (data) => {
  return httpPost({
    data: data,
    url: "/user/userCollection/deleteUserCollection",
  });
};
//删除 收藏

export const getGoodsByMerchantId = (data, fn) => {
  return httpGet(
    {
      url: "/user/specialGoods/listMayLikeSpecialGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取猜你喜欢数据
export const fetchUserCouponDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/userCoupon/getUserCouponDetail",
      data: data,
    },
    (res) => fn(res)
  );
};
/*
 * ka列表券详情
 * */
export const listAllPut = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/specialGoods/listMerchantSpecialGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
/*
 * ka商品
 * */
export const fetchGroupDetail = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/getGroupDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取集团详情
export const fetchMerchantNearRank = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/listMerchantNearRank",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//排行榜
export const fetchCommerceGoods = (data, fn) => {
  return httpGet(
    {
      url: "/user/commerceGoods/commerceGoodsList",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取电商列表

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
export const fetchAddressList = (data, fn) => {
  return httpGet(
    {
      url: "/user/user/address/listUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取地址列表
export const fakeCreateUserAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/createUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//新增地址
export const fakeRemoveAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/deleteUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//删除地址

export const fakeUpdateAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/updateUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//修改地址
export const getUserCoupon = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/merchantMainCoupon/listMerchantMainCoupon",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取商家有价券列表
export const getSearchConditions = (data, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/listAllBySearchConditions",
      data: data,
    },
    (res) => fn(res)
  );
};
//搜索所有商家列表（包括不可打卡）
/*
 *search_shop end
 */
export const getListSpecialByPeriod = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/specialGoods/listSpecialByPeriodType",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//逛逛限时秒杀内层列表
export const fetchServiceMerchants = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/listActivityServiceMerchants",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取集团商品适用门店

export const fetchGroupSubMerchant = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/listGroupSubMerchant",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
///获取集团商品子集团列表
export const getListGoodsDetail = (data, fn) => {
  httpGet(
    {
      url: "/user/goods/listGoodsDetail",
      data: data,
    },
    (res) => fn(res)
  );
};
//橱窗商品详情

export const getUserMerchantSimpleDetail = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/getUserMerchantSimpleDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//查询商家简单信息
export const fetchRealNameInfo = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/realName/getRealNameInfo",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取用户实名认证状态

export const fakeSubmitRealName = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/realName/submitRealName",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//提交用户提名
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
export const getListMayLikeCoupon = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/merchantMainCoupon/listMayLikeCoupon",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//猜你喜欢有价券
export const getListUserMomentBySearch = (data, fn) => {
  httpGet(
    {
      url: "/user/moment/listMomentBySearch",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取搜索动态
export const getSearchRecommend = (data, fn) => {
  httpGet(
    {
      url: "/user/userMerchant/listMerchantSearchRecommend",
      data: data,
    },
    (res) => fn(res)
  );
};
//商家热门搜索和话题对应的话题数

/*
 * page 页数
 * limit 数量
 * smartSiftType  couponTitles-有优惠，markFlag-到店打卡， merchantShare-商家分享
 * */
export const fetchMultiSearchData = (data, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/multiSearchDataByKeyword",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取搜索数据统计
/*
 *params phoneMoney type of string
 */
export const fetchSearchGoods = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/specialGoods/listSpecialGoods",
      data: data,
    },
    (res) => fn(res)
  );
};
//根据条件查找商品

export const fetchMerchantListByKeyword = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/searchMerchantListByKeyword",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//新版商家名搜索商家列表（只用来搜索，包含KA）

export const fetchAllPutShelfGoods = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/goods/listAllPutShelfGoodsByMerchantId",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取商家商品橱窗
export const fetchMerchantDetail = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/getMerchantDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取商家详情

export const fetchGetRandomPlatformMoment = (data) => {
  return httpGet({
    url: "/user/moment/platformMoment/getRandomPlatformMoment",
    data: data,
  });
};
// 随机获取一个广告视频

export const fetchGetBeanGiftPackDetail = (data) => {
  return httpGet({
    url: "/user/platform/gift/getPlatformGiftPackByType",
    data: data,
  });
};
// 卡豆福利专区 - 礼包获取

export const fetchGetBeanCommerceGoodsDetail = (data) => {
  return httpGet({
    url: "/user/commerceGoods/getCommerceGoodsConfigList",
    data: data,
  });
};
// 卡豆福利专区 - 电商品数据

export const fetchGetGiftPackPriceDetail = (data) => {
  return httpGet({
    url: "/user/platform/gift/getPlatformGiftPackPrice",
    data: data,
  });
};
// 卡豆福利专区 - 礼包购买详情查询

export const fetchGiftPackPricePay = (data) => {
  return httpGet({
    url: "/user/order/savePlatformGiftOrder",
    data: data,
  });
};
// 卡豆福利专区 - 平台礼包支付订单
