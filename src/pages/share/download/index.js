import Taro, { Component } from '@tarojs/taro'
import { View,Text,WebView} from '@tarojs/components'
import './index.scss'
import Utils from './../../../utils/utils'
class Index extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '哒卡乐',
    navigationStyle:'default'
  }
  constructor() {
    super(...arguments);
  }
  getDownload(){
    var ua = navigator.userAgent.toLowerCase()
    if (ua.match(/MicroMessenger/i) == "micromessenger" && this.isIos()) {
           Utils.Toast('请点击右上角在浏览器下载')
           return
    }
    else{
       if(this.isAndroid()){
         // window.location.href='https://bundle.dakale.net/android/product/dakale-android-lastest.apk'
         window.location.href='https://bundle.dakale.net/android/dev/dakale-android-lastest.apk'
       }
       else if(this.isIos()){
         window.location.href='http://itunes.apple.com/cn/app/id1521276175?mt=8'
       }
    }
  }
  isAndroid() {
    var u = navigator.userAgent;
    if (u.indexOf("Android") > -1 || u.indexOf("Linux") > -1) {
         return true;
    }
    return false;
  }
  isIos() {
    var u = navigator.userAgent;
    if (u.indexOf("iPhone") > -1 || u.indexOf("iOS") > -1) {
      return true;
    }
    return false;
  }
  setClipboard() {
    Taro.setClipboardData({
      data: 'https://web.dakale.net/product/download.html',
      success: function (res) {
        Utils.Toast('复制成功请打开浏览器粘贴下载客户端')
      },
      fail: function (res) {
        Utils.Toast('复制失败')
      }
    })
  }
  render () {
    if(process.env.TARO_ENV === 'h5'){
      return (
        <View className='download_box'>
          <View className='download_Toast'>
            <View>
              <View className='download_tishi'><Text className='download_icon'>点击右上角</Text></View>
              <View className= 'download_xuanze'>选择在<Text className='download_open'>{'  '}Safari中打开</Text></View>
            </View>
          </View>
          <View className='download_btn' onClick={() => this.getDownload()}>
            <View className='download_btn_title'>下载「哒卡乐」客户端</View>
            <View className='download_btn_details'>新人享超值福利，卡豆捡不停</View>
          </View>
        </View>
      )
    }
    return  (
      <View className='download_box'>
        <View className='download_Toast'>
          <View>
            <View className='download_tishi'><Text className='download_icon'>点击右上角</Text></View>
            <View className= 'download_xuanze'>选择在<Text className='download_open'>{'  '}Safari中打开</Text></View>
          </View>
        </View>
        <View className='download_btn' onClick={() => this.setClipboard()}>
          <View className='download_btn_title'>下载「哒卡乐」客户端</View>
          <View className='download_btn_details'>新人享超值福利，卡豆捡不停</View>
        </View>
      </View>
    )
  }
}

export default Index
