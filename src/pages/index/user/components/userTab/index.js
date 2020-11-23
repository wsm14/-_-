import React from "react";
import Taro from '@tarojs/taro'
import {View} from '@tarojs/components'
import './../../index.scss'
import {navigateTo} from '@/common/utils'
export default (props) => {
  const list = [{
     style: 'user_tab_icon1',
     font: '卡券'
    },
    {
      style: 'user_tab_icon2',
      font: '关注',
      fn:() =>navigateTo('/pages/newUser/userDetails/index?count=2')
    },
    {
      style: 'user_tab_icon3',
      font: '收藏',
      fn:() =>navigateTo('/pages/newUser/userDetails/index?count=1')
    },
    {
      style: 'user_tab_icon4',
      font: '打卡足迹',
      fn:() =>navigateTo('/pages/newUser/record/index')
    }
  ]
  const linkTo = (item) => {
    if(item.fn){
      item.fn()
    }
    else return
  }
  return (
    <View className='user_tab1'>
      <View className='user_tab_iconBox public_auto'>
        {list.map(item => {
          return (
            <View className='user_tabList' onClick={() =>linkTo(item)}>
              <View className={`user_tab_icons ${item.style}`}></View>
              <View className='user_tab_font'>
                {item.font}
              </View>
            </View>

          )
        })}
      </View>
    </View>
  )
}
