import { httpGet, httpPost } from "@/utils/request";
export const fetchAllAvailableCoupon = (data, fn) => {
  return httpGet(
    {
      url: "/user/userCoupon/listAllAvailableCoupon",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取所有可用平台券 和免费券
export const fetchOwnerCouponDetail = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/merchantMainCoupon/getOwnerCouponDetail",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取商家有价券详情
export const acquireCoupon = (data, fn) => {
  return httpPost(
    {
      url: "/user/userCoupon/acquireCoupon",
      data: data,
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//扫码支付领券

export const fetchOrderLinkCoupon = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/link/coupon/getOrderLinkCoupon",
      data: data,
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//查询订单链路券
export const getNewAvailableCoupon = (data, fn) => {
  httpGet(
    {
      url: "/user/userCoupon/listNewAvailableCouponByChannel",
      data: data,
    },
    (res) => fn(res)
  );
};
//查看多渠道可用券列表(打卡/消费/看视频)
