import React, { Component } from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, Button} from '@tarojs/components'
import {wxapiGet,wxapiPost} from './../../../../api/api'
import Ajax from './../../../../api/request'
import Utils from "./../../../../utils/utils";
import './index.scss'
import './../shareVideo/index.scss'
export default class ShareImage extends Component{
  defaultProps = {}
  constructor() {
    super(...arguments);
    this.state = {
      getUserMomentDetail : {
        momentId: getCurrentInstance().router.params.momentId || '2443' //路由参数
       },//req 请求参数
      userMomentsInfo:{
      }, //req 数据
      getBean:false, //弹框
      userInfo: {
        userId: getCurrentInstance().router.params.shareUserId||''
      },
      type: getCurrentInstance().router.params.type || '',
      shareUserProfile: '',
      shareUserName: ''
    }
  }
  componentDidMount() {
    Taro.hideHomeButton();
    this.getUserInfos()
    this.getUserMomentDetails() //初始化
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
  getUserMomentDetails(){
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
             // if(this.state.userMomentsInfo.watchStatus == 0 ){
             //    Utils.setInterVal(this.state.userMomentsInfo['length']||15, this.getBean.bind(this))
             // }
          })
        }
        else {
          Utils.Toast(resultDesc)
        }
      }
    })
  } //req拿数据
  getBean(time) {
     this.setState({
       userMomentsInfo:{
         ...this.state.userMomentsInfo,
         length: time
       }
     },res =>{
       if(time == 0){
         this.saveBean()
       }
     })
  } //设置定时器领取卡豆
  getUserInfos() {
    if(this.state.type == 'share' && this.state.userInfo.userId != ''){
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
    const {getUserMomentDetail, userMomentsInfo ,time ,getBean,type,shareUserProfile,shareUserName} = this.state
    if( typeof userMomentsInfo.imageContent == 'string'){
      userMomentsInfo.imageContent = JSON.parse(userMomentsInfo.imageContent)
    }
      return (
         <View>
           {type == 'share' && <View className = 'page_share_download'>
             <View className = 'page_share_downloadBox'>
               <View className='page_share_userDetails'>
                 <View className= 'page_share_profile' style={{background:`url(${shareUserProfile}) no-repeat center/cover`}}></View>
                 <View className= 'page_share_userBox'>
                   <View className='page_share_userName'>{shareUserName}</View>
                   <View className='page_share_userTitle'>"我在哒卡乐发了一篇有趣的图文"</View>
                 </View>
               </View>
               <View  className='page_share_btn'>
                 <Button
                   appParameter={JSON.stringify({jumpUrl: 'imageMomentDetailPage',id: getUserMomentDetail.momentId,
                     type : 'jumpToPage',
                     jumpType : "native" ,path:'imageMomentDetailPage',params:{id: getUserMomentDetail.momentId}})}
                   openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle'>打开APP</Button>
               </View>
             </View>
           </View>}
           {type == 'share' && <View className='page_share_openApp'>
             <Button
               appParameter={JSON.stringify({jumpUrl: 'imageMomentDetailPage',id: getUserMomentDetail.momentId
               , type : 'jumpToPage', jumpType : "native" ,path:'imageMomentDetailPage',params:{id: getUserMomentDetail.momentId}})}
               openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle1'>App内打开</Button>
           </View>}
          {/* <View className='NavBar_title'>*/}
          {/*  <View className='NavBar_userbox clearfix'>*/}
          {/*    <View className='NavBar_profile' style={{backgroundAttachment:'fixed',background:`url(${userMomentsInfo.userProfile}) no-repeat 0 center/cover`}}></View>*/}
          {/*    <View className='NavBar_username'>{userMomentsInfo.username?userMomentsInfo.username:'--'}</View>*/}
          {/*    /!*{userMomentsInfo.beanFlag === '1' && userMomentsInfo.watchStatus === '0' &&<View className='NavBar_getBean'>{userMomentsInfo['length']+'S后可领'+userMomentsInfo.beanAmount}<Text className='Merchant_getBean'></Text></View>}*!/*/}
          {/*    /!*{userMomentsInfo.beanFlag === '1' && userMomentsInfo.watchStatus !== '0' &&<View className='NavBar_getBean'>已领取{userMomentsInfo.beanAmount}<Text className='Merchant_getBean'></Text></View>}*!/*/}
          {/*  </View>*/}
          {/*</View>*/}
           <Swiper className='banner_box'
                   circular
                   autoplay>
             {userMomentsInfo.imageContent ? userMomentsInfo.imageContent.map((item,index) =>{
               return (

                 <SwiperItem key={index} style={{width:'100%',height:'100%'}}>
                   <View style={{width:'100%', height:'100%',backgroundAttachment:'fixed',background:`url(${userMomentsInfo.imageHost+item.key}) no-repeat 0 center/cover`}}>
                   </View>
                 </SwiperItem>
               )
             }) : null}
             {/*<View className='banner_index'>1/{userMomentsInfo&&userMomentsInfo.imageContent&&userMomentsInfo.imageContent.length}</View>*/}
             {userMomentsInfo.categoryName && <View className='banner_tag'>{userMomentsInfo.categoryName}</View>}
           </Swiper>
          <View className='Details_box'>
             <View className='Details_title'>
               {userMomentsInfo.title}
             </View>
             <View className='Details_body'>
               {userMomentsInfo.message}
             </View>
             <View className='Details_time'>
               {'编辑于'+userMomentsInfo.interactionTime}
             </View>
           </View>
          {userMomentsInfo.userType && userMomentsInfo.userType ==='merchant'?
           <View className='Merchant_box'>
              <View className='Merchant_Details clearfix'>
                <View className='Merchant_shopImg' style={{backgroundAttachment:'fixed',background:`url(${userMomentsInfo.merchantCover}) no-repeat 0 center/cover`}}></View>
                <View className='Merchant_shopDetails'>
                  <View className='Merchant_shopTitle'>
                    {userMomentsInfo.merchantName}
                  </View>
                  <View className='Merchant_shopPrice'>
                    ¥{userMomentsInfo.consumption}/人
                  </View>
                  <View className='Merchant_address '>
                    <Text className='Merchant_text1'>{userMomentsInfo.merchantTag}</Text>
                    <Text className='Merchant_text2'>{userMomentsInfo.districtName}</Text>
                    <Text className='Merchant_text3'>距你<Text className='spaceColor'> {userMomentsInfo.distanceRange}</Text>
                    </Text>
                  </View>
                </View>
              </View>
             {
               type !=='share' &&
               <View className='Merchant_btn' onClick={()=>Utils.goDown()}>
                 立即前往
               </View>
             }

            </View>:null}
           {getBean && <View className='bean_toast'>
             <View className='bean_toastIcon'  onClick={() => this.setState({getBean: false})}>
               <View className='bean_box'>
                 <View className='bean_title'>恭喜获得</View>
                 <View className='bean_num'><Text className='bean_getNum'>{userMomentsInfo.beanAmount}</Text>卡豆</View>
                 <View className='bean_btn'>确定</View>
               </View>
             </View>
           </View>}
        </View>
     )
  }
}
