import { observable } from 'mobx'
import Taro from '@tarojs/taro'
const activeStatus = observable({
  activeStatusObj : {},
  setActiveStore(obj) {
    const {extraParam = {}} = obj
    this.activeStatusObj = JSON.parse(extraParam)||{}
  }
})
export default activeStatus
