import {httpGet,httpPost} from "@/api/newRequest";
export const getOpenId = (data,fn) => {
  httpGet({
    url: '/user/wechat/auth',
    data:data
  },res => fn(res))
}
//获取用户openId
export const getUserInfo = (data,fn) => {
  httpGet({
    url: '/user/wechat/getEncryptedData',
    data:data
  },res => fn(res))
}
//获取用户基本信息
export const bindTelephone = (data,fn) => {
  httpGet({
    url: '/user/wechat/bindMobileByWechatXcx',
    data:data
  },res => fn(res))
}
//获取用户手机号码
