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

export const getCategory = (data,fn) => {
  httpGet({
    url: '/common/category/listCategory',
    data:data
  },res => {
    return fn && fn(res)
  })
}
//获取品类

export const getLimit = (data,fn) => {
  httpGet({
    data:data,
    url:'/common/property/getLastProperty'
  },res => {
    fn && fn(res)
  })
}
//获取距离

export const getBanner = (data,fn) => {
  httpGet({
    data:data,
    url:'/common/banner/listBanner'
  },res => {
    fn && fn(res)
  })
}
//获取轮播图


/*
*
*

parent：activity
child：hideStatus*/
export const getDictionary = (data,fn) => {
  httpGet({
    data:data,
    url:'/common/dictionary/getDictionaryByParentAndChild'
  },res => {
    fn && fn(res)
  })
}

//通过父节点和子节点获取字典
export const getListTopic = (data,fn) => {
  httpGet({
    data:data,
    url:'/common/topic/listTopicBySearchContent'
  },res => {
    fn && fn(res)
  })
}
/*
* page: 页数
* limit: 行数，
* keyword 话题名称
* */
//通过名字搜索话题


export const getTopicDetail = (data,fn) => {
  httpGet({
    data:data,
    url:'/common/topic/getTopicDetail'
  },res => {
    fn && fn(res)
  })
}
