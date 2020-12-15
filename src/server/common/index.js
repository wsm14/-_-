import {httpGet,httpPost,httpOtherGet} from "@/api/newRequest";
import Taro from '@tarojs/taro'
/*
* params
*
* 用户奖励卡豆支出：root：userTrade，parent：expenses
* 用户奖励卡豆收入：root：userTrade，parent：earn
* 用户收益卡豆支出：root：userIncomeTrade，parent：expenses
* 用户收益卡豆收入：root：userIncomeTrade，parent：earn
* 现金 root：userCashTrade
* */
import {objStatus} from '@/common/utils'
export const getRootAndParent = (data,fn) => {
  httpGet({
    url: '/common/dictionary/listDictionaryByRootAndParent',
    data:data
  },res => {
    return  fn(res)
  })
}
//我的页面数据
export const getAddress = (data,fn) => {
  httpOtherGet({
    data:data,
    url:'https://apis.map.qq.com/ws/geocoder/v1/'
  },res => {
    return  fn(res)
  })
}
//获取城市定位信息
