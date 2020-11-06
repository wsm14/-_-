import Taro from '@tarojs/taro'
import {toast,setLocation,addPhotosAlbum} from '@/common/utils'
export const login = (obj) => {
  let authLogin = obj
  if (authLogin && Object.keys(authLogin).length > 5 && authLogin.mobile.length === 11) {
    return '0'
  } else if (authLogin && Object.keys(authLogin).length > 5 && authLogin.mobile.length !== 11) {
    return '1'
  } else {
    return '2'
  }
}
export const authGeography = (fn) => {
  Taro.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.userLocation']) {
        Taro.authorize({
          scope: 'scope.userLocation',
          success: res => {
          setLocation(fn)
          },
          fail: res =>{
            Taro.showModal({
              title: '是否要打开设置页面',
              content: '需要获取您的位置，请到小程序的设置中打开授权',
              success: function (res) {
                if (res.confirm) {
                 Taro.openSetting({
                   success: dataAu => {
                     if (dataAu.authSetting["scope.userLocation"] == true) {
                       toast('授权成功',)
                       //再次授权，调用wx.getLocation的API
                       setLocation(fn)
                     } else {
                       toast('授权失败')
                     }
                   }
                 })
                }
                else if(res.cancel){
                  toast('授权失败')
                }
              }
            })
          }
        })
      }
      else {
        setLocation(fn)
      }
    },
    fail:  res  =>{
      toast('授权接口调用失败，请检查网络')
    }
  })
}
export const authPhotosAlbum = (path) => {
  Taro.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum',
          success: res => {
            addPhotosAlbum(path)
          },
          fail: res =>{
            Taro.showModal({
              title: '是否要打开设置页面',
              content: '需要您设置保存照片权限',
              success: function (res) {
                if (res.confirm) {
                  Taro.openSetting({
                    success: dataAu => {
                      if (dataAu.authSetting["scope.writePhotosAlbum"] == true) {
                        toast('授权成功')
                        //再次授权，调用wx.getLocation的API
                      } else {
                        toast('授权失败')
                      }
                    }
                  })
                }
                else if(res.cancel){
                  toast('授权失败')
                }
              }
            })
          }
        })
      }
      else {
        console.log(1111)
        addPhotosAlbum(path)
      }
    },
    fail:  res  =>{
      toast('授权接口调用失败，请检查网络')
    }
  })
}
export const authWxLogin = (fn) => {
  Taro.login({
    success: function (res) {
      if (res.code) {
         fn  &&  fn(res.code)
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
}
export const internet = (obj,fn) => {
  Taro.onNetworkStatusChange(function (res){
    const {isConnected,networkType} = res
    if(isConnected == false && networkType =='none'){
      Taro.showToast({
        title: '网络错误',
        icon: 'none',
        duration: 2000
      })
    }
    else {
      if(Object.keys(obj).length<5){
        fn && fn();
      }
    }
  })
}
