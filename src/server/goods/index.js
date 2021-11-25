import { httpGet, httpPost } from "@/api/newRequest";
import { filterGoods } from "@/common/utils";

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
  httpPost(
    {
      url: "/user/order/saveScanCodeOrder",
      data: data,
    },
    (res) => fn(res)
  );
};
//创建扫码订单

export const getOrderPrepaymentResult = (data, fn) => {
  httpGet(
    {
      url: "/user/order/getOrderPrepaymentResult",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取支付信息

export const payOrder = (data, fn) => {
  httpPost(
    {
      url: "/user/pay/adapay/payOrder",
      data: data,
    },
    (res) => fn(res)
  );
};
//扫码支付
export const payDelayOrder = (data, fn) => {
  httpPost(
    {
      url: "/user/pay/adapay/payDelayOrder",
      data: data,
    },
    (res) => fn(res)
  );
};
//订单支付

//猜你喜欢
export const getOrderResult = (data, fn) => {
  httpGet(
    {
      url: "/user/order/getOrderResult",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取订单支付结果（支付成功）

export const getOrderDetails = (data, fn) => {
  httpGet(
    {
      url: "/user/order/getOrderDetail",
      data: data,
    },
    (res) => {
      const { orderInfo } = res;
      let data = filterGoods(orderInfo);
      fn && fn(data);
    }
  );
};
//获取订单详情
export const deleteOrder = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/deleteOrder",
      data: data,
    },
    (res) => fn(res)
  );
};
//删除订单

export const getScanAvailableCoupon = (data, fn) => {
  httpGet(
    {
      url: "/user/userCoupon/listScanAvailableCoupon",
      data: data,
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//扫码支付可用优惠券列表

export const getOwnerCouponInfo = (data, fn) => {
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
export const saveCouponOrder = (data, fn) => {
  httpPost(
    {
      url: "/user/order/saveCouponOrder",
      data: data,
    },
    (res) => fn(res)
  );
};
//购买有价券订单

export const getNuwUserFirstOrderInfo = (data, fn) => {
  return httpGet(
    {
      url: "/user/config/newcomer/order/getNewUserFirstOrderInfo",
      data: data,
    },
    (res) => fn(res)
  );
};
//下单成功三单福利

export const getConfigNewcomerOrders = (data, fn) => {
  httpGet(
    {
      url: "/user/config/newcomer/order/getConfigNewcomerOrders",
      data: data,
    },
    (res) => fn(res)
  );
};
//下单成功三单福利

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

export const fakeUpdateOrder = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/updateOrderStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//修改订单 状态
