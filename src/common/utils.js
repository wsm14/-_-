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
import Utils from "../utils/utils";
export const navigateTo =  (url) => {
  Taro.navigateTo({
    url: url
  })
  //跳转
}
//頁面跳轉
export const redirectTo =  (url) => {
  Taro.redirectTo({
    url: url
  })
  //重定向
}
//頁面重定向
export const NavHeight =  async () => {
  let menu = wx.getMenuButtonBoundingClientRect()
  let  res  =    await Taro.getSystemInfo()
  return res.statusBarHeight + menu.height + (menu.top - res.statusBarHeight) * 2
}
//設置自定義導航欄 高度
export const toast = (value) =>{
  return Taro.showToast({
    title: value,
    icon: 'none',
    duration: 2000
  })
}
//彈窗
export const filterStrList =  (str) => {
  if(!str ||str.length ==0){
    return []
  }
  return  str.split(',')
}
//字符串标签 轉數組
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
//http错误信息
export const goBack = function(fn){
  Taro.navigateBack({
    success:() => {
      if(fn){
        this.Toast(fn)
      }
    }
  })
}
//返回 上一页
export const imgList = function (listStr,url,key) {
    if(listStr&&listStr.length > 0 && JSON.parse(listStr)){
      return JSON.parse(listStr).map(item =>{
        item[key] = url+item[key]
        return item
      })
    }
    return  []
}
//字符串图片 转 数组
export const computedHeight = function (width,height,newWidth) {
    let scale = 0
  if(typeof width =="number"&&typeof height == "number"){
    scale = width/height
  }
    scale = parseInt(width)/parseInt(height)
    return parseInt(newWidth/scale)
}
//计算图片高度
export const backgroundObj = function (url) {
  return {
    background:`url(${url}) no-repeat center/cover`
  }
}
//设置背景图片
export const backgroundover = function (url) {
  return {
    background:`url(${url}) no-repeat`,
    backgroundSize:'100% 100%'
  }
}
//设置自适应背景图片
export const filterTime = function (time) {
     if(time == 0){
       return '00:00'
     }
     if(time<10){
       return  `00:0${time}`
     }
     else if(time>=10 &&(time/60)<1){
       return `00:${time}`
     }
     else {
       let times = time%60
       if((time-times*60)<10){
         return `0${times}:0${time-times*60}`
       }
       else if((time-times*60)>=10){
         return `0${times}:${time-times*60}`
       }

     }
}
//过率时间
export const setPeople = function (num) {
  if(typeof num  =="string"){
    if(num.length>4){
      return (parseInt(num)/10000).toString().split('.')[0]+'万'
    }
    return num
  }
  else {
    if(num>=10000){
      return (num/10000).toString().split('.')[0]+'万'
    }
    return num
  }
}
//设置人数
export const saveFollow = function (obj,fn) {
   const {userDetails:{saveUserFollow}} = user
   httpPost({
     data:obj,
     url:saveUserFollow,
   },res =>{
      fn();
   })
}
//添加 关注
export const deleteFollow = function (obj,fn) {
  const {userDetails:{deleteUserFollow}} = user
  httpPost({
    data:obj,
    url:deleteUserFollow,
  },res =>{
    fn();
  })
}
//删除关注
export const saveCollection = function (obj,fn) {
  const {userDetails:{saveCollection}} = user
  httpPost({
    data:obj,
    url: saveCollection
  },res =>{
    fn();
  })
}
//添加收藏
export const deleteCollection = function (obj,fn) {
  const {userDetails:{deleteCollection}} = user
  httpPost({
    data:obj,
    url: deleteCollection,
  },res =>{
    fn();
  })
}
//删除 收藏
export const saveFall = function (obj,fn) {
  const {userDetails:{updateKol}} = user
  httpPost({
    data:obj,
    url: updateKol
  },res =>{
    fn();
  })
}
//添加点赞
export const deleteFall = function (obj,fn) {
  const {userDetails:{deleteKolMoments}} = user
  httpPost({
    data:obj,
    url: deleteKolMoments,
  },res =>{
    fn();
  })
}
//删除 点赞
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
//定时器
function Rad(d){
  return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
}
export const GetDistance = function (lat1,lng1,lat2,lng2) {
  let radLat1 = Rad(lat1)||Rad(30.264561);
  let radLat2 = Rad(lat2);
  let radLng1 = Rad(lng1)||Rad(120.170189)
  let radLng2 = Rad(lng2)
  let a = radLat1 - radLat2;
  let b = radLng1 - radLng2 ;
  let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000; //输出为公里
  s=s.toFixed(2);
  return filterLimit(s);
}
////地理位置
export const filterLogin = function (data) {
   switch (data) {
     case '1': return '授权手机号'; break
     case '2': return '授权用户信息';break
   }
}
//设置权限 文字
export const onShareFriend =  (options)  => {
  // 设置转发内容 -- 适用于: 页面右上角 ... 和 页面按钮
  let shareObj = {
    title: `${options.title}`,
    imageUrl: `${options.img}`,
    success: function(res) {
      // 转发成功之后的回调
      if (res.errMsg == 'shareAppMessage:ok') {
        Utils.Toast('转发成功')
      }
    },
    fail: function(res) {
      // 转发失败之后的回调
      if (res.errMsg == 'shareAppMessage:fail cancel') {
        // 用户取消转发
        Utils.Toast('取消转发')
      } else if (res.errMsg == 'shareAppMessage:fail') {
        // 转发失败，其中 detail message 为详细失败信息
        Utils.Toast('转发失败')
      }
    },
    complete: function() {
      // 转发结束之后的回调（转发成不成功都会执行）
      console.log('---转发完成---');
    }
  };
  return shareObj;
}
//设置分享微信
export const onTimeline = (option) => {
  return {
    title: `${option.title}`,
    imageUrl: `${option.img}`,
  }
}
//设置分享朋友圈
export const  setLocation = (fn) => {
  Taro.getLocation({
    type: 'wgs84',
    success: (res) =>  {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy;
      fn && fn(res)
    },
    fail: function(res) {
      console.log('fail' + JSON.stringify(res))
    }
  })
}
export const  filterLimit  = number => {
  if(number<1){
    return (number*1000)+'m'
  }
  else return number+'km'
}
export const  upLoadFile =  (arr)  => {
   let list = arr.map(item => {
      return new Promise(resolve => {
        Taro.getImageInfo({
          src: item,
          success: result => {
            resolve(result)
          }
        })
      })
    })
   return  Promise.all(list)
}

export const  addPhotosAlbum = (path) => {
  Taro.showLoading({
    title: '正在保存',
    mask: true,
  })
  Taro.saveImageToPhotosAlbum({
    filePath: path,//canvasToTempFilePath返回的tempFilePath
    success: (res) => {
      Taro.hideLoading()
      toast('成功保存相册')
    },
    fail: (err) => {
      Taro.hideLoading()
      toast('保存失败')
    },
    complete: ()=>{

    }
  })
}
export const  goDown  =  () => {
  navigateTo('/pages/share/download/index')
}
export const filterSetting =  (str) =>{
    if(str.includes('km') && parseInt(str)>5){
      return `驾车约${parseInt(str)}分钟`
    }
    else if(str.includes('km') && parseInt(str)>=1 &&  parseInt(str)<=5){
      return `骑车约${parseInt(str)*4}分钟`
    }
    else {
      return `骑车约${parseInt(str)/100}分钟`
    }
}
