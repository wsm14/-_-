import {httpGet,httpPost} from "@/api/newRequest";
export const getMerchantLat = (data,fn) => {
  httpGet({
    url: '/user/userMerchant/listMapSearchMerchantByLatAndLnt',
    data:data
  },res => fn(res))
}
//通过地图搜索附近商家
export const getUserMomentDetailById = (data,fn) => {
  httpGet({
    url: '/user/userMoment/getUserMomentDetailById',
    data:data
  },res => fn(res))
}
//获取动态详情
export const saveWatchBean = (data,fn) => {
  httpPost({
    url: '/user/beanDetail/saveWatchBeanDetailByUserId',
    data:data
  },res => fn(res))
}
//看动态领取卡豆
