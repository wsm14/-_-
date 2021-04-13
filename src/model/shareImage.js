import { observable } from 'mobx'
import Taro from '@tarojs/taro'
const shareStore = observable({
  current: '0',
  data: {},
  setShareStore(e) {
    this.current = e
  },
  setShareData(obj){
    this.data = obj
  }
})
export default shareStore
