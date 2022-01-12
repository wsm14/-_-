import Taro from "@tarojs/taro";
import { httpGet, httpPost } from "@/utils/request";
import { loginStatus } from "@/utils/utils";
export const fetchOrderTotalBean = (data, fn) => {
  return httpGet(
    {
      url: "/user/order/getUserOrderTotalBean",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取我的订单总节省卡豆
export const fetchOrderList = (data, fn) => {
  return httpGet(
    {
      url: "/user/order/listOrderOrderStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取我的订单总节省卡豆

export const fetchKolGoodsOrder = (data, fn) => {
  return httpGet(
    {
      url: "/user/specialGoods/getSpecialGoodsOrderPrice",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//特惠商品下单页

export const fakeGoodsOrder = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/saveSpecialGoodsOrder",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//特惠商品下单

export const fetchPrepaymentResult = (data, fn) => {
  return httpGet(
    {
      url: "/user/order/getOrderPrepaymentResult",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取订单下单前信息
export const fakeCommerceGoods = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/saveCommerceGoodsOrder",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//提交电商订单

export const fakeWechatPayInfo = (data, fn) => {
  return httpPost(
    {
      url: "/user/pay/wechat/getWechatPayInfo",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取微信支付需要的参数接口
//微信支付
export const handlePayWechat = (data = {}, callback) => {
  const { xcxOpenId } = loginStatus();
  return fakeWechatPayInfo({ ...data, openId: xcxOpenId }).then((val) => {
    const { payParams } = val;
    Taro.requestPayment({
      ...payParams,
      success: (res) => {
        callback && callback({ result_status: "succeeded" });
      },
      fail: () => {
        callback && callback({ result_status: "fail" });
      },
    });
  });
};
export const fetchOwnerCouponInfo = (data, fn) => {
  return httpGet(
    {
      url: "/user/merchantMainCoupon/getOwnerCouponOrderPrice",
      data: data,
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//确认购买券订单信息
export const fakeCouponOrder = (data, fn) => {
  httpPost(
    {
      url: "/user/order/saveCouponOrder",
      data: data,
    },
    (res) => fn(res)
  );
};
//购买有价券订单

export const getListFreeCoupon = (data, fn) => {
  return httpGet(
    {
      url: "/user/merchantMainCoupon/listFreeCoupon",
      data: data,
    },
    (res) => fn(res)
  );
};
//下单成功三单福利

export const fetchOrderResult = (data, fn) => {
  return httpGet(
    {
      url: "/user/order/getOrderResult",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//下单成功三单福利
export const getReserveOrder = (data, fn) => {
  httpGet(
    {
      url: "/user/order/getReserveOrderByMerchantId",
      data: data,
    },
    (res) => fn(res)
  );
};
//扫商家二维码获取支付信息

export const saveScanCodeOrder = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/saveScanCodeOrder",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//创建扫码订单

export const fakeUpdateOrder = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/updateOrderStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//修改订单状态
export const fakeRemoveOrder = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/deleteOrder",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//删除订单状态

export const fetchOrderDetails = (data) => {
  return httpGet({
    url: "/user/order/getOrderDetail",
    data: data,
  });
};
//获取订单详情
