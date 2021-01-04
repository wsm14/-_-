import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View} from "@tarojs/components";
import './index.scss'
import {filterStrList} from "../../../common/utils";

class businessSell extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      ...getCurrentInstance().router.params
    }
  }

  componentDidMount() {

  }


  //获取商家信息


  //获取商家轮播图

  render() {
   const  {services ,businessTime = '',businessStatus = '0'} = this.state
    console.log(services)
    return (
      <View className='businessSell_box'>
        <View className='businessSell_title'>
          <View className='businessSell_title_box'>
            <View className='businessSell_title_icon1'>
            </View>
            <View className='businessSell_title_name  font28 color1'>
              营业时间
            </View>
          </View>
        </View>
        <View className='businessSell_liner'></View>
        <View className='businessSell_tagsBox'>
          <View className='businessSell_tagsType color1'>
            {businessStatus === '0' ? '休息中' : '营业中'}
          </View>
          <View className='businessSell_tagsData'>
            {businessTime}
          </View>
        </View>
        {(services!== 'undefined' && filterStrList(services||'').length > 0) &&
          <>
            <View className='businessSell_top businessSell_title'>
              <View className='businessSell_title_box'>
                <View className='businessSell_title_icon2'>
                </View>
                <View className='businessSell_title_name  font28 color1'>
                  设施及服务
                </View>
              </View>
            </View>
            <View className='businessSell_liner'></View>
            <View className='businessSell_tagsBox'>
              <View className='businessSell_tags'></View>
              {filterStrList(services).map(item => {
                return (
                  <View className='businessSell_tag_server'>
                    {item}
                  </View>
                )
              })}
            </View>
          </>
        }
      </View>
    )
  }
}

export default businessSell
