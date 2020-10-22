import React, {Component, useState} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import Nav from '@/components/nav'
import Banner from '@/components/banner'
import Modal from '@/components/modal'
import GetBean from '@/components/getBean'
import Toast from '@/components/beanToast'
import {kol} from '@/api/api'
import {httpGet, httpPost} from '@/api/newRequest'
import APPShare from '@/components/shareApp'
import classNames from 'classnames'
import {
  imgList,
  backgroundObj,
  setPeople,
  saveFollow,
  deleteFollow,
  navigateTo,
  saveCollection,
  deleteCollection,
  setIntive,
  deleteFall,
  saveFall,
  toast
} from '@/common/utils'
import './index.scss'

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        kolMomentId: getCurrentInstance().router.params.kolMomentId || '1317005527285485569'
      },
      kolMomentsInfo: {},
      visible: false,
      bannerSetting: {
        style: {
          width: '100%',
          height: Taro.pxTransform(810),
        },
        showToast: true,
        imgName: 'key',
        data: [],
        height: 'height'
      },
      toast: false,
      time: null,
      beanSet: false,
      shareStatus: getCurrentInstance().router.params.type || ''
    }
  }

  componentDidShow() {
    this.shareDetailsById()
  }

  followStatus(e) {
    e.stopPropagation()
    let that = this
    const {kolMomentsInfo, kolMomentsInfo: {userFollowStatus, merchantIdString, merchantId, userIdString, userType}} = this.state
    if (userFollowStatus === '1') {
      let that = this
      const {kolMomentsInfo: {userIdString}} = this.state
      deleteFollow({
        followUserId: userIdString,
      }, () => {
        that.setState({
          kolMomentsInfo: {
            ...kolMomentsInfo,
            userFollowStatus: '0'
          }
        }, res => {
          toast('取消成功')
        })
      })
    } else {
      let type = 'user'
      if (merchantId && merchantIdString) {
        type = 'merchant'
      }
      saveFollow({
        followType: type,
        followUserId: userIdString,
      }, () => that.setState({
        kolMomentsInfo: {
          ...kolMomentsInfo,
          userFollowStatus: '1'
        }
      }, res => {
        toast('关注成功')
      }))
    }
  }

  //用户关注状态
  collectionStatus() {
    let that = this
    const {
      kolMomentsInfo: {
        kolMomentId, momentCollectionStatus
      },
      kolMomentsInfo
    } = this.state
    if (momentCollectionStatus === '1') {
      deleteCollection({
        collectionType: 'kolMoments',
        collectionId: kolMomentId,
      }, () => {
        that.setState({
          kolMomentsInfo: {
            ...kolMomentsInfo,
            momentCollectionStatus: '0',
            collectionAmount: kolMomentsInfo.collectionAmount - 1
          }
        })
      })
    } else {
      saveCollection({
        collectionType: 'kolMoments',
        collectionId: kolMomentId,
      }, () => {
        that.setState({
          kolMomentsInfo: {
            ...kolMomentsInfo,
            momentCollectionStatus: '1',
            collectionAmount: kolMomentsInfo.collectionAmount + 1
          }
        })
      })
    }
  }

  // componentDidHide() {
  //   if (this.state.interval) {
  //     try {
  //       clearInterval(this.state.interval)
  //     } catch (e) {
  //
  //     }
  //     this.setState({
  //       interval: null
  //     })
  //   }
  // }

  //用户收藏信息
  shareDetailsById() {
    // 阻止事件冒泡
    const {shareDetails: {getMomentDetail}} = kol
    const {httpData, bannerSetting} = this.state
    httpGet({url: getMomentDetail, data: httpData}, res => {
      const {
        kolMomentsInfo, kolMomentsInfo: {
          merchantIdString,//商家id'
          userLevel, imageContent, imageHost, beanFlag
        }
      } = res
      if (userLevel === '0' || beanFlag != '1') {
        this.setState({
          kolMomentsInfo,
          visible: false,
          bannerSetting: {...bannerSetting, data: imgList(imageContent, imageHost, 'key')}
        })
        return
      } else {
        this.setState({
          kolMomentsInfo,
          visible: false,
          beanSet: true,
          bannerSetting: {...bannerSetting, data: imgList(imageContent, imageHost, 'key')}
        }, res => {
          if (this.state.kolMomentsInfo.watchStatus == 0 && !this.state.interval && !this.state.time) {
            this.setState({
              time: this.state.kolMomentsInfo.length
            }, res => {
              this.setState({
                interval: setIntive(this.state.time, this.getBean.bind(this)),
              })
            })
          } else if (this.state.kolMomentsInfo.watchStatus == 0 && this.state.time) {
            this.initInterval()
          }
        })
      }
    })
  }

  initInterval() {
    if (!this.state.interval && this.state.time) {
      this.setState({
        interval: setIntive(this.state.time, this.getBean.bind(this))
      })
    }
  }

  //初始化详情数据
  fallStatus() {
    let that = this
    const {
      kolMomentsInfo: {
        kolMomentId, userLikeStatus,
      },
      kolMomentsInfo
    } = this.state
    if (userLikeStatus === '1') {
      deleteFall({
        kolMomentsId: kolMomentId,
      }, () => {
        that.setState({
          kolMomentsInfo: {
            ...kolMomentsInfo,
            userLikeStatus: '0',
            likeAmount: kolMomentsInfo.likeAmount - 1
          }
        })
      })
    } else {
      saveFall({
        kolMomentsId: kolMomentId,
      }, () => {
        that.setState({
          kolMomentsInfo: {
            ...kolMomentsInfo,
            userLikeStatus: '1',
            likeAmount: kolMomentsInfo.likeAmount + 1
          }
        })
      })
    }
  }

  kolStatus() {
    const {kolMomentsInfo: {merchantIdString, userLevel}} = this.state
    if (merchantIdString || userLevel > 1) {
      return true
    }
    return false
  }

  //用户点赞信息
  getBean(time) {
    this.setState({
      time: time
    }, res => {
      if (time == 0) {
        this.saveBean()
      }
    })
  }//设置定时器领取卡豆
  saveBean() {
    const {kolMomentsInfo: {kolMomentId}, kolMomentsInfo} = this.state
    const {shareDetails: {saveWatch}} = kol
    httpPost({
      data: {momentId: kolMomentId},
      url: saveWatch
    }, res => {
      this.setState({toast: true, kolMomentsInfo: {...kolMomentsInfo, watchStatus: '1'}})
    })
  } //领取卡豆
  errorToast(e) {
  }

  render() {
    const {
      kolMomentsInfo,
      kolMomentsInfo: {
        merchantIdString,//商家id'
        merchantCover,//商家組圖
        merchantName, //商家名稱
        merchantCategoryName,//商家標簽名稱
        merchantAddress, //商家地址
        title,//標題
        message,//内容
        collectionAmount,//收藏數量
        distanceRange,//距離
        userProfile,//頭像
        userFollowStatus,//關注狀態
        likeAmount, //點贊，
        username,
        userLikeStatus,//點贊狀態
        momentCollectionStatus,//收藏狀態,
        userIdString,
        watchStatus,
        topicId,
        topicName,
        beanAmount,
        interactionTime,
        merchantCityName,
      },
      time,
      visible,
      bannerSetting,
      toast,
      beanSet,
      shareStatus
    } = this.state
    const navSetting = {
      style: {
        background: 'rgba(255,255,255,0)',
      },
      type: 'white'
    }
    return (
      <View className='shareImage_box'>
        {shareStatus == 'share' &&
        <APPShare
          {...{
            content: '我在哒卡乐发了一篇有趣的图文',
            userId: getCurrentInstance().router.params.shareUserId,
            jumpObj: {
              jumpUrl: 'MomentImageKol',
              momentId: getCurrentInstance().router.params.kolMomentId,
              type: 'jumpToPage',
              jumpType: "native",
              path: 'DKLShareKOLVideoPlayerViewController',
              params: {momentId: getCurrentInstance().router.params.kolMomentId}
            }
          }
          }>
        </APPShare>}
        <Banner {...bannerSetting}></Banner>
        <View className='shareImage_details'>
          <View className='shareImage_statistics'>
            <View
              className='shareImage_userProfile'
              style={backgroundObj(userProfile)}
              onClick={() => navigateTo(`/pages/newUser/userDetails/index?userStingId=${userIdString}&type=share`)}>
              <View
                className={classNames('shareImage_followStatus', userFollowStatus === '1' ? 'shareImage_delete' : 'shareImage_install')}
                onClick={(e) => this.followStatus(e)}
              >
              </View>
            </View>
            {/*{昵稱}*/}
            <View className='shareImage_userName'>{username}</View>
            {/*{昵稱}*/}
            {/*{點贊加收藏}*/}
            <View className='shareImage_right'>
              <View
                className={classNames('shareImage_like', userLikeStatus === '1' ? 'shareVideo_like_icon1' : 'shareImage_like_icon')}
                onClick={() => this.fallStatus()}
              >
              </View>
              <View className='shareImage_likeNum'>
                {setPeople(likeAmount)}
              </View>
              {this.kolStatus() &&
              <View className='public_center'>
                <View
                  className={classNames('shareImage_Collection', momentCollectionStatus === '1' ? 'shareImage_Collection_icon1' : 'shareImage_Collection_icon')}
                  onClick={() => this.collectionStatus()}
                >
                </View>
                <View className='shareImage_CollectionNum'>
                  {setPeople(collectionAmount)}
                </View>
              </View>
              }
            </View>
            {/*{點贊加收藏}*/}
          </View>
          {/*//头像和名称以及收藏点赞*/}
          <View className='shareImage_title'>
            {title}
          </View>
          {/*//文章名称*/}
          <View className='shareImage_dec'>
            {message}
          </View>
          {/*//文章详情*/}
          <View className='shareImage_time'>
            {interactionTime}
          </View>
          {/*//文章时间*/}
          {this.kolStatus() && topicId &&
          <View className='shareImage_conversation'>
            <View className='shareImage_conversationBox'>
              <Text className='shareImage_conversation_icon'></Text>
              <Text className='shareImage_conversation_font'>{topicName}</Text>
            </View>
          </View>}
          {/*//文章话题*/}
          {merchantIdString &&
          <View className='shareImage_shop'>
            <View className='shareImage_shopDetails'>
              <View className='shareImage_shopProfile' style={backgroundObj(merchantCover)}>

              </View>
              <View className='shareImage_shopFont'>
                <View className='shareImage_shopName'>{merchantName}</View>
                <View
                  className='shareImage_shopTag'>{merchantCityName ? (merchantCityName + '·') : '' + merchantCategoryName + ' ｜ ' + distanceRange}</View>
              </View>
            </View>
            <View className='shareImage_shopAccress'>
              <View className='shareImage_shopAccress_icon'>

              </View>
              <View className='shareImage_shopAccress_details'>
                {merchantAddress}
              </View>
            </View>
            {/*<View className='shareImage_coupon_none shareImage_coupon'>*/}
            {/*  <View className='shareImage_couponBox'>*/}
            {/*    <View className='shareImage_coupon_icon'></View>*/}
            {/*    <View className='shareImage_coupon_font'>*/}
            {/*      已领优惠券*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*</View>*/}
            <View className='shareImage_shopBtn'>
              进店
            </View>
            {/*//优惠券状态*/}
          </View>}

          {/*//商家详情*/}
        </View>
        {beanSet &&
        <GetBean
          beanStatus={watchStatus}
          beanNum={beanAmount}
          interval={time}
        >
        </GetBean>}

        {toast &&
        <Toast
          data={kolMomentsInfo}
          visible={() => {
            this.setState({
              toast: false
            })
          }}
        >
        </Toast>}
      </View>
    )
  }
}

export default Index
