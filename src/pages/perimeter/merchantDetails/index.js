import React, { Component } from 'react'
import Taro ,{getCurrentInstance} from '@tarojs/taro'
import {View, Text, Swiper, Image, SwiperItem, Button} from '@tarojs/components'
import Utils from './../../../utils/utils'
import {wxapiGet} from './../../../api/api'
import Ajax from './../../../api/request'
import './merchantDetails.scss'
import './../../index/lookShare/shareVideo/index.scss'
class MerchantDetails extends Component{
  constructor () {
    super(...arguments)
    this.state ={
      merchantId: getCurrentInstance().router.params,
      banner:{
        bannerType: 'merchant',
        merchantId: getCurrentInstance().router.params.merchantId||'2441',
      },
      userMerchant: {},
      bannerList:[],
      goodsList:[],
      userInfo: {
        userId: getCurrentInstance().router.params.shareUserId||''
      },
      type: getCurrentInstance().router.params.type || '',
      shareUserProfile: '',
      shareUserName: ''
    }
  }
  componentWillMount(){
    this.getUserLocation();
  }
  componentDidShow() {
    Taro.hideHomeButton();
    this.getUserInfos()
  }
  getRequestAll(){
    Promise.all([this.getBannerList(),this.getMerchantById(),this.getListRecommend()]).then(
      res=>{
        let errMsg1  = res[0].errMsg
        let errMsg2  = res[1].errMsg
        let errMsg3  = res[2].errMsg
        if(errMsg1 === 'request:ok' && errMsg2 === 'request:ok'&& errMsg3 === 'request:ok'){
          let success1 =  res[0].data.success
          let success2 =  res[1].data.success
          let success3 =  res[2].data.success
          if(success1 && success2&& success3){
            const { content: {bannerList}} =res[0].data
            const { content: {userMerchant}} =res[1].data
            const { content: {goodsList}} =res[2].data
            this.setState({
              bannerList,
              userMerchant,
              goodsList,
            })
          }
          else {
            Utils.Toast(res[0].data.resultDesc || res[1].data.resultDesc || res[2].data.resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e.toString())
    })
  }
  getMerchantById(){
    const  {merchantId}  =this.state
     return  Ajax({
        data: merchantId,
        url: wxapiGet.wechatGetUserMerchant
      }, 'get')
  }
  getBannerList(){
    const { banner } =this.state
    return  Ajax({
      data: banner,
      url: wxapiGet.wechatUserBanner
    }, 'get')
  }
  getListRecommend(){
    const { merchantId } =this.state
    return  Ajax({
      data: merchantId,
      url: wxapiGet.wechatListRecommend
    }, 'get')
  }
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
  distance(la1, lo1, la2, lo2) {
    let La1 = la1 * Math.PI / 180.0;
    let La2 = la2 * Math.PI / 180.0;
    let La3 = La1 - La2;
    let Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
    let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
    s = s * 6378.137;
    s = s.toFixed(1);
    if(s>5){
      s = `距你${s}km，建议打车`
    }
    else if(s>1&&s<5){
      s = `距你${s}km，骑行约${parseInt(s/0.25)}分钟`
    }
    else {
      s = `距你${s*1000}m，步行约${parseInt(s*1000/75)}分钟`
    }
    return s||'暂无';
  }
  onShareAppMessage(options) {
    // 设置转发内容 -- 适用于: 页面右上角 ... 和 页面按钮
    const { userMerchant,bannerList }  = this.state
    var shareObj = {
      title: `${userMerchant.merchantName}`,
      imageUrl: `${bannerList[0]||''}`,
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
    const {  userMerchant,bannerList }  =this.state
    return {
      title: `${userMerchant.merchantName}`,
      imageUrl: `${bannerList[0]||''}`,
    }
  }
  getUserLocation = () => {
    let that = this;
    Taro.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          Taro.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                Taro.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                Taro.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      that.getLocation();
                    } else {
                      Taro.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          that.getLocation();
        } else {
          //调用wx.getLocation的API
          that.getLocation();
        }
      },
      complete: (res) =>{
         that.getLocation();
      }
    })
  }
  // 获取定位当前位置的经纬度
  getLocation = () => {
    let that = this;
    Taro.getLocation({
      type: 'wgs84',
      success: res =>{
        Taro.setStorageSync('lnt',res.longitude)
        Taro.setStorageSync('lat',res.latitude)
      },
      fail: function (res) {
      },
      complete: res => {
        that.getRequestAll();
      }
    })
  }
  // 获取当前地理位置
  render() {
    const {merchantId, userMerchant ,bannerList, goodsList ,type ,shareUserProfile,shareUserName} =this.state
    return(
      <View className='merchantBox'>
        {type == 'share' && <View className = 'page_share_download'>
          <View className = 'page_share_downloadBox'>
            <View className='page_share_userDetails'>
              <View className= 'page_share_profile' style={{background:`url(${shareUserProfile}) no-repeat center/cover`}}></View>
              <View className= 'page_share_userBox'>
                <View className='page_share_userName'>{shareUserName}</View>
                <View className='page_share_userTitle'>"我在哒卡乐发现了一家实惠的店铺"</View>
              </View>
            </View>
            <View  className='page_share_btn'>
              <Button
                appParameter={JSON.stringify({jumpUrl: 'shopDetailPage',id: merchantId.merchantId,type : 'jumpToPage',
                  jumpType : "native" ,path:'DKLShopDetailViewController',params:{shopId: merchantId.merchantId}})}
                openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle'>打开APP</Button>
            </View>
          </View>
        </View>}
        {type == 'share' && <View className='page_share_openApp'>
          <Button   appParameter={JSON.stringify({jumpUrl: 'shopDetailPage',id: merchantId.merchantId,type : 'jumpToPage',
                    jumpType : "native" ,path:'DKLShopDetailViewController',params:{shopId: merchantId.merchantId}})}
                   openType='launchApp'
                   onError={(e) =>this.goAppError(e)} className='page_share_btnStyle1'>App内打开</Button>
        </View>}
        <View className='merchant_title'>
          <Swiper
            circular
            autoplay
            className='merchant_banner'>
             {bannerList.map((item,index) =>{
               return (
                 <SwiperItem className='bannerList' key={item.id}>
                   <Image style={{height:'100%',width:'100%',background:`url(${item.coverImg}) no-repeat center/cover`}}></Image>
                 </SwiperItem>
               )
             })}
          </Swiper>
        </View>
        {/*//回退和轮播*/}
        <View className='merchant_Details'>
          {/*//商家详细信息*/}
          <View className='merchant_shop'>
            <View className='merchant_shop_nav'>
              {userMerchant.bespeakStatus&&<View className='merchant_shop_yuding' onClick={() =>Utils.goDown()}></View>}
              <View className='merchant_shop_Title'>{userMerchant.merchantName}<Text>¥</Text><Text>{userMerchant.perCapitaConsumption}/人</Text></View>
              <View className='merchant_shop_accress'>
                <Text className='merchant_shop_titleTab'>{userMerchant.cuisine}</Text>
                {userMerchant.cuisine&&userMerchant.businessHub &&<View></View>}
                <Text className='merchant_shop_titleTab'>{userMerchant.businessHub}</Text>
              </View>
            </View>
            <View className='merchant_shop_nav'  onClick={() =>Utils.goDown()}>
              <View className='merchant_shop_yingyeGo'>
              </View>
              <View className='merchant_shop_status'>
                <View className='merchant_shop_statusTime'>{userMerchant.businessStatus?'营业中':'休息中'}<View></View>{userMerchant.businessTime}</View>
              </View>
              <View className='merchant_shop_tag'>
                {userMerchant.services&&userMerchant.services.map((item,index) =>{
                  return (
                  index<3 && <View key={index}>{item}</View>
                  )
                }) }
              </View>
            </View>
            <View className='merchant_shop_nav'>
              <View className='merchant_shop_dianhua'></View>
              <View className='merchant_shop_bear'>
                   <View>{userMerchant.address}</View>
              </View>
              <View className='merchant_shop_space'>
                {this.distance(Taro.getStorageSync('lat'),Taro.getStorageSync('lnt'),userMerchant.lat,userMerchant.lnt)}
              </View>
            </View>
            {userMerchant.shareFlag== '1' || userMerchant.markFlag =='1' ?
            <View className='merchant_bean_flag'>
            {userMerchant.shareFlag == '0' && userMerchant.markFlag == '1' && <View className='merchant_takeCard1 merchant_bg1' onClick={() =>Utils.goDown()}>
              <View className='merchant_lookbean'>
              到店打卡可捡
              </View>
              <View className='merchant_lookbtn merchant_btnColor1'>
              <Text className='merchantFont_bold'>{userMerchant.markBean||'0'}</Text>
              <Text className='merchantFont_bfont'>卡豆</Text>
              </View>
              </View>}
            {userMerchant.shareFlag == '1' && userMerchant.markFlag == '0' && <View className='merchant_takeCard1 merchant_bg2' onClick={() =>Utils.goDown()}>
              <View className='merchant_lookbean'>
              看商家分享可捡
              </View>
              <View className='merchant_lookbtn merchant_btnColor2'>
              <Text className='merchantFont_bold'>{userMerchant.shareSumBean||'0'}</Text>
              <Text className='merchantFont_bfont'>卡豆</Text>
              </View>
              </View>}
            {userMerchant.shareFlag == '1' && userMerchant.markFlag == '1' &&
            <View className='merchant_takeCard1 merchant_takeCard2'>
              <View  className='merchant_takeCardAllbox merchant_bg3' onClick={() =>Utils.goDown()}>
                <View style={{height:Taro.pxTransform(25)}} className='merchant_bg_title'>
                  到店打卡可捡
                </View>
                <View style={{marginTop:Taro.pxTransform(16),display: 'inline-block',marginLeft:Taro.pxTransform(20)}} className='merchant_lookbtn merchant_btnColor1'>
                  <Text className='merchantFont_bold'>{userMerchant.markBean||'0'}</Text>
                  <Text  style={{display: 'inline-block',verticalAlign:'top'}} className='merchantFont_bfont'>卡豆</Text>
                </View>
              </View>
              <View className='merchant_takeCardAllbox merchant_bg4' onClick={() =>Utils.goDown()}>
                <View style={{height:Taro.pxTransform(25)}} className='merchant_bg_title'>
                  看商家分享可捡
                </View>
                <View style={{marginTop:Taro.pxTransform(16),display: 'inline-block',marginLeft:Taro.pxTransform(20)}} className='merchant_lookbtn merchant_btnColor2'>
                  <Text className='merchantFont_bold'>{userMerchant.shareSumBean||'0'}</Text>
                  <Text   style={{display: 'inline-block',verticalAlign:'top'}} className='merchantFont_bfont'>卡豆</Text>
                </View>
              </View>
            </View>}
              </View>:null}
          </View>
            {/*//商家点餐*/}
          {userMerchant.topCategoryValue == 'repast' && <View className='merchant_order'>
            <View className='merchant_orderTitle'>
              查看商品
            </View>
            <View className='merchant_orderBtn' onClick={() =>Utils.goDown()}>
              查看
            </View>
          </View>}
            {/*//商家详情和打卡*/}
          {goodsList&&goodsList.length>0&&<View className='merchant_cook'>
            <View className='merchant_cook_title'>
              <View>推荐商品</View>
              <View onClick={() =>Utils.goDown()}>查看更多</View>
            </View>
            <View className='merchant_cook_Details'>
              <View className='merchant_cook_Img'>
                {goodsList.map(item =>{
                  return (
                    <View key={item.id} className='merchant_cook_ImgBox'>
                      <View style={{background:`url(${item.goodsImg}) no-repeat center/cover`}}>
                      </View>
                      <View>
                        {item.goodsName}
                      </View>
                    </View>
                  )
                })}
              </View>
            </View>
          </View>}
            {/*//商家推荐菜*/}
        </View>
      </View>
    )
  }
}
export default MerchantDetails
