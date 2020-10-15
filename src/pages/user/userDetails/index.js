import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import Nav from '@/components/nav'
import {} from '@/common/utils'
import classNames from 'classnames'
import './index.scss'
class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
        data: ['时尚达人','达人','达人','达人','达人','时尚达人'],
        status: false,
        current: 0,
        ViewTabs:['分享','收藏','关注的店','打卡足迹'],

    }
  }
  componentWillMount () { }
  componentDidMount () { }
  componentWillUnmount () { }
  componentDidHide () { }
  componentDidShow() {
  }
  currentTabs(index) {
    this.setState({current:index})
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
    const navSetting = {
      style:{
        background: 'rgba(255,255,255,0)',
      } ,
      type:'white'
    }
    const shopMerchant = (data) =>{
      return (
        <View className='userDetails_falls_details'>
          <View className='userDetails_falls_bg'>
            <View className='userDetails_make'>
              品牌
            </View>
          </View>
          <View className='userDetails_falls_desc'>
            <View className='userDetails_falls_title'>是店铺昵称啊</View>
            <View className='userDetails_falls_shopType'>萧山商圈·西餐</View>
            <View className='userDetails_falls_getBean'>到店打卡可捡100</View>
            <View className='userDetails_falls_coupon'>
              <View className='userDetails_coupon_mj userDetails_coupon_box'>满20元减5元</View>
              <View className='userDetails_coupon_dk userDetails_coupon_box'>5元抵扣券</View>
            </View>
            <View className='userDetails_falls_accress'>
              <View className='userDetails_falls_city'>
                <View className='userDetails_falls_cityIcon'></View>
                <View className='userDetails_falls_cityName'>
                  哈啊哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈
                </View>
              </View>
              <View className='userDetails_falls_limit'>距你100m</View>
            </View>
          </View>
        </View>
      )
    }
    const {data,status,ViewTabs,current,animate} = this.state
    return (
      <View className="userDetails_box">
        <View className="userDetails_top">
          <Nav {...navSetting}></Nav>
          <View  className='userDetails_user'>
            <View className='userDetails_profile'>

            </View>
            <View className='userDetails_decBox'>
              <View className='userDetails_follow_box'>
                <View className='userDetails_userName'>
                  用户昵称
                </View>
                <View className='user_follow_tag'>
                  <View className='follow_icon'></View>
                  <View className='follow_tagFont'>哒人</View>
                </View>
              </View>

              <View className='userDetails_userAccress'>
                杭州｜35岁
              </View>
              <View className='userDetails_sex_tags'>
                <View className='userDetails_sex_box'>
                  <View className='userDetails_sex_style userDetails_sex_tagStyle'>
                    <View className='userDetails_sex_boy'></View>
                  </View>
                  {data.map((item,index) =>{
                    if(status){
                      return (
                        <View className='userDetails_sex_style userDetails_tag_style' key={index}>
                          {item}
                        </View>
                      )
                    }
                    else {
                      if(index<3){
                        return (
                          <View className='userDetails_sex_style userDetails_tag_style' key={index}>
                            {item}
                          </View>
                        )
                      }
                    }
                  })}
                  {!status && <View className='userDetails_sex_style userDetails_showStyle' onClick={() =>{this.setState({status: true})}}>
                    <View className='userDetails_show'></View>
                  </View>}
                  {status&&<View className='userDetails_sex_style userDetails_hideStyle' onClick={() =>{this.setState({status: false})}}>
                    <View className='userDetails_hide'></View>
                  </View>}
                </View>
              </View>
            </View>
          </View>
          <View className='userDetails_decs'>
            我是一个个人介绍，生活始于心愿。我是一个个人介绍，生
            活始于心
          </View>
          <View className='userDetails_code'>
            <View className='userDetails_follow'>
              <View className='userDetails_num'>789</View>
              <View className='userDetails_title'>粉丝</View>
            </View>
            <View className='userDetails_fans'>
              <View className='userDetails_num'>2</View>
              <View className='userDetails_title'>关注</View>
            </View>
            <View className='userDetails_fans'>
              <View className='userDetails_num'>2</View>
              <View className='userDetails_title'>获赞与被收藏</View>
            </View>
            <View className='userDetails_editBtn'>
              编辑资料
            </View>
          </View>
        </View>
        <View className="userDetails_content">
          <View className='userDetails_tabs'>
            {ViewTabs.map((item,index) =>{
              return (
                <View className='userDetails_tabs_child' key={index} onClick={() =>this.currentTabs(index)}>
                  <View className = {classNames('userDetails_tabs_font', current==index&&'userDetails_tabs_check')}>{item}</View>
                  <View  className = {classNames('userDetails_tabs_line',  current!==index && 'userDetails_tabs_lineStyle')}></View>
                </View>
              )
            })}
          </View>
          <View className='userDetails_falls'>
              {/*{data.map((item,index) => {*/}
              {/*  return (shopMerchant())*/}
              {/*})}*/}
            <View className= 'userDetails_falls_details'>
              <View className='userDetails_falls_makebg'>
              </View>
            </View>

            {/*<View className= 'userDetails_falls_details'>*/}
            {/*  <View className='userDetails_falls_bg'>*/}
            {/*    <View className='userDetails_make'>*/}
            {/*      品牌*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*  <View className='userDetails_falls_desc'>*/}
            {/*    <View className='userDetails_falls_title'>是店铺昵称啊</View>*/}
            {/*    <View className='userDetails_falls_shopType'>萧山商圈·西餐</View>*/}
            {/*    <View className='userDetails_falls_getBean'>到店打卡可捡100</View>*/}
            {/*    <View className='userDetails_falls_coupon'>*/}
            {/*      <View className='userDetails_coupon_mj userDetails_coupon_box'>满20元减5元</View>*/}
            {/*      <View className='userDetails_coupon_dk userDetails_coupon_box'>5元抵扣券</View>*/}
            {/*    </View>*/}
            {/*    <View className='userDetails_falls_accress'>*/}
            {/*      <View className='userDetails_falls_city'>*/}
            {/*        <View className='userDetails_falls_cityIcon'></View>*/}
            {/*        <View className='userDetails_falls_cityName'>*/}
            {/*          哈啊哈哈哈哈哈哈哈哈哈啊哈哈哈哈哈哈哈*/}
            {/*        </View>*/}
            {/*      </View>*/}
            {/*      <View className='userDetails_falls_limit'>距你100m</View>*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*</View>*/}
           </View>
        </View>
      </View>
    )
  }
}

export default Index
