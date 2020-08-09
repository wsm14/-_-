import Taro from '@tarojs/taro'
import ajax from './../api/request'
import {wxapiGet} from './../api/api'
function utils() {
  this.utils = Taro
  this.openId = '';//身份授权id
  this.unionId = ''//身份id
  this.type = 0  //授权状态  1 手机未授权  2 新注册用户
}
utils.prototype.navigateTo = function (url) {
    this.utils.navigateTo({
      url: url
    })
 //跳转
}
utils.prototype.redirectTo = function (url) {
  this.utils.redirectTo({
    url: url
  })
  //重定向
}
utils.prototype.getCode = function(){
 return  new Promise(resolve => {
    Taro.login({
      success:result => {
        const {errMsg, code} = result
          return resolve(result)
        },
      fail:(res) => {
        this.Toast(res.errMsg)
      }
    })
  })
}
//获取wx.login的授权
utils.prototype.authGetUserInfo =function (e,callback) {
    const {detail :{errMsg} } = e
//获取微信用户信息
    if(errMsg ==='getUserInfo:ok'){
//如果用户点击了确定
       const {encryptedData,iv,rawData,userInfo:{nickName,gender,avatarUrl}} = e.detail
//则把信息取出
          let openId = this.openId;
//初始化的openId
          let unionId = this.unionId
//初始化的unionId
         ajax({
             url:wxapiGet.wechatBindData,
             data:{avatarUrl,gender,nickName,encryptedData,iv,openId ,unionId}},
           'get')
              .then(res1 => {
                 callback(res1)
              })
//请求以及回调
    }
    else{
      this.Toast('授权用户信息失败')
    }
}
utils.prototype.bindTelephone =function (e,callback) {
  const {detail :{errMsg} } = e
  if(errMsg ==='getPhoneNumber:ok'){
  //如果用户点击同意授权
    const {encryptedData,iv} = e.detail
 //获取手机号加密数据
     if(this.openId && this.openId.length >10 ){
//如果ipenid存在
       let openId = this.openId
//配置openid
       let unionId = (this.unionId.length>0 &&this.unionId) ||Taro.getStorageSync('userInfo').unionId
       ajax({url:wxapiGet.wechatBindMobile,data:{openId ,unionId , encryptedData, iv}},'get')
         .then(resUser =>{
           callback(resUser)
         })
//请求回调
     }
     else {
       //如果ipenid不存在
       this.getCode()
         .then(result => {
           const {errMsg , code} = result
           if(errMsg === 'login:ok' && typeof result === 'object'){
             ajax({url:wxapiGet.wechatAuth,data:{code:code}},'get')
               .then(res=>{
                 const { data: {success}} = res
                 if(success){
                   const { data: {content:{openId}}} = res
                   this.openId = openId
                   ajax({url:wxapiGet.wechatBindMobile,data:{openId , encryptedData, iv}},'get')
                     .then(resUser =>{
                         callback(resUser)
                     })
                 }
                 else{

                 }
               }).catch(e=>{
               console.log(e)
             })
           }
         })
         .catch(e=>{
           console.log(e)
         })
     }
  }
  else{
    this.Toast('授权手机号码失败')
  }
}
utils.prototype.initialize = function (fn){
    this.getCode()
      .then(res => {
        const {errMsg, code} = res
        if (errMsg === 'login:ok') {
           ajax({url:wxapiGet.wechatAuth,data:{code:code}},'get')
             .then(
               result =>{
                 const { errMsg } = result
                 if(errMsg && errMsg != 'request:ok'){
                   this.Toast('服务器错误')
                 }
                 else{
                   const { data: {success,resultDesc}} = result
                   if(success){
                     const { data: {content:{userInfo,unionId,openId}}} = result
                     this.openId = openId
                     this.unionId = unionId
                     if(userInfo && userInfo.mobile.length >=11){
                       Taro.setStorageSync('userInfo',userInfo)
                       this.type = 0
                       fn(this.type)
                       return ;
                     }
                     else if(userInfo && userInfo.mobile.length == 0){
                       this.type = 1
                       Taro.setStorageSync('userInfo',userInfo)
                       fn(this.type)
                       return;
                     }
                     else if(!userInfo){
                       this.type = 2
                       fn(this.type)
                       return;
                     }
                     return
                   }
                   else {
                     this.Toast(resultDesc)
                   }
                 }
               })}
        })
}
utils.prototype.goBack = function(fn){
  Taro.navigateBack({
    success:() => {
      if(fn){
        this.Toast(fn)
      }
    }
  })
}
utils.prototype.Toast = function (e) {
  Taro.showToast({
    title: e.toString(),
    icon: 'none',
    duration: 2000
  })
}
utils.prototype.setInterVal = function (time , fn) {
   if(time<0){
     return
   }
   let times = setInterval(()=>{
       time --
       fn(time)
      if(time == 0){
        clearInterval(times)
      }
   },1000)
   return times
}
utils.prototype.setHttpCode = function (fn) {
  let that = this
   Taro.scanCode({
     scanType: 'qrCode',
     success: result => {
       fn(result)
     },
     fail: res => {
      Taro.onNetworkStatusChange(resWork => {
         const { isConnected } = resWork
         if(isConnected){
           const {errMsg} = res
           that.Toast(errMsg)
         }
         else {
           that.navigateTo('/pages/perimeter/beanMark/index?showType=3')
         }
      })
     }
   })
}
utils.prototype.goDown = function () {
 this.navigateTo('/pages/share/download/index')
}
export default new utils()
