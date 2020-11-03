import React, { Component } from 'react'
import Taro ,{getCurrentInstance} from '@tarojs/taro'
import {ScrollView, Text, View} from '@tarojs/components'
import Banner from '@/components/banner'
import {coupons,shopDetails,billboard,exploreShop} from '@/components/publicShopStyle'
import {wxapiGet} from '@/api/api'
import {httpGet} from '@/api/newRequest'
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
  GetDistance,
  filterSetting
} from '@/common/utils'
import './merchantDetails.scss'
class MerchantDetails extends Component{
  constructor () {
    super(...arguments)
    this.state ={
      merchantHttpData: {merchantId: getCurrentInstance().router.params.merchantId},
      banner:{
        bannerType: 'merchant',
        merchantId:getCurrentInstance().router.params.merchantId
      },
      userMerchant: {},
      bannerList:[],
      userMerchantInfo:{},
      userInfo: {
        userId: getCurrentInstance().router.params.shareUserId||''
      },
      type: getCurrentInstance().router.params.type || '',
      lnt: Taro.getStorageSync('lnt'),
      lat: Taro.getStorageSync('lat'),
    }
  }
  componentWillMount(){
  }
  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  componentDidShow() {
    this.getBannerList()
    this.getListRecommend()
    this.getMerchantById()
  }

  getMerchantById(){
    const  {merchantHttpData}  =this.state
     return httpGet({
        data: merchantHttpData,
        url: wxapiGet.wechatGetUserMerchant
      }, res => {
       const {userMerchant} = res
       this.setState({
         userMerchantInfo:userMerchant
       })
     })
  }
  getBannerList(){
    const { banner } =this.state
    httpGet(
      {
        data: banner,
        url: wxapiGet.wechatUserBanner
      },res =>{
        const {bannerList} =  res
        this.setState({
          bannerList
        })
      }
    )
  }
  getListRecommend(){
    const { merchantHttpData } =this.state
    return  httpGet({
      data: merchantHttpData,
      url: wxapiGet.wechatListRecommend
    },res  => {
      this.setState({
        userMerchant: res
      })
    })
  }
  goAppError(e){
    Utils.goDown();
  }
  // onShareAppMessage(options) {
  //   // 设置转发内容 -- 适用于: 页面右上角 ... 和 页面按钮
  //   const { userMerchant,bannerList }  = this.state
  //   var shareObj = {
  //     title: `${userMerchant.merchantName}`,
  //     imageUrl: `${bannerList[0]||''}`,
  //     success: function(res) {
  //       // 转发成功之后的回调
  //       if (res.errMsg == 'shareAppMessage:ok') {
  //         Utils.Toast('转发成功')
  //       }
  //     },
  //     fail: function(res) {
  //       // 转发失败之后的回调
  //       if (res.errMsg == 'shareAppMessage:fail cancel') {
  //         // 用户取消转发
  //         Utils.Toast('取消转发')
  //       } else if (res.errMsg == 'shareAppMessage:fail') {
  //         // 转发失败，其中 detail message 为详细失败信息
  //         Utils.Toast('转发失败')
  //       }
  //     },
  //     complete: function() {
  //       // 转发结束之后的回调（转发成不成功都会执行）
  //       console.log('---转发完成---');
  //     }
  //   };
  //   return shareObj;
  // }
  // onShareTimeline(){
  //   const {  userMerchant,bannerList }  =this.state
  //   return {
  //     title: `${userMerchant.merchantName}`,
  //     imageUrl: `${bannerList[0]||''}`,
  //   }
  // }
  render() {
    const { userMerchant, userMerchant: {merchantCoverImg,merchantName},bannerList,
      userMerchantInfo:{
        businessStatus,
        businessTime,
        allImgs,
        services,
        address,
        provinceName,
        cityName,
        districtName,
        lat,
        lnt
      }} =this.state
    return(
      <View className='merchantBox'>
        <Banner
          autoplay={[{coverImg: merchantCoverImg}].length>1?true:false}
          imgStyle
          data = {[{coverImg: merchantCoverImg}]}
          imgName = {'coverImg'}
          style = {{width:'100%' , height: Taro.pxTransform(440)}}
          boxStyle={{width:'100%' , height:  Taro.pxTransform(440)}}
        ></Banner>
        <View className='merchantDetails_shop'>
          <View className='merchant_name font_noHide'>
            {merchantName}
          </View>
          <View className='merchant_desc'>
            「萧山商圈·西餐 人均98元」
          </View>
          <View className='merchant_tag'>
            <View className='merchat_tag_box'>
              人气商家
            </View>
            <View className='merchat_tag_box'>
              西餐TOP10
            </View>
          </View>
          <ScrollView
            scrollX
            className='merchant_shopImg'>
            {bannerList.map(item => {
              return (<View className='shopImgBox' style={{...backgroundObj(item.coverImg)}}></View>)
            })}
          </ScrollView>
          <View className ='share_btn public_center'>
            <View className='share_icon'></View>
            <View>看商家分享捡豆</View>
          </View>
          <View className='merchant_shop_details'>
            <View className='merchat_time'>
              <View className='merchant_time_go'></View>
              <View className='merchant_time_box'>
                <View  className='merchant_bisinissStatus'>
                  <Text>
                    {businessStatus==='0'?'休息中 | ':'营业中 | '}
                  </Text>
                  <Text style={{color:'rgba(153, 153, 153, 1)'}}>{businessTime}</Text>
                </View>
                <View className='merchant_time_tags'>
                  {services&&services.map((item,index) =>{
                    if(index<3){
                      return (
                        <View className={'merchant_tag_shop'}>{item}</View>
                      )
                    }
                  })}
                </View>
              </View>
            </View>
            <View className='merchat_city_accress'>
              <View className='merchant_accBox'>
                <View className='merchant_city_icon1'></View>
                <View className='merchant_city_icon2'></View>
                <View className='merchant_city_icon3'></View>
              </View>
              <View className='merchat_city_details'>
                <View className='merchat_city_names font_hide'>
                  {districtName+address}
                </View>
                <View className='merchat_city_limit'>
                  距您{GetDistance(this.state.lat,this.state.lnt,lat,lnt)}，{filterSetting(GetDistance(this.state.lat,this.state.lnt,lat,lnt))}
                </View>
              </View>
            </View>
          </View>

        </View>
        <View className='merchant_active'>
          <View className='merchant_active_title'>
            <View className='merchant_active_iconBox active_icon1'>

            </View>
            <View className='merchant_active_biaoti'>
              到店优惠
            </View>

          </View>
          <View className='merchant_active_dec'>
            店铺超级优惠权益 到店消费直接抵扣
          </View>
          <View className='active_go'></View>
        </View>
        {coupons()}
        {coupons()}
        {coupons()}
        <View className='merchant_active'>
          <View className='merchant_active_title'>
            <View className='merchant_active_iconBox active_icon2'>

            </View>
            <View className='merchant_active_biaoti'>
              特价活动
            </View>

          </View>
          <View className='merchant_active_dec'>
            店铺超限时特价活动 限时限量
          </View>
          <View className='active_go'></View>
        </View>
        <ScrollView
          scrollX
          className = 'merchant_newPrice'
        >
          {shopDetails()}
          {shopDetails()}
          {shopDetails()}
          {shopDetails()}
          {shopDetails()}
          {shopDetails()}
          {shopDetails()}
          {shopDetails()}
        </ScrollView>

        <View className='merchant_active'>
          <View className='merchant_active_title'>
            <View className='merchant_active_iconBox active_icon3'>

            </View>
            <View className='merchant_active_biaoti'>
              商品橱窗
            </View>
          </View>
          <View className='merchant_active_dec'>
            本店商品展示
          </View>
        </View>
        <ScrollView
          scrollX
          className = 'merchant_billboard'
        >
          {billboard()}
          {billboard()}
          {billboard()}
          {billboard()}
        </ScrollView>
        <View className='merchant_active'>
          <View className='merchant_active_title'>
            <View className='merchant_active_iconBox active_icon4'>

            </View>
            <View className='merchant_active_biaoti'>
              探店分享
            </View>

          </View>
          <View className='merchant_active_dec'>
            哒人分享 精彩推荐
          </View>
        </View>
        {exploreShop()}
        <View className='merchant_layer'>
          <View className='merchant_layer_btn'>
            <View className='merchant_layer_btn1'>
              <View className='merchant_layer_btnBox merchant_layer_btnIcon1'></View>
              <View>买单</View>
            </View>
            <View className='merchant_layer_limit'></View>
            <View className='merchant_layer_btn2'>
              <View className='merchant_layer_btnBox merchant_layer_btnIcon2'></View>
              <View>到店打卡</View>
            </View>
            <View className='merchant_layer_limit'></View>
            <View className='merchant_layer_btn2'>
              <View className='merchant_layer_btnBox merchant_layer_btnIcon3'></View>
              <View>关注</View>
            </View>
          </View>
          <View className='merchant_shop'>立即预约</View>
        </View>
      </View>
    )
  }
}
export default MerchantDetails
