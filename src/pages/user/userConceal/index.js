import Taro, { Component } from '@tarojs/taro'
import { View,Text,PickerView,WebView} from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import Nav from '../../../layout/layoutNav/index'
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
