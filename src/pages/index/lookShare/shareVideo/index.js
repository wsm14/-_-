import React, { Component } from 'react'
import Taro ,{getCurrentInstance}from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, Video, Button} from '@tarojs/components'
import {wxapiGet, wxapiPost} from './../../../../api/api'
import Ajax from './../../../../api/request'
import Utils from "./../../../../utils/utils";
import './index.scss'
export default class ShareVideo extends Component{
  constructor() {
    super(...arguments);
    this.state = {
      getUserMomentDetail : {
        momentId: getCurrentInstance().router.params.momentId || '',
      },
      userMomentsInfo:{
      },
      userInfo: {
        userId: getCurrentInstance().router.params.shareUserId||''
      },
      getBean: false,
      promptToast: false,
      type: getCurrentInstance().router.params.type || '',
      shareUserProfile: '',
      shareUserName: ''
    }
  }
  componentDidShow() {
    Taro.hideHomeButton();
    this.getUserMomentDetails()
    this.getUserInfos()
  }
  getUserMomentDetails() {
    Ajax({
      data: this.state.getUserMomentDetail,
      url: wxapiGet.wechatUserMomentDetail
    },'get').then(res =>{
      if(res.errMsg !== 'request:ok'){
        Utils.Toast(res.errMsg)
      }
      else {
        const {data:{success ,content ,resultDesc} } = res
        if(success){
          this.setState({
            userMomentsInfo: content.userMomentsInfo,
          },res =>{
            if(this.state.userMomentsInfo.watchStatus == 0 &&this.state.type!= 'share'){
             let interval =  Utils.setInterVal(this.state.userMomentsInfo['length']||15, this.getBean.bind(this))
             this.setState({
               interVal : interval
             })
            }
          })
        }
        else {
          Utils.Toast(resultDesc)
        }
      }
    })
  }
  getUserInfos() {
    if(this.state.type == 'share' && this.state.userInfo.userId !=''){
      Ajax({
        data: this.state.userInfo,
        url: wxapiGet.wechatUserByUniqueId
      },'get').then(res =>{
        if(res.errMsg !== 'request:ok'){
          Utils.Toast(res.errMsg)
        }
        else {
          const {data:{success ,content ,resultDesc} } = res
          if(success){
            const {content:{userInfo:{profile,username}}} = res.data
            this.setState({
              shareUserProfile: profile,
              shareUserName: username
            })
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      })
    }
  }
  saveBean(){
    Ajax({
      data: { momentId: getCurrentInstance().router.params.momentId},
      url: wxapiPost.wechatBeanDetail
    },'post').then(res =>{
      if(res.errMsg !== 'request:ok'){
        Utils.Toast(res.errMsg)
      }
      else {
        const {data:{success ,content ,resultDesc} } = res
        if(success){
          this.setState({
            getBean: true,
            userMomentsInfo: {
              ...this.state.userMomentsInfo,
              watchStatus: '1'
            }
          })
        }
        else {
          Utils.Toast(resultDesc)
        }
      }
    })
  } //领取卡豆
  getBean(time) {
    this.setState({
      userMomentsInfo:{
        ...this.state.userMomentsInfo,
        length: time
      }
    },res =>{
      if(time == 0 && this.state.type != 'share'){
        this.saveBean()
      }
    })
  } //设置定时器领取卡豆
  setVedioStatus() {
    if(this.state.userMomentsInfo.watchStatus && this.state.userMomentsInfo.watchStatus == '0'){
      this.setState({
        promptToast: true
      })
      if(this.state.interVal){
        clearInterval(this.state.interVal);
        Taro.createVideoContext('video', this).pause()
      }
    }
    else {
      Utils.goBack()
    }
  } //暂停是关闭定时器和暂停视频
  watching() {
    Taro.createVideoContext('video', this).play()
    let interval =  Utils.setInterVal(this.state.userMomentsInfo['length'], this.getBean.bind(this))
    this.setState({
      interVal : interval,
      promptToast: false,
    })
  }//暂停是关闭定时器和暂停视频
  goAppError(e){
    Utils.goDown();
  }
  onShareAppMessage(options) {
    // 设置转发内容 -- 适用于: 页面右上角 ... 和 页面按钮
    const { userMomentsInfo }  =this.state
    var shareObj = {
      title: `${userMomentsInfo.title||'视频分享'}`,
      imageUrl: `${userMomentsInfo.frontImage}`,
      success: function(res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
            Utils.Toast('转发成功')
        }
      },
      fail: function(res) {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          // 用户取消转发
          Utils.Toast('取消转发')
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
          Utils.Toast('转发失败')
        }
      },
      complete: function() {
        // 转发结束之后的回调（转发成不成功都会执行）
        console.log('---转发完成---');
      }
    };
    return shareObj;
  }
  onShareTimeline(){
    const { userMomentsInfo }  =this.state
    return {
      title: `${userMomentsInfo.title||'视频分享'}`,
      imageUrl: `${userMomentsInfo.frontImage}`,
    }
  }
  render() {
    const {getUserMomentDetail, userMomentsInfo ,getBean,promptToast,shareUserName,type,shareUserProfile}  =this.state
    const height = userMomentsInfo.videoContent && parseInt(JSON.parse(userMomentsInfo.videoContent).height)
    return (
      <View className = "page_share_layer">
        {type == 'share' && <View className = 'page_share_download'>
          <View className = 'page_share_downloadBox'>
            <View className='page_share_userDetails'>
              <View className= 'page_share_profile' style={{background:`url(${shareUserProfile}) no-repeat center/cover`}}></View>
              <View className= 'page_share_userBox'>
                <View className='page_share_userName'>{shareUserName}</View>
                <View className='page_share_userTitle'>"我在哒卡乐发了一篇有趣的视频"</View>
              </View>
            </View>
            <View  className='page_share_btn'>
              <Button  openType='launchApp'
                       appParameter={JSON.stringify({jumpUrl: 'videoMomentDetailPage',id: getUserMomentDetail.momentId,
                         type : 'jumpToPage', jumpType : "native" ,path:'videoMomentDetailPage',params:{id: getUserMomentDetail.momentId}})}
                       onError={(e) =>this.goAppError(e)} className='page_share_btnStyle'>打开APP</Button>
            </View>
          </View>
        </View>}
        {type == 'share' && <View className='page_share_openApp'>
          <Button  appParameter={JSON.stringify({jumpUrl: 'videoMomentDetailPage',id: getUserMomentDetail.momentId,
            type : 'jumpToPage', jumpType : "native" ,path:'videoMomentDetailPage',params:{id: getUserMomentDetail.momentId}})} openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle1'>App内打开</Button>
        </View>}
        {userMomentsInfo.watchStatus =='0' && userMomentsInfo.beanFlag =='1' && type!= 'share' &&<View className="page_share_title">
          <View className="page_share_left">
            <Text className="page_bold">
              {userMomentsInfo.length}
            </Text>秒后可领
            <Text className="page_bean_share">
              {userMomentsInfo.beanAmount}
            </Text>卡豆
            <Text className="page_liner"></Text>
            <Text className="page_close" onClick={ () => this.setVedioStatus()}></Text>
          </View>
          <View className="page_share_right"></View>
        </View>}
        {userMomentsInfo.watchStatus =='1' && userMomentsInfo.beanFlag =='1' && type!= 'share' && <View className="page_share_title">
          <View className="page_share_left">
            <Text className="page_bold">
            </Text>已领取
            <Text className="page_bean_share">
              {userMomentsInfo.beanAmount}
            </Text>卡豆
            <Text className="page_liner"></Text>
            <Text className="page_close" onClick={ () => this.setVedioStatus()}></Text>
          </View>
          <View className="page_share_right"></View>
        </View>}
        {userMomentsInfo.beanFlag =='0' &&
        <View className="page_share_title">
          <View className='page_share_back' onClick={ () => Utils.goBack()}></View>
          <View className="page_share_right"></View>
        </View>}
        {/*<View className="page_share_city">*/}
        {/*   来自同城*/}
        {/* </View>*/}
        {userMomentsInfo.userType == 'merchant' &&
        <View className="page_share_shop" onClick={() =>Utils.goDown()}>
          <View className="page_shareShop_top">
            <Text className="page_shareShop_name">{userMomentsInfo.merchantName}</Text>
            <Text className="page_liner lineColor"></Text>
            <Text className="page_line_city">{userMomentsInfo.districtName}</Text>
          </View>
          <View className="page_share_people">
            <Text className="page_share_frequency">{userMomentsInfo.viewAmount}次看过此地</Text>
            {userMomentsInfo.categoryName && userMomentsInfo.categoryName == '美食' && <Text className="page_share_tag">在您附近的美食</Text>}
          </View>
        </View>}
        <View className="page_share_userdata" onClick={() =>Utils.goDown()}>
          <View className="page_share_user">
            <Text className="page_share_userprofile" style={userMomentsInfo.userProfile?{background:`url(${userMomentsInfo.userProfile}) no-repeat center/cover`}:{background:`url(https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/iconindex.png) no-repeat center/cover`}}></Text>
            <Text className="page_share_username">{userMomentsInfo.username}</Text>
          </View>
          <View className="page_share_details">
            {userMomentsInfo.title}
          </View>
        </View>
        <View className='page_video'>
          {userMomentsInfo.videoContent?
            <Video
              className='video_box'
              src={JSON.parse(userMomentsInfo.videoContent).url}
              style={{height:Taro.pxTransform(height)}}
              controls={true}
              enableProgressGesture={true}
              autoplay={true}
              showFullscreenBtn={false}
              enablePlayGesture={true}
              loop={true}
              objectFit='cover'
              poster={userMomentsInfo.frontImage}
              initialTime='0'
              id='video'
              muted={false}
            />:null}
        </View>
        {getBean && type!= 'share'&& <View className='bean_toast'>
          <View className='bean_toastIcon' onClick={() => this.setState({getBean: false})}>
            <View className='bean_box'>
              <View className='bean_title'>恭喜获得</View>
              <View className='bean_num'><Text className='bean_getNum'>{userMomentsInfo.beanAmount}</Text>卡豆</View>
              <View className='bean_btn' >确定</View>
            </View>
          </View>
        </View>}
        {promptToast && type!= 'share' && <View className='bean_toast prompt_box'>
          <View className='bean_prompt'>
            <View className='prompt_title'>任务提示</View>
            <View className='prompt_context'>观看完整视频可获得奖励</View>
            <View className='prompt_btn'>
              <View className='prompt_btn_out' onClick={ () => Utils.goBack()}>放弃奖励</View>
              <View className='prompt_btn_now' onClick={ ()=> this.watching()}>继续观看</View>
            </View>
          </View>
        </View>}
      </View>
    )
  }
}
