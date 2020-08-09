import Taro from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, Button} from '@tarojs/components'
import {wxapiGet,wxapiPost} from './../../../../api/api'
import Ajax from './../../../../api/request'
import Utils from "./../../../../utils/utils";
import './index.scss'
import './../shareVideo/index.scss'
export default class ShareImage extends Taro.Component{
  defaultProps = {}
  constructor() {
    super(...arguments);
    this.state = {
      getUserMomentDetail : {
        momentId: this.$router.params.momentId || '2443' //路由参数
       },//req 请求参数
      userMomentsInfo:{
      }, //req 数据
      getBean:false, //弹框
      userInfo: {
        userId: this.$router.params.shareUserId||''
      },
      type: this.$router.params.type || '',
      shareUserProfile: '',
      shareUserName: ''
    }
  }
  config = {
    navigationStyle:'default',
    navigationBarTitleText: '图文详情'
  }
  componentDidMount() {
    Taro.hideHomeButton();
    this.getUserInfos()
    this.getUserMomentDetails() //初始化
  }
  saveBean(){
    Ajax({
      data: { momentId: this.$router.params.momentId},
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
       if(time == 0 ){
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
  render() {
    const { userMomentsInfo ,time ,getBean,type,shareUserProfile,shareUserName} = this.state
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
                 <Button openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle'>打开APP</Button>
               </View>
             </View>
           </View>}
           {type == 'share' && <View className='page_share_openApp'>
             <Button openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle1'>App内打开</Button>
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
                 <SwiperItem key={index} style={{backgroundAttachment:'fixed',background:`url(${userMomentsInfo.imageHost+item.key}) no-repeat 0 center/cover`}}>

                 </SwiperItem>
               )
             }) : null}
             <View className='banner_index'>1/{userMomentsInfo.imageContent.length}</View>
             {userMomentsInfo.categoryName.length>0 && <View className='banner_tag'>{userMomentsInfo.categoryName}</View>}
           </Swiper>
          <View className='Details_box'>
             <View className='Details_title'>
               {userMomentsInfo.title}
             </View>
             <View className='Details_body'>
               {userMomentsInfo.message}
             </View>
             <View className='Details_time'>
               {userMomentsInfo.interactionTime}
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
