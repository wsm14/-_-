/*
* resultOperate  不同返回码进行不同的函数映射
* httpCondition 微信http请求配置
* baseUrl 接口环境配置
* httpGet get请求 url-请求路径 data-请求数据 fn-请求成功的执行函数
* httpPost post请求 url-请求路径 data-请求数据 fn-请求成功的执行函数
* encrypt 对数据进行加密处理
*/
import Taro from '@tarojs/taro'

import encrypt from './keys'

import {toast,filterHttpStatus,navigateTo,redirectTo} from '@/common/utils'

const resultOperate = {
  "2001" : {type: '用户身份不存在',link:'/pages/auth/index',},
  "5005" : {type: '用户身份不存在',link:'/pages/auth/index',fn:() =>  Taro.clearStorageSync()},
}

let baseUrl = '';

const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'

switch (env) {
  case 'development':
    baseUrl = 'https://devgateway.dakale.net'
    break
  case 'production':
    baseUrl = 'https://devgateway.dakale.net'
    // baseUrl = 'https://gateway1.dakale.net'
    break
}

const httpCondition = {
  header: {
    'apptype':'user',
    'content-type': 'application/x-www-form-urlencoded',
    'lnt': Taro.getStorageSync('lnt'),
    'lat': Taro.getStorageSync('lat'),
  },
  timeout: 3000,
  dataType: 'json'
}

export const httpGet = (obj,fn) =>{
  Taro.showLoading({
    title: '加载中',
  })
  if(Taro.getStorageSync('userInfo') && Taro.getStorageSync('userInfo').mobile.length===11 && Taro.getStorageSync('userInfo').token){
    obj.data.token = Taro.getStorageSync('userInfo').token
  }
   Taro.request({
     ...httpCondition,
     url: baseUrl+obj.url,
     data: encrypt(obj.data)||{},
     method: 'get',
     success: (res)=>{
       const {data,statusCode} = res
       if(statusCode === 200 && res.data.success){
         const {content} = data
         fn && fn(content)
       }
       else {
         if(statusCode !== 200){
           toast("服务路径不存在")
         }
         else if(!data.success){
           const {resultDesc,resultCode} = data
           if(resultOperate[resultCode]){
             toast(resultDesc);
             resultOperate[resultCode].fn();
             return navigateTo(resultOperate[resultCode].link)
           }
           return  toast(resultDesc);
         }
       }
     },
     fail:(res) =>{
       const {errMsg} = res
       toast(filterHttpStatus(errMsg))
     },
     complete:() =>{
       Taro.hideLoading()
     }
   })
}

export const httpPost = (obj,fn) =>{
  if(Taro.getStorageSync('userInfo') && Taro.getStorageSync('userInfo').mobile.length===11 && Taro.getStorageSync('userInfo').token){
    obj.data.token = Taro.getStorageSync('userInfo').token
  }
    Taro.request({
      ...httpCondition,
      header:{
        ...httpCondition.header,
        'content-type': 'application/json',
      },
      url: baseUrl+obj.url,
      data: encrypt(obj.data)||{},
      method: 'post',
      success: (res)=>{
        const {data,statusCode} = res
        if(statusCode === 200 && res.data.success){
          fn && fn(res)
        }
        else {
          if(statusCode !== 200){
            toast("服务路径不存在")
          }
          else if(!data.success){
            const {resultDesc,resultCode} = data
            if(resultOperate[resultCode]){
              toast(resultDesc);
              resultOperate[resultCode].fn();
              return navigateTo(resultOperate[resultCode].link)

            }
            return  toast(resultDesc);
          }
        }
      },
      fail:(res) =>{
        const {errMsg} = res
        toast(filterHttpStatus(errMsg))
      },
      complete:() =>{
      }
    })
}
