import React, { Component } from 'react'
import Taro,{getCurrentInstance} from '@tarojs/taro'
import { View,Text,PickerView,WebView} from '@tarojs/components'

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      link : getCurrentInstance().router.params.link,
      title : getCurrentInstance().router.params.title
    }
  }
  setTitle() {
    Taro.setNavigationBarTitle({
      title: this.state.title
    })
  }
  componentDidMount() {
    // this.setTitle()
  }
  render () {
    const {link} = this.state
    console.log(link)
    return (
      <View className='record_box'>
        <WebView src={`${link}?shareUserId=12312311&shareUserType=1231232`}/>
      </View>
    )
  }
}

export default Index
