import Taro, { Component } from '@tarojs/taro'
import { View,Text,PickerView,WebView} from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import Nav from '../../../layout/layoutNav/index'
class Record extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '卡豆权益',
  }
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
