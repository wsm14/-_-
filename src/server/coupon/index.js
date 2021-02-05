import {httpGet,httpPost} from "@/api/newRequest";
/*
* 用户我的卡券列表
* couponStatus  0-未使用 1-已过期 2-已核销 3-即将过期
* page
* size
* */
export const getCouponList = (data,fn) => {
  httpGet({
    url: '/user/userCoupon/listUserCouponByUserId',
    data:data
  },res => fn(res))
}
/*
* id 用户券id
* */
export const getUserCouponDetail = (data,fn) => {
  httpGet({
    url: '/user/userCoupon/getUserCouponDetail',
    data:data
  },res => fn(res))
}
/*
* 用户券详情 
* */
export const getAvailableCoupon = (data,fn) => {
  httpGet({
    url: '/user/userCoupon/listAvailableCouponByChannel',
    data:data
  },res => fn(res))
}
//多渠道可用券列表(打卡/消费/看视频)
export const acquireCoupon = (data, fn) => {
  httpPost({
    url: '/user/userCoupon/acquireCoupon',
    data: data
  }, res => fn(res))
}
