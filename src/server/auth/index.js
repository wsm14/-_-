import { httpGet, httpPost } from "@/utils/request";
export const getOpenId = (data, fn) => {
  return httpGet(
    {
      url: "/user/wechat/auth",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取用户openId
export const getUserInfo = (data, fn) => {
  httpPost(
    {
      url: "/user/wechat/loginByWechat",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取用户基本信息
export const bindTelephone = (data, fn) => {
  httpGet(
    {
      url: "/user/wechat/v2/bindMobileByWechatXcx",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取用户手机号码
