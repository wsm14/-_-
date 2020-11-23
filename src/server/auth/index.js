import {httpGet,httpPost} from "@/api/newRequest";
export const getOpenId = (data,fn) => {
  httpGet({
    url: '/user/wechat/auth',
    data:data
  },res => fn(res))
}
export const getUserInfo = (data,fn) => {
  httpGet({
    url: '/user/wechat/getEncryptedData',
    data:data
  },res => fn(res))
}
export const bindTelephone = (data,fn) => {
  httpGet({
    url: '/user/wechat/bindMobileByWechatXcx',
    data:data
  },res => fn(res))
}
