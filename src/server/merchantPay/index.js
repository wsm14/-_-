import {httpGet,httpPost} from "@/api/newRequest";

export const getOrderPrepaymentResult = (data, fn) => {
  httpGet({
    url: '/merchant/order/getOrderPrepaymentResult',
    data: data,
    header: {
      'apptype': 'merchant',
    }
  }, res => fn(res))
}
//获取支付信息

export const payOrder = (data, fn) => {
  httpPost({
    url: '/merchant/pay/adapay/payOrder',
    data: data,
    header: {
      'apptype': 'merchant',
    }
  }, res => fn(res))

}
//扫码支付
