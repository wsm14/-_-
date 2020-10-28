import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import Nav from '@/components/nav'
import Banner from '@/components/banner'
import Modal from '@/components/modal'
import GetBean from '@/components/getBean'
import Toast from '@/components/beanToast'
import Video from '@/components/video'
import {kol} from '@/api/api'
import APPShare from '@/components/shareApp'
import {httpGet, httpPost} from '@/api/newRequest'
import {
  backgroundObj,
  setPeople,
  navigateTo,
  saveFollow,
  deleteFollow,
  saveCollection,
  deleteCollection,
  setIntive,
  saveFall,
  deleteFall,
  toast,
  onShareFriend,
  onTimeline
} from '@/common/utils'
import touch from '@/common/touch'
import classNames from 'classnames'
import './index.scss'
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      kolMomentsInfo: {},
      httpData: {
        kolMomentId: getCurrentInstance().router.params.kolMomentId || '1317009859036827649'
      },
      visible: false,
      decStatus: true,
      toast: false,
      beanSet: false,
      initDec: true,
      shareStatus: getCurrentInstance().router.params.type ||'',
      viewFlag : true
    }
  }
  componentDidShow() {
    this.shareDetailsById();
  }
  componentWillUpdate(nextProps, nextState) {
    let that = this
    if (nextProps.decStatus !== nextState.decStatus && nextState == true) {
      Taro.createSelectorQuery().selectAll('.shareVideo_dec_box').boundingClientRect(function (res) {
        if (res && res[0].height > parseInt(Taro.pxTransform(42))) {
          that.setState({
            decStatus: false,
            initDec: false
          })
        }
      }).exec()
    }
  }
  shareDetailsById() {
    // 阻止事件冒泡
    const {httpData} = this.state
    const {shareDetails: {getMomentDetail}} = kol
    httpGet({url: getMomentDetail, data: httpData}, res => {
      const {kolMomentsInfo, kolMomentsInfo: {merchantIdString,beanFlag, userLevel}} = res
      if (userLevel === '0' || beanFlag != '1') {
        this.setState({
          kolMomentsInfo,
          visible: false,
        })
        return
      }
      this.setState({
        kolMomentsInfo,
        visible: false,
        beanSet: true
      }, res => {
        if (this.state.kolMomentsInfo.watchStatus == 0 && !this.state.interval && !this.state.time) {
          this.setState({
            time: this.state.kolMomentsInfo.length
          }, res => {
            this.setState({
              interval: setIntive(this.state.time, this.getBean.bind(this)),
            })
          })
        }
        else if(this.state.kolMomentsInfo.watchStatus == 0 && this.state.time){
          toast('222')
          this.initInterval()
        }
      })
    })
  }
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
    const {kolMomentsInfo:{kolMomentId},kolMomentsInfo} = this.state
    const {shareDetails:{saveWatch}} = kol
    httpPost({
      data:{momentId: kolMomentId},
      url:saveWatch
    },res => {
      this.setState({toast: true,kolMomentsInfo:{...kolMomentsInfo,watchStatus:'1'}})
    })
  } //领取卡豆
  followStatus(e) {
    e.stopPropagation()
    let that = this
    const {kolMomentsInfo,kolMomentsInfo: {userFollowStatus, merchantIdString, merchantId, userIdString, userType}} = this.state
    if (userFollowStatus === '1') {
      let that = this
      const {kolMomentsInfo: {userIdString}} = this.state
      deleteFollow({
        followUserId: userIdString,
      }, () =>{
        that.setState({
          kolMomentsInfo:{
            ...kolMomentsInfo,
            userFollowStatus : '0'
          }
        },res =>{
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
        kolMomentsInfo:{
          ...kolMomentsInfo,
          userFollowStatus : '1'
        }
      },res =>{
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
      },  () =>{
        that.setState({
          kolMomentsInfo:{
            ...kolMomentsInfo,
            momentCollectionStatus : '0',
            collectionAmount:kolMomentsInfo.collectionAmount-1
          }
        })
      })
    } else {
      saveCollection({
        collectionType: 'kolMoments',
        collectionId: kolMomentId,
      }, () =>{
        that.setState({
          kolMomentsInfo:{
            ...kolMomentsInfo,
            momentCollectionStatus : '1',
            collectionAmount:kolMomentsInfo.collectionAmount+1
          }
        })
      })
    }
  }

  //用户收藏信息
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
      },  () =>{
        that.setState({
          kolMomentsInfo:{
            ...kolMomentsInfo,
            userLikeStatus: '0',
            likeAmount: kolMomentsInfo.likeAmount-1
          }
        })
      })
    } else {
      saveFall({
        kolMomentsId: kolMomentId,
      }, () =>{
        that.setState({
          kolMomentsInfo:{
            ...kolMomentsInfo,
            userLikeStatus : '1',
            likeAmount: kolMomentsInfo.likeAmount+1
          }
        })
      })
    }
  }
  kolStatus(){
    const {kolMomentsInfo:{merchantIdString,userLevel}} = this.state
    if(merchantIdString ||userLevel > 1){
      return true
    }
    return false
  }
  //用户收藏信息
  //用户点赞信息
  stopInterval(obj) {
    clearInterval(obj)
    this.setState({
      interval: null
    })
  }
  initInterval(){
    if(!this.state.interval && this.state.time){
      this.setState({
        interval:setIntive(this.state.time,this.getBean.bind(this))
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
  onShareAppMessage() {
    const {kolMomentsInfo:{
      title,
      frontImage
    }}  = this.state
    return  onShareFriend({
      title:  title,
      img: frontImage
    })
  }
  onShareTimeline() {
    const {kolMomentsInfo:{
      title,
      frontImage
    }}  = this.state
  return onTimeline({
      title:  title,
      img: frontImage
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
      decStatus,
      toast,
      kolMomentsInfo,
      videoSetting,
      beanSet,
      kolMomentsInfo: {
        watchStatus,
        beanAmount,
        message,
        topicIdString,
        topicName,
        interactionTime,
        collectionAmount,//收藏數量
        distanceRange,//距離
        userProfile,//頭像
        userFollowStatus,//關注狀態
        likeAmount, //點贊，
        username,
        userLikeStatus,//點贊狀態
        momentCollectionStatus,//收藏狀態,
        merchantIdString,
        merchantCover,
        merchantName,
        merchantCategoryName,
        merchantAddress,
        userLevel,
        merchantCityName,
        userIdString
      },
      time,
      shareStatus,
      viewFlag
    } = this.state
    return (
      <View className='shareVideo_box'>
        {shareStatus=='share'&&
        <APPShare
          {...{
            content: '我在哒卡乐发了一篇有趣的视频',
            userId:getCurrentInstance().router.params.shareUserId,
            jumpObj:{
              jumpUrl: 'MomentVideoKol',
              momentId: getCurrentInstance().router.params.kolMomentId,
              type : 'jumpToPage',
              jumpType : "native" ,
              path:'DKLShareKOLVideoPlayerViewController',params:{momentId: getCurrentInstance().router.params.kolMomentId}}
          }
          }>
        </APPShare>}
        <View
          onTouchStart={(e) => {touch.touchStart(e)}}
          onClick={
            (e) =>touch.multipleTap(e,() =>this.setState({viewFlag: !this.state.viewFlag}))}
          className='shareVideo_setting'>
          <Video
            kolMomentsInfo={kolMomentsInfo}
            onPlay={() =>this.initInterval()}
            {...videoSetting}
            onPause={() => this.stopInterval(this.state.interval)}
          ></Video>
        </View>

        {viewFlag&&
        <View>
          <View className={('animated fadeInUp shareVideo_details_box')}>
            <View className='shareVideo_userProfile' style={backgroundObj(userProfile)}
                  onClick={() =>navigateTo(`/pages/newUser/userDetails/index?userStingId=${userIdString}&type=share`)}>
              <View
                onClick={(e) => this.followStatus(e)}
                className={classNames(userFollowStatus === '1' ? 'shareVideo_installNow' : 'shareVideo_install')}>
              </View>
            </View>
            <View className='shareVideo_zd_box'>
              <View onClick={() => this.fallStatus()}
                    className={classNames('shareVideo_icon_size', userLikeStatus === '1' ? 'shareVideo_zd_icon2' : 'shareVideo_zd_icon1')}>

              </View>
              <View className='shareVideo_icon_num'>
                {setPeople(likeAmount)}
              </View>
              {this.kolStatus() &&
              <View>
                <View
                  className={classNames('shareVideo_icon_size', momentCollectionStatus === '1' ? 'shareVideo_shoucang_icon2' : 'shareVideo_shoucang_icon1')}
                  onClick={() => this.collectionStatus()}
                >
                </View>
                <View className='shareVideo_icon_num'>
                  {setPeople(collectionAmount)}
                </View>
              </View>
              }
            </View>
          </View>
          {this.kolStatus() && <View className='bounceInUp animated shareVideo_shop'>
            <View className='shareVideo_shopDetails' onClick={() =>navigateTo(`/pages/newUser/merchantDetails/index?userId=${merchantIdString}`)}>
              <View className='shareVideo_shopProfile' style={backgroundObj(merchantCover)}>
              </View>
              <View className='shareVideo_shopFont font_hide'>
                <View className='shareVideo_shopName'>{merchantName}</View>
                <View
                  className='shareVideo_shopTag'>{merchantCityName || '杭州' + '·' + merchantCategoryName + ' ｜ ' + distanceRange}</View>
              </View>
            </View>
            <View className='shareVideo_active_box'>
              {/*<View className='shareVideo_coupon'>*/}
              {/*  <View className='shareVideo_couponBox'>*/}
              {/*    <View className='shareVideo_coupon_icon'></View>*/}
              {/*    <View className='shareVideo_coupon_font'>*/}
              {/*      已领优惠券*/}
              {/*    </View>*/}
              {/*  </View>*/}
              {/*</View>*/}
              <View className='shareVideo_shopAccress'>
                <View className='shareVideo_shopAccress_icon'>

                </View>
                <View className='shareVideo_shopAccress_details'>
                  {merchantAddress}
                </View>
              </View>
            </View>
            <View className={classNames('shareVideo_dec_box', decStatus && "shareVideo_dec_expand")}>
              {message}
              <View className='shareVideo_dec_details'>
                <View className='shareVideo_dec_time'>
                  {interactionTime}
                </View>
                {!decStatus && <View className='shareVideo_dec_hide' onClick={() => {
                  this.setState({decStatus: true})
                }}>
                  <View>收起</View>
                  <View className='shareVideo_dec_hideIcon'></View>
                </View>}
              </View>
              {decStatus && <View className='shareVideo_dec_show' onClick={() => {
                this.setState({decStatus: false})
              }}></View>}
            </View>
            {topicIdString && <View className='shareVideo_conversation_style shareVideo_conversation'>
              <View className='shareVideo_conversationBox'>
                <Text className='shareVideo_conversation_icon'></Text>
                <Text className='shareVideo_conversation_font'>{topicName}</Text>
              </View>
            </View>}
            <View className='shareVideo_shopBtn'>
              进店
            </View>
          </View>}
          {!merchantIdString && userLevel === '0' && <View className='shareVideo_user'>
            <View className='shareVideo_userName'>
              {username}
            </View>
            <View className={classNames('shareVideo_dec_box', decStatus && "shareVideo_dec_expand")}>
              {message}
              <View className='shareVideo_dec_details'>
                <View className='shareVideo_dec_time'>
                  {interactionTime}
                </View>
                {!decStatus && <View className='shareVideo_dec_hide' onClick={() => {
                  this.setState({decStatus: true})
                }}>
                  <View>收起</View>
                  <View className='shareVideo_dec_hideIcon'></View>
                </View>}
              </View>
              {decStatus && <View className='shareVideo_dec_show' onClick={() => {
                this.setState({decStatus: false})
              }}></View>}
            </View>
            {topicIdString && <View className='shareVideo_conversation_style shareVideo_conversation'>
              <View className='shareVideo_conversationBox'>
                <Text className='shareVideo_conversation_icon'></Text>
                <Text className='shareVideo_conversation_font'>{topicName}</Text>
              </View>
            </View>}
          </View>}
          {beanSet &&
          <GetBean
            beanStatus={watchStatus}
            beanNum={beanAmount}
            interval={time}
          >
          </GetBean>
          }
          {toast &&
          <Toast
            data={kolMomentsInfo}
            visible={() => {
              this.setState({
                toast: false
              })
            }}
          >
          </Toast>
          }
        </View>}
      </View>
    )
  }
}

export default Index
