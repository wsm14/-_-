import React, {Component, useState} from 'react'
import { View,Text} from '@tarojs/components'
import './index.scss'
import {toast} from '@/common/utils'
import {navigateTo} from "../../../common/utils";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {

    }
  }



  componentDidMount(){

  }
  errorToast(e) {
  }
  render () {
    const {

    } = this.state
    return (
      <View className='page_wallet'>
        <View className='page_userLever'>
          <View className='page_userDetails'>
            <View className='page_userDetails_icon'></View>
            <View className='page_userDetails_title font28 color1'>卡豆余额</View>
            <View className='page_userDetails_bean color1 bold'>10000</View>
          </View>
          <View className='page_userLever_details'></View>
          <View className='page_userLever_beanBox'>
            <View className='page_userLever_beanDec'>
              <View onClick={() => navigateTo('/pages/newUser/rewardDetails/index')} className='page_userLever_money page_userLever_moneyPad1'>
                <View className='page_userLever_moneyBox  page_userLever_moneyPad1'>
                 奖励卡豆
                  <View className='page_userLever_question'></View>
                </View>
                <View className='page_userLever_fonts color1 font40 bold'>5000</View>
                <View className='page_userLever_linkGo page_userLever_linkGoIcon'
                onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('/pages/newUser/rewardDetails/index');
               }}>

                </View>
              </View>
              <View className='page_userLever_liner'></View>
              <View className='page_userLever_money'>
                <View className='page_userLever_moneyBox  page_userLever_moneyPad2'>
                  收益卡豆
                  <View className='page_userLever_question'></View>
                </View>
                <View className='page_userLever_fonts color1 font40 bold'>5000</View>
                <View className='page_userLever_linkGo1 page_userLever_linkGoIcon'></View>
                <View className='page_userLever_btn font24 color6' onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('/pages/share/download/index');
                }}>提现</View>
              </View>
            </View>
          </View>
          <View className='page_userLever_card' onClick={() => navigateTo('/pages/share/download/index')}>
            <View className='page_userLever_cardTitle font24'>
              银行卡
            </View>
            <View className='page_userLever_bindCard color1 bold'>
              去绑定银行卡 <View className='page_userLever_cardGo'></View>
            </View>
          </View>
        </View>
        {/*<View className='page_noUserLever'>*/}
        {/*  <View className='page_userDetails'>*/}
        {/*    <View className='page_userDetails_icon'></View>*/}
        {/*    <View className='page_userDetails_title font28 color1'>卡豆余额</View>*/}
        {/*    <View className='page_userDetails_bean color1 bold'>10000</View>*/}
        {/*  </View>*/}
        {/*  <View className='page_link_go public_center'>*/}
        {/*    <View className='font24 color4'> 查看明细</View>*/}
        {/*    <View className='page_link_icon'>*/}

        {/*    </View>*/}
        {/*  </View>*/}
        {/*</View>*/}
        <View className='page_bottom_font color2 font24'>
          哒卡乐支付安全保障中
        </View>
      </View>
    )
  }
}

export default Index
