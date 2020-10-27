import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text,PickerView,WebView} from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import Nav from '../../../layout/layoutNav'
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
