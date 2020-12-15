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
