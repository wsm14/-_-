import { observable } from 'mobx'
import Taro from '@tarojs/taro'
const authStore = observable({
  userInfo:Taro.getStorageSync('userInfo')||{},
  setUserInfoStore(obj) {
    this.userInfo = obj
  }
})
export default authStore
