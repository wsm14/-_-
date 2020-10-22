import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import Nav from '@/components/nav'
import {user} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import {
  navigateTo,
  setPeople,
  filterStrList,
  computedHeight,
  backgroundObj,
  filterTime,
  toast,
  saveFollow,
  deleteFollow,
} from '@/common/utils'
import classNames from 'classnames'
import './index.scss'

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      status: false,
      current: '0',
      ViewTabs: ['分享', '收藏', '关注的店', '打卡足迹'],
      routerId: getCurrentInstance().router.params.userStingId || '',
      type: getCurrentInstance().router.params.type || '',
      userInfo: {},//用户详情
      publicList: [],//分享详情
      page: 1,
      limit: 10,
      adminId: Taro.getStorageSync('userInfo').userIdString || '',
      countStatus: true
    }
  }




  createdShopMerchant = (data) => {
    return (
      data.map((item, index) => {
        const {
          brandName,
          merchantName,
          businessHub,
          categoryName,
          markFlag,
          markBean,
          couponTitlesJson,
          distanceRange,
          address,
          coverImg,
          coverImage
        } = item
        return (
          <View key={index} className='userDetails_falls_details'>
            <View className='userDetails_falls_bg' style={{...backgroundObj(coverImg || coverImage)}}>

              {brandName && <View className='userDetails_make'>{brandName}</View>}
            </View>
            <View className='userDetails_falls_desc'>
              <View className='userDetails_falls_title'>{merchantName || ''}</View>
              <View className='userDetails_falls_shopType'>
                {businessHub + '·' || ''}{categoryName || ''}
              </View>
              {markFlag == '1' &&
              <View className='userDetails_falls_getBean'>到店打卡可捡{markBean}</View>
              }
              <View className='userDetails_falls_coupon'>
                {couponTitlesJson && couponTitlesJson.map((item, index) => {
                  return (
                    <View className='userDetails_coupon_mj userDetails_coupon_box'>{item.couponTitle}</View>
                  )
                })}

              </View>
              <View className='userDetails_falls_accress'>
                <View className='userDetails_falls_city'>
                  <View className='userDetails_falls_cityIcon'></View>
                  <View className='userDetails_falls_cityName'>
                    {address}
                  </View>
                </View>
                <View className='userDetails_falls_limit'>距你{distanceRange}</View>
              </View>
            </View>
          </View>
        )
      })
    )
  }


  //获取个人足迹
  onReachBottom() {

  }

  //上拉加载
  componentDidMount() {

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

  render() {
    const navSetting = {
      style: {
        background: 'rgba(255,255,255,0)',
      },
      type: 'white'
    }
    const {
      userInfo: {
        gender,
        age,
        residentAddress,
        tag,
        introduction,
        userFansNum,
        userFollowNum,
        likeCollectionNum,
        level,
        username,
        userFollowStatus
      }
    } = this.state
    return (
      <View className="userDetails_box">
        <View className="userDetails_top">
          <Nav {...navSetting}></Nav>
          <View className='userDetails_user'>
            <View className='userDetails_profile'>

            </View>
            <View className='userDetails_decBox'>
              <View className='userDetails_follow_box'>
                <View className='userDetails_userName'>
                  {username}
                </View>
                {level > 0 && <View className='user_follow_tag'>
                  <View className='follow_icon'></View>
                  <View className='follow_tagFont'>哒人</View>
                </View>}
              </View>
              <View className='userDetails_userAccress'>
                {residentAddress ? residentAddress : ''}
                {age && residentAddress && ' | '}
                {age ? age + '岁' : ''}
              </View>
              <View className='userDetails_sex_tags'>
                <View className='userDetails_sex_box'>
                  <View className='userDetails_sex_style userDetails_sex_tagStyle'>
                    <View
                      className={classNames(gender === 'M' ? 'userDetails_sex_girl' : 'userDetails_sex_boy')}></View>
                  </View>
                  {filterStrList(tag).length > 0 ? filterStrList(tag).map((item, index) => {
                    if (status) {
                      return (
                        <View className='userDetails_sex_style userDetails_tag_style' key={index}>
                          {item}
                        </View>
                      )
                    } else {
                      if (index < 3) {
                        return (
                          <View className='userDetails_sex_style userDetails_tag_style' key={index}>
                            {item}
                          </View>
                        )
                      }
                    }
                  }) : <View className='userDetails_sex_style userDetails_tag_style'>
                    暂无标签
                  </View>}
                  {!status && tag && filterStrList(tag).length > 3 &&
                  <View className='userDetails_sex_style userDetails_showStyle' onClick={() => {
                    this.setState({status: true})
                  }}>
                    <View className='userDetails_show'></View>
                  </View>}
                  {status && tag.length > 0 &&
                  <View className='userDetails_sex_style userDetails_hideStyle' onClick={() => {
                    this.setState({status: false})
                  }}>
                    <View className='userDetails_hide'></View>
                  </View>}
                </View>
              </View>
            </View>
          </View>
          <View className='font_noHide userDetails_decs'>
            {introduction}
          </View>
          <View className='userDetails_code'>
            <View className='userDetails_follow'
                  onClick={() => navigateTo(`/pages/kol/fans/index?userId=${routerId || Taro.getStorageSync('userInfo').userIdString}`)}>
              <View className='userDetails_num'>{setPeople(userFansNum) || 0}</View>
              <View className='userDetails_title'>粉丝</View>
            </View>
            <View className='userDetails_fans'
                  onClick={() => navigateTo(`/pages/kol/follow/index?userId=${routerId || Taro.getStorageSync('userInfo').userIdString}`)}>
              <View className='userDetails_num'>{setPeople(userFollowNum) || 0}</View>
              <View className='userDetails_title'>关注</View>
            </View>
            <View className='userDetails_fans'>
              <View className='userDetails_num'>{setPeople(likeCollectionNum)||0}</View>
              <View className='userDetails_title'>获赞与被收藏</View>
            </View>
            {(type == 'share' && routerId !== adminId) ?
              (userFollowStatus == '1' ?
                <View className='userDetails_editBtn' onClick={() =>this.deleteFollow()}>已关注</View> :
                <View className='userDetails_editBtn'  onClick={() =>this.getFollow()}>
                  <View className='userDetails_edit_icon'>

                  </View>
                  关注
                </View>)
              : <View className='userDetails_editBtn' onClick={() =>navigateTo('/pages/share/download/index')}>编辑资料</View>
            }
          </View>
        </View>
        <View className="userDetails_content">
          <View className='userDetails_falls'>

          </View>
        </View>
      </View>
    )
  }
}

export default Index
