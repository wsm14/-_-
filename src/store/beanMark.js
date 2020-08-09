import { observable } from 'mobx'
import Taro from '@tarojs/taro'
const markStore = observable({
  beanMarks: {},
  merchantId: {},
  code:'',
  setMarkInfo(obj) {
    this.beanMarks = obj
  },
  setCode(code) {
    this.code = code
  },
  setMerchantId(obj) {
    this.merchantId = obj
  },
  setInit(){
    this.beanMarks = {}
    this.merchantId = {}
    this.code = ''
  }
})
export default markStore
