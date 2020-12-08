import {httpGet,httpPost} from "@/api/newRequest";
export const getReserveOrder = (data,fn) => {
  httpGet({
    url: '/user/order/getReserveOrderByMerchantId',
    data:data
  },res => fn(res))
}
//扫商家二维码获取支付信息

export const saveScanCodeOrder = (data,fn) => {
  httpPost({
    url: '/user/order/saveScanCodeOrder',
    data:data
  },res => fn(res))
}
//创建扫码订单

export const getOrderPrepaymentResult = (data,fn) => {
  httpGet({
    url: '/user/order/getOrderPrepaymentResult',
    data:data
  },res => fn(res))
}
//获取支付信息


export const payOrder = (data,fn) => {
  httpPost({
    url: '/user/pay/adapay/payOrder',
    data:data
  },res => fn(res))

}
//扫码支付
export const payDelayOrder = (data,fn) => {
  httpPost({
    url: '/user/pay/adapay/payDelayOrder',
    data:data
  },res => fn(res))
}
//订单支付

//猜你喜欢
export const getOrderResult = (data,fn) => {
  httpGet({
    url: '/user/order/getOrderResult',
    data:data
  },res => fn(res))
}
//获取订单支付结果（支付成功）
