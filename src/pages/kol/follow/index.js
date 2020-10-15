import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Button,Image, Text,Swiper, SwiperItem} from '@tarojs/components'
import Nav from '@/components/nav'
import './index.scss'
function CreateView(props) {
  const {list} = props
   return (
      <View className='follow_userTags'>
       {list.map((item,index) =>{
        return (
          <View key={index} className='follow_tab' style={index!=list.length-1&&{borderBottom:'1px solid #E5E5E5'}}>
            <View className='follow_userProFile'></View>
            <View className='follow_userDetails'>
              <View className='follow_userName'>
                <View>吴千语</View>
                {item.status!=0 && <View className='follow_tag'>
                  <View className='follow_icon'></View>
                  <View className='follow_tagFont'>哒人</View>
                </View>}
              </View>
              <View className='follow_userDescribe'>打卡，让平淡的日子也可以有滋…打卡，让平淡的日子也可以有滋…</View>
            </View>
            {item.interest ==0?
              <View className='follow_userInterest_box follow_userInterest_true'>关注</View>
              :
              <View className='follow_userInterest_box follow_userInterest_false'>互相关注</View>
            }

          </View>
        )
       })}
     </View>

   )
}
class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      list: [{status:'0',interest:'0'},{status: '1',interest: '1'}]
    }
  }
  componentWillMount () { }
  componentDidMount () { }
  componentWillUnmount () { }
  componentDidHide () { }
  componentDidShow() {
  }
  errorToast(e) {
    this.setState({
      Toast: {
        status: 'error',
        text: e,
        isOpened: true
      }
    })
  }
  render () {
    const {list} = this.state
    return (
      <View className='follow_box'>
        <CreateView list={list}></CreateView>
        <View className='follow_over'>
          暂无更多
        </View>
      </View>
    )
  }
}

export default Index
