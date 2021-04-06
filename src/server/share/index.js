import {httpGet, httpPost} from "@/api/newRequest";

export const getShareNewYearSpecialActivity = (data, fn) => {
  httpGet({
    url: '/user/specialGoods/getShareNewYearSpecialActivity',
    data: data
  }, res => {
    return fn(res)
  })
}
//查询用户分享的新年特价狂欢活动
