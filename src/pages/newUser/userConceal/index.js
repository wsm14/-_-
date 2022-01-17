import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text,PickerView,WebView} from '@tarojs/components'
class Record extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '用户协议',
  }
  constructor() {
    super(...arguments);
  }


  render () {

    return (
      <View className='record_box'>
        <WebView src='https://web.dakale.net/product/userConceal.html'/>
      </View>
    )
  }
}

export default Record
