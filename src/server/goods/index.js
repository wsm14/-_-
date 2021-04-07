import {httpGet, httpPost} from "@/api/newRequest";
import {filterGoods} from '@/common/utils'

export const getReserveOrder = (data, fn) => {
  httpGet({
    url: '/user/order/getReserveOrderByMerchantId',
    data: data
  }, res => fn(res))
}
//扫商家二维码获取支付信息

export const saveScanCodeOrder = (data, fn) => {
  httpPost({
    url: '/user/order/saveScanCodeOrder',
    data: data
  }, res => fn(res))
}
//创建扫码订单

export const getOrderPrepaymentResult = (data, fn) => {
  httpGet({
    url: '/user/order/getOrderPrepaymentResult',
    data: data
  }, res => fn(res))
}
//获取支付信息

export const payOrder = (data, fn) => {
  httpPost({
    url: '/user/pay/adapay/payOrder',
    data: data
  }, res => fn(res))

}
//扫码支付
export const payDelayOrder = (data, fn) => {
  httpPost({
    url: '/user/pay/adapay/payDelayOrder',
    data: data
  }, res => fn(res))
}
//订单支付

//猜你喜欢
export const getOrderResult = (data, fn) => {
  httpGet({
    url: '/user/order/getOrderResult',
    data: data
  }, res => fn(res))
}
//获取订单支付结果（支付成功）

export const getOrderDetails = (data, fn) => {
  httpGet({
    url: '/user/order/getOrderDetail',
    data: data
  }, res => {
    const {orderInfo} = res
    let data = filterGoods(orderInfo)
    fn && fn(data)
  })
}
//获取订单详情
export const deleteOrder = (data, fn) => {
  httpPost({
    url: '/user/order/deleteOrder',
    data: data
  }, res => fn(res))
}
//删除订单

export const getScanAvailableCoupon = (data, fn) => {
  httpGet({
    url: '/user/userCoupon/listScanAvailableCoupon',
    data: data
  }, res => {
    fn && fn(res)
  })
}
//扫码支付可用优惠券列表