import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text,PickerView,WebView} from '@tarojs/components'
class Record extends Component {
  defaultProps = {}
  constructor() {
    super(...arguments);
  }
  render () {

    return (
      <View className='record_box'>
        <WebView src='https://web.dakale.net/product/eQuity.html'/>
      </View>
    )
  }
}

export default Record
