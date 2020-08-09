import Taro, { Component } from '@tarojs/taro'
import { View,Text, Swiper, SwiperItem } from '@tarojs/components'

import './Navigation.scss'
class Navigation extends Component {
  constructor () {
    super(...arguments)
  }
  componentWillMount () {}


  componentDidMount () {
  }

  render () {
    return (
      <View className='Navigation_box f'>
        {process.env.TARO_ENV === 'weapp' ?'' : <View className='Navigation_back public_background' onClick={this.props.navData.fn?()=>this.props.navData.fn():console.error('you need write fn')}>
        </View>}
        <View className='Navigation_title'>
          {this.props.navData.title}
        </View>
      </View>
    )
  }
}

export default Navigation
