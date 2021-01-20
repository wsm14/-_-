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

export const saveMerchantCollection = (data,fn) => {
  httpPost({
    url: '/user/merchantCollection/saveMerchantCollection',
    data:data
  },res => fn(res))
}
//收藏商家 
export const closeMerchantCollection = (data,fn) => {
  httpPost({
    url: '/user/merchantCollection/deleteMerchantCollection',
    data:data
  },res => fn(res))
}
//取消收藏商家 

export const updateMomentsLikeAmount = (data,fn) => {
  httpPost({
    url: '/user/merchantLike/updateMomentsLikeAmount',
    data:data
  },res => fn(res))
}
//点赞商家 

export const deleteMomentsLikeAmount = (data,fn) => {
  httpPost({
    url: '/user/merchantLike/deleteMomentsLikeAmount',
    data:data
  },res => fn(res))
}
//点赞商家 
