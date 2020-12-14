import Taro from '@tarojs/taro'
import encrypt from './keys'//加密函数
const code = {
  "5005": "用户不存在"
}
const getHeader = {
  'apptype':'user',
  'content-type': 'application/x-www-form-urlencoded',
   'lnt': Taro.getStorageSync('lnt'),
   'lat': Taro.getStorageSync('lat')
}//get请求头设置
const PostHeader = {
  'apptype':'user',
  'content-type': 'application/json',
  'lnt': Taro.getStorageSync('lnt'),
  'lat': Taro.getStorageSync('lat'),
}
if(Taro.getStorageSync('lnt') && Taro.getStorageSync('lat')){
  getHeader.lnt = Taro.getStorageSync('lnt')
  getHeader.lat = Taro.getStorageSync('lat')
  PostHeader.lnt = Taro.getStorageSync('lnt')
  PostHeader.lat = Taro.getStorageSync('lat')
}
//post请求头设置
let baseUrl = '';
const env = process.env.NODE_ENV === 'development' ? 'development' : 'production'
switch (env) {
  case 'development':
    baseUrl = 'https://devgateway.dakale.net'
    break
  case 'production':
    baseUrl = 'https://gateway1.dakale.net'
    break
}
function request(obj,type) {
  Taro.showLoading({
    title: '加载中',
    fail : res =>{
    }
  })
  if(Taro.getStorageSync('userInfo') && Taro.getStorageSync('userInfo').mobile.length===11 && Taro.getStorageSync('userInfo').token){
    obj.data.token = Taro.getStorageSync('userInfo').token
  }
  return new Promise(resolve => {
      if(type === 'get'){
        Taro.request({
          url: `${baseUrl+obj.url}`, //仅为示例，并非真实的接口地址
          data:encrypt(obj.data),
          header: getHeader,
          timeout:30000,
          method:type,
          success: function (res) {
            if(!res.data.success || res.statusCode !==200){
              const {resultCode} = res.data
              if(code[resultCode]){
                Taro.clearStorageSync()
                Taro.navigateTo({
                  url: '/pages/auth/index'
                })
                return
              }
              else {
                Taro.showModal({
                  title:res.data.resultDesc ||`服務器錯誤${res.data.error}`
                })
              }
            }
            else {
              Taro.hideLoading({
                title: '加载成功'
              })
            }
            resolve(res)
          },
          fail :function (e) {
            Taro.showToast({
              title: e.errMsg,
              icon: 'none',
              duration: 2000
            })
            Taro.hideLoading({
              title:''
            })
            resolve(e)
          },
        })
      }
      else {
        Taro.request({
          url: `${baseUrl+obj.url}`, //仅为示例，并非真实的接口地址
          data:encrypt(obj.data),
          header: PostHeader,
          timeout:30000,
          method:type,
          success: function (res) {
            if(!res.data.success ||res.data.statusCode !==200){
              const {resultCode} = res.data
              if(code[resultCode]){
                Taro.clearStorageSync()
                Taro.navigateTo({
                  url: '/pages/auth/index'
                })
                return
              }
              else {
                Taro.hideLoading({
                  title:res.data.resultDesc ||`服務器錯誤${res.data.error}`
                })
              }
            }
            else {
              Taro.hideLoading({
                title: '加载成功'
              })
            }
            resolve(res)
          },
          fail: function (e) {
            Taro.showToast({
              title: e.errMsg,
              icon: 'none',
              duration: 2000
            })
            Taro.hideLoading({
              title:''
            })
            resolve(e)
          },
        })
      }
    }).catch(e=>{
    Taro.hideLoading({
      title:'异常错误'
    })
  })
}
//请求数据接口
export default request
