import { httpGet, httpPost } from "@/api/newRequest";

export const getShareNewYearSpecialActivity = (data, fn) => {
  httpGet(
    {
      url: "/user/specialGoods/getShareNewYearSpecialActivity",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询用户分享的新年特价狂欢活动

export const getWechatKefuAccount = (data, fn) => {
  httpGet(
    {
      url: "/user/wechat/getWechatKefuAccount",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询公众号
