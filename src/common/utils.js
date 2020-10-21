/*
* toast 提示
* filterHttpStatus 请求返回错误信息
* goBack 返回上一页
* imgList 过滤string轮播图
* backgroundObj 头像样式
* navigateTo 跳转
* redirectTo 重定向
* setPeople 计算人数
* saveFollow 关注
* deleteFollow 取消关注
*
* */
import Taro from '@tarojs/taro'
import {user} from '@/api/api'
import {httpPost} from '@/api/newRequest'
export const navigateTo =  (url) => {
  Taro.navigateTo({
    url: url
  })
  //跳转
}
export const redirectTo =  (url) => {
  Taro.redirectTo({
    url: url
  })
  //重定向
}
export const toast = (value) =>{
  return Taro.showToast({
    title: value,
    icon: 'none',
    duration: 800
  })
}
export const filterStrList =  (str) => {
  if(!str ||str.length =='0'){
    return []
  }
  return  str.split(',')
}
export const filterHttpStatus = (value) =>{
  if(value.includes('timeout')){
    return '响应超时'
  }
  else if(value.includes('domain list')){
    return '未配置合法域名'
  }
  else {
    return value
  }
}
export const goBack = function(fn){
  Taro.navigateBack({
    success:() => {
      if(fn){
        this.Toast(fn)
      }
    }
  })
}
export const imgList = function (listStr,url,key) {
    if(listStr&&listStr.length > 0 && JSON.parse(listStr)){
      return JSON.parse(listStr).map(item =>{
        item[key] = url+item[key]
        return item
      })
    }
    return  []
}
export const computedHeight = function (width,height,newWidth) {
    let scale = 0
  if(typeof width =="number"&&typeof height == "number"){
    scale = width/height
  }
    scale = parseInt(width)/parseInt(height)
    return parseInt(newWidth/scale)
}
export const backgroundObj = function (url) {
  return {
    background:`url(${url}) no-repeat center/cover`
  }
}
export const backgroundover = function (url) {
  return {
    background:`url(${url}) no-repeat`,
    backgroundSize:'100% 100%'
  }
}
export const filterTime = function (time) {
     if(time<10){
       return  `00:0${time}`
     }
     else if(time>=10 &&(time/60)<1){
       return `00:${time}`
     }
     else {
       let times = time%60
       if((time-times*60)<10){
         return `0+${times}:0${time-times*60}`
       }
       else if((time-times*60)>=10){
         return `0+${times}:${time-times*60}`
       }

     }
}
export const setPeople = function (num) {
  if(typeof num  =="string"){
    if(num.length>4){
      return (parseInt(num)/10000).toString().slice(0,3)+'万'
    }
    return num
  }
  else {
    if(num>=10000){
      return (num/10000).toString().slice(0,3)+'万'
    }
    return num
  }
}
export const saveFollow = function (obj,fn) {
   const {userDetails:{saveUserFollow}} = user
   httpPost({
     data:obj,
     url:saveUserFollow,
   },res =>{
      fn();
   })
}
export const deleteFollow = function (obj,fn) {
  const {userDetails:{deleteUserFollow}} = user
  httpPost({
    data:obj,
    url:deleteUserFollow,
  },res =>{
    fn();
  })
}
export const saveCollection = function (obj,fn) {
  const {userDetails:{saveCollection}} = user
  httpPost({
    data:obj,
    url: saveCollection
  },res =>{
    fn();
  })
}
export const deleteCollection = function (obj,fn) {
  const {userDetails:{deleteCollection}} = user
  httpPost({
    data:obj,
    url: deleteCollection,
  },res =>{
    fn();
  })
}
export const saveFall = function (obj,fn) {
  const {userDetails:{updateKol}} = user
  httpPost({
    data:obj,
    url: updateKol
  },res =>{
    fn();
  })
}
export const deleteFall = function (obj,fn) {
  const {userDetails:{deleteKolMoments}} = user
  httpPost({
    data:obj,
    url: deleteKolMoments,
  },res =>{
    fn();
  })
}
export const setIntive = function(time , fn) {
  let times;
  if(time <= 0){
    fn(time)
    return
  }
  return  times = setInterval(()=>{
    time --
    fn(time)
    if(time == 0){
      clearInterval(times)
    }
  },1000)

}
