import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Image, View} from '@tarojs/components'
import Nav from '@/components/nav'
import NullStatus from '@/components/nullStatus'
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
      current: getCurrentInstance().router.params.count ||0,
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
  getFollow()  {
    let that = this
    const {userInfo,userInfo: {userIdString,userType}} = this.state
    saveFollow({
      followType: userType,
      followUserId: userIdString,
    },res => {
      that.setState({
        userInfo:{
          ...userInfo,
          userFollowStatus: '1'
        }
      },res =>{
        toast('关注成功')
      })
    })

  }
  deleteFollow() {
    let that = this
    const {userInfo,userInfo: {userIdString}} = this.state
    deleteFollow({
      followUserId: userIdString,
    }, () =>{
      that.setState({
        userInfo:{
          ...userInfo,
          userFollowStatus: '0'
        }
      },res =>{
        toast('取消成功')
      })
    })
  }

  getIsMe() {
    const {routerId, type, adminId} = this.state
    if (type == 'share' && routerId !== adminId) {
      return false
    }
    return true
  }

  getUserDetails() {
    if (!this.getIsMe()) {
      this.getOtherDetails()
    } else {
      this.getUsers()
    }
  }

  getOtherDetails() {
    const {userDetails: {getOtherUser}} = user
    const {routerId} = this.state
    httpGet({
      url: getOtherUser,
      data: {
        userId: routerId
      }
    }, res => {
      const {userInfo} = res
      this.setState({
        userInfo
      })
    })
  }

  //获取他人详情
  getUsers() {
    const {userDetails: {getOtherUser}} = user
    if(Object.keys(Taro.getStorageSync('userInfo')).length<5){
      navigateTo('/pages/auth/index')
      return
    }

    httpGet({
      url: getOtherUser,
      data: {
        userId: Taro.getStorageSync('userInfo').userIdString||''
      }
    }, res => {
      const {userInfo} = res
      this.setState({
        userInfo
      })
    })

  }

  //获取个人详情
  getOtherShare() {
    const {userDetails: {getOtherShare}} = user
    const {routerId, page, limit, publicList} = this.state
    httpGet({
      url: getOtherShare,
      data: {
        userId: routerId,
        page,
        limit
      }
    }, res => {
      const {userMomentsList} = res
      if (userMomentsList && userMomentsList.length > 0) {
        this.setState({
          publicList: [...publicList, ...userMomentsList]
        })
      } else {
        this.setState({
          countStatus: false
        }, res => {
          toast('暂无更多数据')
        })
      }
    })
  }

  //获取他人分享
  getUserShare() {
    const {userDetails: {getUserShare}} = user
    const {page, limit, publicList} = this.state
    httpGet({
      url: getUserShare,
      data: {
        page,
        limit,
      }
    }, res => {
      const {userMomentsList} = res
      if (userMomentsList && userMomentsList.length > 0) {
        this.setState({
          publicList: [...publicList, ...userMomentsList]
        })
      } else {
        this.setState({
          countStatus: false
        }, res => {
          toast('暂无更多数据')
        })
      }
    })

  }

  //获取个人分享
  getShare() {
    if (!this.getIsMe()) {
      this.getOtherShare()
    } else {
      this.getUserShare()
    }
  }

  getUserCollection() {
    const {userDetails: {getUserCollection}} = user
    const {page, limit, publicList, routerId} = this.state
    httpGet({
      url: getUserCollection,
      data: {
        userId: routerId || Taro.getStorageSync('userInfo').userIdString,
        page,
        limit
      }
    }, res => {
      const {userCollectionList} = res
      if (userCollectionList && userCollectionList.length > 0) {
        this.setState({
          publicList: [...publicList, ...userCollectionList]
        })
      } else {
        this.setState({
          countStatus: false
        }, res => {
          toast('暂无更多数据')
        })
      }
    })
  }

  createdShareMerchant = (data) => {
    return (data.map((item, index) => {
      const {
        frontImage,
        frontImageHeight,
        frontImageWidth,
        merchantName,
        contentType,
        length,
        topicName,
        title,
        watchStatus,
        beanAmount,
        userProfile,
        username,
        likeAmount,
        imageNum,
        merchantAddress,
        distanceRange,
        userLikeStatus,
        beanFlag,
      } = item
      return (
        <View className='userDetails_falls_details'>
          <View className='userDetails_falls_makebg'
                style={{
                  ...backgroundObj(frontImage),
                  height: Taro.pxTransform(computedHeight(frontImageWidth, frontImageHeight, 335))
                }}>
            {contentType == 'video' ?
              <View className='userDetails_share_imgTag'>
                {filterTime(length)}
              </View> :
              <View className='userDetails_share_videoTag'>
                <View className='userDetails_share_imgIcon'></View>
                <View className='userDetails_share_imgfont'>{imageNum}</View>
              </View>
            }
            <View className='userDetails_share_accress'>
              <View className='userDetails_share_limitIcon'></View>
              <View className='userDetails_share_limit'>{distanceRange + ' '} {merchantAddress || ''}  </View>
            </View>
          </View>
          <View className='userDetails_share_about'>
            {topicName && <View className='userDetails_share_tip'>{'#'+topicName}</View>}
            <View className='userDetails_share_title'>{title}</View>
            {beanFlag == '1' ?
              watchStatus == '1' ?
                <View className='userDetails_share_getBean getbeanColor2'>
                  已捡{beanAmount}豆
                </View>
                :
                <View className='userDetails_share_getBean getbeanColor1'>
                  观看可捡{beanAmount}豆
                </View>
              : null
            }

            <View className='userDetails_share_aboutUser'>
              <View className='userDetails_share_userbox'>
                <View style={{...backgroundObj(userProfile)}} className='userDetails_share_userProfile'>

                </View>
                <View className='userDetails_share_userName'>
                  {username}
                </View>
              </View>
              <View className='userDetails_share_status'>
                <View
                  className={classNames(userLikeStatus == '1' ? 'status_box userDetails_share_icon1' : 'status_box userDetails_share_icon2')}>
                </View>
                <View className='userDetails_share_nums'>{setPeople(likeAmount)}</View>
              </View>
            </View>
          </View>
        </View>
      )
    }))
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
              {couponTitlesJson&&
              <View className='userDetails_falls_coupon'>
                {couponTitlesJson.map((item, index) => {
                  return (
                    <View className='userDetails_coupon_mj userDetails_coupon_box'>{item.couponTitle}</View>
                  )
                })}
              </View>
              }

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

  getFollowByUserId() {
    const {userDetails: {getFollowByUserId}} = user
    const {page, limit, publicList, routerId, adminId} = this.state
    httpGet({
      url: getFollowByUserId,
      data: {
        page,
        limit,
        followType: 'merchant',
        userId: routerId || adminId
      }
    }, res => {
      const {userFollowList} = res
      if (userFollowList && userFollowList.length > 0) {
        this.setState({
          publicList: [...publicList, ...userFollowList]
        })
      } else {
        this.setState({
          countStatus: false
        }, res => {
          toast('暂无更多数据')
        })
      }
    })
  }

  //获取关注的店
  getUserMark() {
    const {userDetails: {listUserMark}} = user
    const {page, limit, publicList, routerId, adminId} = this.state
    httpGet({
      url: listUserMark,
      data: {
        page,
        limit,
        userId: routerId || adminId
      }
    }, res => {
      const {userTrackList} = res
      if (userTrackList && userTrackList.length > 0) {
        this.setState({
          publicList: [...publicList, ...userTrackList]
        })
      } else {
        this.setState({
          countStatus: false
        }, res => {
          toast('暂无更多数据')
        })
      }
    })
  }

  //获取个人足迹
  onReachBottom() {
    const {page, limit, countStatus, current} = this.state
    if (countStatus) {
      this.setState({
        page: page + 1
      }, res => {
        if (current == '0') {
          this.getShare()
        } else if (current == '1') {
          this.getUserCollection()
        } else if (current == '2') {
          this.getFollowByUserId()
        } else {
          this.getUserMark()
        }
      })
    }
  }

  //上拉加载
  componentDidShow() {
    this.getUserDetails()
    this.currentTabSwitch(parseInt(this.state.current), [])
  }

  currentTabs(index) {
    const {current} = this.state
    if (current == index) return
    this.setState({current: index}, res => {
      this.currentTabSwitch(index, [])
    })
  }

  currentTabSwitch(index, list) {
    console.log(index)
    switch (index) {
      case 0:
        return this.setState({page: 1, publicList: list, countStatus: true}, res => {
          this.getShare()
        })
      case 1:
        return this.setState({page: 1, publicList: list, countStatus: true}, res => {
          this.getUserCollection()
        })
      case 2:
        return this.setState({page: 1, publicList: list, countStatus: true}, res => {
          this.getFollowByUserId()
        })
      case 3:
        return this.setState({page: 1, publicList: list, countStatus: true}, res => {
          this.getUserMark()
        })
    }
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
      status,
      ViewTabs,
      current,
      routerId,
      adminId,
      type,
      publicList,
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
        userFollowStatus,
        backgroundImg
      }
    } = this.state
    return (
      <View className="userDetails_box">
        <View style={backgroundImg?{...backgroundObj(backgroundImg)}:{
          background: 'url("https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/wechatBg.png") no-repeat center/cover'
        }} className='userDetails_bgTop'>
          <View className="userDetails_top">
            {/*<Nav {...navSetting}></Nav>*/}
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
        </View>
        <View className="userDetails_content">
          <View className='userDetails_tabs'>
            {ViewTabs.map((item, index) => {
              return (
                <View className='userDetails_tabs_child' key={index} onClick={() => this.currentTabs(index)}>
                  <View
                    className={classNames('userDetails_tabs_font', parseInt(current) == index && 'userDetails_tabs_check')}>{item}</View>
                  <View
                    className={classNames('userDetails_tabs_line', parseInt(current) != index && 'userDetails_tabs_lineStyle')}></View>
                </View>
              )
            })}
          </View>
          {publicList.length ==0 &&<NullStatus></NullStatus>}
          <View className='userDetails_falls'>
            {current == 0 && this.createdShareMerchant(publicList)}
            {current == 1 && this.createdShareMerchant(publicList)}
            {current == 2 && this.createdShopMerchant(publicList)}
            {current == 3 && this.createdShopMerchant(publicList)}
          </View>
        </View>
      </View>
    )
  }
}

export default Index
