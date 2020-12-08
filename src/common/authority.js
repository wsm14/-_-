import Taro, {getCurrentInstance, getCurrentPages} from '@tarojs/taro'
import {toast, addPhotosAlbum} from '@/common/utils'
import qs from 'qs'

export const setLocation = (fn) => {
  Taro.getLocation({
    type: 'wgs84',
    success: (res) => {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy;
      Taro.setStorageSync('lnt', longitude)
      Taro.setStorageSync('lat', latitude)
      fn && fn(res)
    },
    fail: function (res) {
      console.log('fail' + JSON.stringify(res))
    }
  })
}
export const setMap = (fn) => {
  Taro.getLocation({
    type: 'gcj02',
    success: (res) => {
      var latitude = res.latitude
      var longitude = res.longitude
      var speed = res.speed
      var accuracy = res.accuracy;
      Taro.setStorageSync('lnt', longitude)
      Taro.setStorageSync('lat', latitude)
      fn && fn(res)
    },
    fail: function (res) {
      console.log('fail' + JSON.stringify(res))
    }
  })
}
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
export const authGeography = (fn, type) => {
  Taro.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.userLocation']) {
        Taro.authorize({
          scope: 'scope.userLocation',
          success: res => {
            if (type) {
              return setMap(fn)
            }
            setLocation(fn)
          },
          fail: res => {
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
                        if (type) {
                          return setMap(fn)
                        }
                        setLocation(fn)
                      } else {
                        toast('授权失败')
                      }
                    }
                  })
                } else if (res.cancel) {
                  toast('授权失败')
                }
              }
            })
          }
        })
      } else {
        if (type) {
          return setMap(fn)
        }
        setLocation(fn)
      }
    },
    fail: res => {
      toast('授权接口调用失败，请检查网络')
    }
  })
}

//获取定位
/*
*
* map
*
*
* */
export const authPhotosAlbum = (path) => {
  Taro.getSetting({
    success: (res) => {
      if (!res.authSetting['scope.writePhotosAlbum']) {
        Taro.authorize({
          scope: 'scope.writePhotosAlbum',
          success: res => {
            addPhotosAlbum(path)
          },
          fail: res => {
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
                } else if (res.cancel) {
                  toast('授权失败')
                }
              }
            })
          }
        })
      } else {
        addPhotosAlbum(path)
      }
    },
    fail: res => {
      toast('授权接口调用失败，请检查网络')
    }
  })
}
//保存相册
export const authWxLogin = (fn) => {
  Taro.login({
    success: function (res) {
      if (res.code) {
        fn && fn(res.code)
      } else {
        toast('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
}
//微信openId
export const internet = (obj, fn) => {
  Taro.onNetworkStatusChange(function (res) {
    const {isConnected, networkType} = res
    if (isConnected == false && networkType == 'none') {
      Taro.showToast({
        title: '网络错误',
        icon: 'none',
        duration: 2000
      })
    } else {
      if (Object.keys(obj).length < 5) {
        fn && fn();
      }
    }
  })
}
//网络环境
export const scanCode = (fn) => {
  Taro.scanCode({
    onlyFromCamera: false,
    success: results => {
      const {path, scanType, result} = results
      if (scanType === 'QR_CODE') {
        let data = qs.parse(result.split('?')[1])
        if (result.includes('https://www.dakale.net') && data.action === 'pay' && data.merchantId) {
          return fn && fn(data)
        } else if (result.includes('https://www.dakale.net') && data.action === 'mark' && data.merchantId) {
          return fn && fn(data)
        } else {
          return toast('二维码错误或参数缺失')
        }
      }
      return toast('扫码类型错误')
    },
    fail: res => {
      // toast('扫码')
    }
  })
}
