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
