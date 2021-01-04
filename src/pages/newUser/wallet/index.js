import React, {Component, useState} from 'react'
import {View, Text} from '@tarojs/components'
import './index.scss'
import {toast, backgroundObj} from '@/common/utils'
import {getUserBeanInfo} from '@/server/user'
import {navigateTo} from "../../../common/utils";
import Toast from '@/components/dakale_toast'

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userInfo: {},
      visible: false
    }
  }

  componentDidShow() {
    this.getUserInfo()
  }

  getUserInfo() {
    getUserBeanInfo({}, res => {
      const {userInfo} = res
      this.setState({
        userInfo
      })
    })
  }

  tishiDom() {
    return (
      <View className='point_box'>
        <View className='point_title'>奖励卡豆</View>
        <View className='point_center'>通过平台内的看分享、到店打卡、家人家店贡献，参加卡豆乐园项目以及平台补贴的卡豆为奖励卡豆，奖励卡豆不可提现。</View>
        <View className='point_title'>收益卡豆</View>
        <View className='point_center'>升级为哒人，通过带货获得的卡豆为收益卡豆，收益卡豆可提现。</View>
      </View>
    )
  }

  errorToast(e) {
  }

  render() {
    const {userInfo: {bean, rewardBean, bankName, incomeBean, level, bankBindStatus, bankIcon, bankBackgroundImg, bankHideNumber}, visible} = this.state
    return (
      <View className='page_wallet'>
        {(level && level !=='0')&&
        <View className='page_userLever'>
          <View className='page_userDetails'>
            <View className='page_userDetails_icon'></View>
            <View className='page_userDetails_title font28 color1'>卡豆余额</View>
            <View className='page_userDetails_bean color1 bold'>{parseInt(bean||0)+parseInt(incomeBean||0)}</View>
          </View>
          <View className='page_userLever_details'></View>
          <View className='page_userLever_beanBox'>
            <View className='page_userLever_beanDec'>
              <View onClick={() => navigateTo('/pages/newUser/rewardDetails/index')}
                    className='page_userLever_money page_userLever_moneyPad1'>
                <View className='page_userLever_moneyBox  page_userLever_moneyPad1'>
                  奖励卡豆
                  <View className='page_userLever_question' onClick={(e) => {
                    e.stopPropagation();
                    this.setState({visible: true})
                  }}></View>
                </View>
                <View className='page_userLever_fonts color1 font40 bold'>{bean || 0}</View>
                <View className='page_userLever_linkGo page_userLever_linkGoIcon'
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateTo('/pages/newUser/rewardDetails/index');
                      }}>

                </View>
              </View>
              <View className='page_userLever_liner'></View>
              <View className='page_userLever_money'>
                <View className='page_userLever_moneyBox  page_userLever_moneyPad2' onClick={(e) => {
                  navigateTo('/pages/newUser/incomeDetails/index')
                }}
                >
                  收益卡豆
                  <View className='page_userLever_question' onClick={(e) => {
                    e.stopPropagation();
                    this.setState({visible: true})
                  }}></View>
                </View>
                <View className='page_userLever_fonts color1 font40 bold'>{incomeBean || 0}</View>
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
            {bankBindStatus !== '1' && <View className='page_userLever_bindCard color1 bold'>
              去绑定银行卡 <View className='page_userLever_cardGo'></View>
            </View>}
            {bankBindStatus === '1' && <View className='page_userLever_bankCarkBox'>
              <View className='page_userLever_bankCark'
                    style={bankBackgroundImg ? backgroundObj(bankBackgroundImg) : {}}>
                <View className='page_userLever_icon dakale_nullImage'
                      style={bankIcon ? backgroundObj(bankIcon) : {}}></View>
                <View className='page_userLever_name font24 color6 bold'>{bankName}</View>
                <View className='page_userLever_bankId font24 color6'>{bankHideNumber}</View>
              </View>
            </View>}
          </View>
        </View>
        }
        {(level === '0' || !level) &&
        <View className='page_noUserLever'>
          <View className='page_userDetails'>
            <View className='page_userDetails_icon'></View>
            <View className='page_userDetails_title font28 color1'>卡豆余额</View>
            <View className='page_userDetails_bean color1 bold'>{bean}</View>
          </View>
          <View className='page_link_go public_center'
            onClick={() => navigateTo('/pages/newUser/rewardDetails/index')}
          >
            <View className='font24 color4'> 查看明细</View>
            <View className='page_link_icon'>

            </View>
          </View>
        </View>
        }

        <View className='page_bottom_font color2 font24'>
          哒卡乐支付安全保障中
        </View>
        {visible &&
        <Toast title={'卡豆规则'} Components={this.tishiDom.bind(this)}
               close={() => this.setState({visible: false})}></Toast>
        }
      </View>
    )
  }
}

export default Index
