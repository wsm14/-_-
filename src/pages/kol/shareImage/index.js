import React, {Component, useState} from 'react'
import Taro, {getCurrentInstance,EventChannel} from '@tarojs/taro'
import {View, Text, CoverView} from '@tarojs/components'
import GetBeanCanvas from '@/components/getBeanCanvas'
import StopBean from '@/components/stopBean'
import Nav from '@/components/nav'
import Banner from '@/components/banner'
import Modal from '@/components/modal'
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
  toast,
  onShareFriend,
  onTimeline,
  objStatus
} from '@/common/utils'
import './index.scss'
import evens from "@/common/evens";

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        kolMomentId: getCurrentInstance().router.params.kolMomentId
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
      shareStatus: getCurrentInstance().router.params.type || '',
      stopStatus: false,
      getBeanNow: false,
      lookStatus: '1',
      reportStatus: false
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

  onShareAppMessage() {
    const {
      kolMomentsInfo: {
        title,
        frontImage
      }
    } = this.state
    return onShareFriend({
      title: title,
      img: frontImage
    })
  }

  onShareTimeline() {
    const {
      kolMomentsInfo: {
        title,
        frontImage
      }
    } = this.state
    onTimeline({
      title: title,
      img: frontImage
    })
  }

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
          lookStatus: kolMomentsInfo.watchStatus,
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
          } else if (this.state.kolMomentsInfo.watchStatus == 0 && (this.state.time || this.state.time === 0)) {
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
    const {kolMomentsInfo: {userLevel}} = this.state
    if (userLevel !== '0') {
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
    const {kolMomentsInfo: {kolMomentId, userIdString}, kolMomentsInfo} = this.state
    const {shareDetails: {saveWatch}} = kol
    httpPost({
      data: {
        momentId: kolMomentId,
        momentUserId: userIdString
      },
      url: saveWatch
    }, res => {
      this.setState({toast: true, kolMomentsInfo: {...kolMomentsInfo, watchStatus: '1'}})
    })
  } //领取卡豆
  errorToast(e) {
  }

  stopInterval(obj) {
    clearInterval(obj)
    this.setState({
      interval: null
    })
  }

  link_stop(fn) {
    const {time} = this.state
    if (time) {
      this.setState({
        stopStatus: true,
        linkFn: fn
      }, res => {
        this.stopInterval(this.state.interval)
      })
    } else {
      fn && fn()
    }
  }

  canfirm() {
    this.setState({
      stopStatus: false,
    }, res => {
      this.initInterval()
    })
  }

  cancel() {
    this.setState({
      stopStatus: false,
    }, res => {
      this.state.linkFn && this.state.linkFn()
    })
  }
  componentDidHide() {
    this.stopInterval(this.state.interval)
  }
  componentWillUnmount() {
    const {kolMomentsInfo} = this.state
    evens.$emit('updateList',kolMomentsInfo)
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
        length,
        kolActivityIdString,
        goodsName,
        goodsPrice,
        userLevel,
        userLevelImage,
        kolMomentId,
        contentType
      },
      time,
      visible,
      bannerSetting,
      toast,
      beanSet,
      shareStatus,
      stopStatus,
      lookStatus,
      reportStatus
    } = this.state
    if (objStatus(kolMomentsInfo)) {
      return (
        <View className='shareImage_box'
              onLongPress={() => this.setState({
                reportStatus: true
         })}
        >
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
                path: 'DKLShareKOLImagePlayerViewController',
                params: {momentId: getCurrentInstance().router.params.kolMomentId}
              }
            }
            }>
          </APPShare>}
          {stopStatus &&
          <StopBean
            canfirm={() => this.canfirm()}
            cancel={() => this.cancel()}
          >
          </StopBean>
          }
          <Banner {...bannerSetting}></Banner>
          <View className='shareImage_details'>
            <View className='sharekol_Image'>
              <View className='shareImage_shopDetails'
              >
                <View
                  className='shareImage_shopProfile'
                  style={backgroundObj(merchantCover)}
                  onClick={() => this.link_stop(() => navigateTo(`/pages/newUser/merchantDetails/index?userId=${merchantIdString}`))}
                >
                </View>
                <View className='shareImage_shopFont'>
                  <View className='shareImage_shopName font_hide'>{merchantName}</View>
                  <View
                    className='shareImage_shopTag font_hide'>{merchantCityName || '杭州' + '·' + merchantCategoryName + ' ｜ ' + distanceRange + ' | ' + merchantAddress}</View>
                </View>
              </View>
              <View className='shareImage_merchant'
                    onClick={() => this.link_stop(() => navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${merchantIdString}`))}
              >

              </View>
            </View>
            {/*//商家详情*/}
            {kolActivityIdString &&
            <View className='shareImage_shop_couponBox'>
              {/*<View className='public_center image_coupon_box'>*/}
              {/*  <View className='image_coupon_icon'></View>*/}
              {/*  <View className='image_coupon_font'>看完领券</View>*/}
              {/*</View>*/}
              <View className='image_goshop public_center'
                    onClick={() =>
                      this.link_stop(() => navigateTo(`/pages/perimeter/shopDetails/index?merchantId=${merchantIdString}&kolActivityIdString=${kolActivityIdString}&kolMomentsId=${getCurrentInstance().router.params.kolMomentId}`))}
              >
                <View className='image_shop_icon'></View>
                <View className='image_shop_font'>
                  <Text className='goods_image_shop font_hide'>{goodsName || '--'}</Text>
                  <Text style={{fontSize: Taro.pxTransform(20)}}>{' ¥ '}</Text>
                  <Text style={{fontSize: Taro.pxTransform(28)}}>{goodsPrice || '0'}</Text>
                </View>
              </View>
            </View>
            }
            <View className='shareImage_title'>
              {title}
            </View>
            {/*//文章名称*/}
            {this.kolStatus() && topicId && topicName &&
            <View className='shareImage_conversation font_hide'>
              #{topicName}
            </View>}
            {/*//文章话题*/}
            <View className='shareImage_dec'>
              {message}
            </View>
            {/*//文章详情*/}
            <View className='shareImage_time'>
              {'发布于' + interactionTime}
            </View>
            {/*//文章时间*/}
          </View>
          <View className={('animated fadeInUp shareImages_details_box')}>
            <View style={{display: 'flex', alignItems: 'center'}}>
              <View className='shareImages_userProfile' style={backgroundObj(userProfile)}
                    onClick={() => this.link_stop(() => navigateTo(`/pages/newUser/userDetails/index?userStingId=${userIdString}&type=share`))}
              >
              </View>
              <View className='shareImages_tipIcon' style={backgroundObj(userLevelImage)}></View>
              <View className='shareImages_userName font_hide'>
                {username}
              </View>
              <View
                onClick={(e) => this.followStatus(e)}
                className={classNames(userFollowStatus === '0' ? 'shareImages_installNow' : 'shareImages_install')}>
                {userFollowStatus === '0' ? '关注' : '已关注'}
              </View>
            </View>
            <View style={{display: 'flex', alignItems: 'center', minWidth: Taro.pxTransform(220)}}>
              <View onClick={() => this.fallStatus()}
                    className={classNames('shareImages_icon_size', userLikeStatus === '1' ? 'shareImages_zd_icon2' : 'shareImages_zd_icon1')}>

              </View>
              <View className='shareImages_icon_num'>
                {setPeople(likeAmount)}
              </View>
              {this.kolStatus() &&
              <View style={{display: 'flex', alignItems: 'center'}}>
                <View
                  className={classNames('shareImages_icon_size', momentCollectionStatus === '1' ? 'shareImages_shoucang_icon2' : 'shareImages_shoucang_icon1')}
                  onClick={() => this.collectionStatus()}
                >
                </View>
                <View className='shareImages_icon_num'>
                  {setPeople(collectionAmount)}
                </View>
              </View>
              }
            </View>
          </View>
          {beanSet &&
          <GetBeanCanvas
            beanStatus={watchStatus}
            beanNum={beanAmount}
            interval={time}
            length={length}
            lookStatus={lookStatus}
          >
          </GetBeanCanvas>
          }
          {toast &&
          <Toast
            data={kolMomentsInfo}
            visible={() => {
              this.setState({
                toast: false,
                lookStatus: '1'
              })
            }}
          >
          </Toast>}
          {shareStatus !== 'share' &&
          reportStatus &&
          <CoverView className='report_layer_byUser' onClick={(e) => {
            e.stopPropagation();
            this.setState({reportStatus: false})
          }}>
            <CoverView className='report_layer_btn'
                       onClick={(e) =>
                         navigateTo(`/pages/kol/report/index?name=${username}&momentsId=${kolMomentId}&pushUserId=${userIdString}&momentsType=${contentType}`)}>
              举报
            </CoverView>
          </CoverView>
          }
        </View>
      )
    }
    return null
  }
}

export default Index
