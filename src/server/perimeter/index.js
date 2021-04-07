import {httpGet, httpPost} from "@/api/newRequest";

export const getGoodsByMerchantId = (data, fn) => {
  httpGet({
    url: '/user/specialGoods/listMayLikeSpecialGoods',
    data: data
  }, res => fn(res))
}
//获取猜你喜欢数据

/*
*search_shop start
* */


/*
* keyword 关键字
* searchType applets-小程序，app-app端
*
* */
export const getSearchDataStatistic = (data, fn) => {
  httpGet({
    url: '/user/userMerchant/searchDataStatistic',
    data: data
  }, res => fn(res))
}
//获取搜索数据统计

/*
*
*null
*
* */
export const getSearchRecommend = (data, fn) => {
  httpGet({
    url: '/user/userMerchant/listMerchantSearchRecommend',
    data: data
  }, res => fn(res))
}
//商家热门搜索和话题对应的话题数


/*
* page 页数
* limit 数量
* smartSiftType  couponTitles-有优惠，markFlag-到店打卡， merchantShare-商家分享
* */
export const getSearchConditions = (data, fn) => {
  httpGet({
    url: '/user/userMerchant/listAllBySearchConditions',
    data: data
  }, res => fn(res))
}
//搜索所有商家列表（包括不可打卡）
/*
*search_shop end
*/



export const getSearchKolMoments = (data, fn) => {
  httpGet({
    url: '/user/kolMoments/searchKolMoments',
    data: data
  }, res => fn(res))
}
/*
* page: 页数
* limit: 行数，
* keyword 话题名称
* */
//搜索哒人发布的kol视频


export const getSearchUserList = (data, fn) => {
  httpGet({
    url: '/user/userInfo/searchUserList',
    data: data
  }, res => fn(res))
}
/*
* page: 页数
* limit: 行数，
* keyword 话题名称
* */
//搜索所有用户列表

export const getTopicKolMoments = (data, fn) => {
  httpGet({
    url: '/user/kolMoments/searchTopicAndKolMoments',
    data: data
  }, res => fn(res))
}
/*
* page: 页数
* limit: 行数，
* keyword 话题名称
* */
//搜索话题和种草数量

export const saveMarkBean = (data, fn) => {
  httpPost({
    url: '/user/beanDetail/saveMarkBeanDetailByUserId',
    data: data
  }, res => fn(res))
}


export const getMainRecommend = (data, fn) => {
  httpGet({
    url: '/user/userMerchant/mainRecommendMerchantList',
    data: data
  }, res => fn(res))
}
//首页卡片商家推荐列表

export const getListKolMoments = (data, fn) => {
  httpGet({
    url: '/user/kolMoments/listKolMoments',
    data: data
  }, res => fn(res))
}
//根据条件查找达人种草

export const getListMomentByType = (data, fn) => {
  httpGet({
    url: '/user/userMoment/listMomentByType',
    data: data
  }, res => fn(res))
}
//首页分享

export const getListGoodsDetail = (data, fn) => {
  httpGet({
    url: '/user/goods/listGoodsDetail',
    data: data
  }, res => fn(res))
}
//橱窗商品详情


export const getSpecialGoodsMerchants = (data, fn) => {
  httpGet({
    url: '/user/specialGoods/getSpecialGoodsMerchants',
    data: data
  }, res => fn(res))
}
//集团店铺列表

