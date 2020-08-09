import Taro, { Component } from '@tarojs/taro'
import { View,Text, Swiper,Image, SwiperItem} from '@tarojs/components'
import {AtToast} from "taro-ui"
import './index.scss'
import Utils from '../../utils/utils'
import {wxapiGet, wxapiPost} from '../../api/api'
import Ajax from '../../api/request'
import {inject, observer} from "@tarojs/mobx";
@inject('authStore')
@observer
class Index extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '首页',
    onReachBottomDistance:30,
  }
  constructor () {
    super(...arguments)
    this.state = {
      Toast: {
        status: '',
        text: '',
        isOpened: false,
        duration:5000
      },
      banner:{
        bannerType:'main',
      },
      bannerList:[],
      getMerchantAll: {
        filterType: '1', //过滤类型
        page: '1',  //起始页
        limit: 6,  //每页个数
        distance: '',  //距离分类
        categoryIds: ''  //分类
      },
      userMerchantList: [],
      userMomentsList:[],
      listMoment: {
        contentType: 'video',// video image
        categoryId: '',
        sortType: 'time',//time-时间 bean-卡豆
        distance: '',
        page: 1,
        limit: 10,
        syncType: '',
        syncSubTypeKey: '',
        'district-code': '330101'
      },//请求看分享参数
    }
  }
  componentDidShow() {
    this.getRequest();
    this.getLocation();
    this.getMerchantAll()
    // this.getShare()
  }
  getRequest() {
    Ajax({
        url: wxapiGet.wechatBanner,
        data: this.state.banner
      },'get').then(res=>{
          const { errMsg } = res
          if(errMsg && errMsg != 'request:ok'){
             this.errorToast('服务器异常')
          }
          else {
             const {success,resultDesc} = res.data
             if(success){
               const {content: {bannerList}} =res.data
               this.setState({
                 bannerList: bannerList,
               })
             }
             else {
               this.errorToast(resultDesc)
             }
          }
     })
  }
  saveMark (res){
    this.props.beanStore.setInit()
    let {result} = res
    result = result.split('?')[1]
    result = result.split('&')
    let merchantId = '';
    result.forEach(item =>{
      if(item.includes('merchantId')){
        merchantId=item.replace('merchantId=','')
      }
    })
    Ajax({
      data: {merchantId: merchantId},
      url: wxapiPost.wechatBeanMark,
    },'post').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success,resultCode, resultDesc} = res.data
          if (success) {
            let {content} = res.data
            this.props.beanStore.setMarkInfo(content)
            if(content.resultCode == '3018'){
              this.props.beanStore.setMerchantId({merchantId:merchantId})
              Utils.Toast('无法打卡，不在打卡范围内')
            }
            Utils.navigateTo('/pages/perimeter/beanMark/index')
          }
          else {
            this.props.beanStore.setCode(resultCode)
            this.props.beanStore.setMerchantId({merchantId:merchantId})
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  getLocation() {
    Taro.getLocation({
      type: 'wgs84',
      success: function (res) {
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        Taro.setStorageSync('lnt',longitude||120.26457)
        Taro.setStorageSync('lat',latitude||30.18534)
      },
      fail: res => {
        Utils.Toast('无法获取地理位置，请后台打开位置权限，体验更多功能')
      }
    })
  }
  getMerchantAll(){
    Ajax({
      data: {...this.state.getMerchantAll},
      url: wxapiGet.wechatSearchConditions
    }, 'get').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success, resultDesc} = res.data
          if (success) {
            let {content: {userMerchantList}} = res.data
            this.setState({
              userMerchantList,
            })
          } else {
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  golookShareById(Id) {
    const {listMoment:{contentType}} = this.state
    if(contentType ==='video'){
      Utils.navigateTo(`/pages/index/lookShare/shareVideo/index?momentId=${Id}`)
    }
    else {
      Utils.navigateTo(`/pages/index/lookShare/shareImage/index?momentId=${Id}`)
    }
  }
  getShare() {
    Ajax({data:this.state.listMoment,url:wxapiGet.wechatShare},'get')
      .then(res => {
        if(res.errMsg !== 'request:ok'||res.statusCode != '200'){
          Utils.Toast(res.data.error||res.errMsg)
        }
        else {
          const {data:{success ,content ,resultDesc} } = res
          if(success){
            this.setState({
              userMomentsList: content.userMomentsList,
            })
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      })
  }//http
  successToast(e) {
    this.setState({
      Toast: {
        status: 'success',
        text: e,
        isOpened: true
      }
    })
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
  render () {
    const {userMerchantList,userMomentsList} = this.state
    const { userInfo } = this.props.authStore
    const {status , isOpened , text ,duration} = this.state.Toast
    const setTag = (string) =>{
      if(typeof string ==='string'){
        return string.split(',').slice(0,2)
      }
    }
    return (
      <View className='index_box'>
        <View className='index_title'>
          {Object.keys(userInfo).length===0?
           <View className='index_title_information f'  onClick={()=>Utils.navigateTo('./../auth/index')}>
            <View className='index_title_informationImg'  >
              <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/iconindex.png'></Image>
            </View>
            <View className='index_user_details'>
              <View className='index_user_name'>欢迎登录</View>
              <View className='index_user_record'>让生活更有价值</View>
            </View>
           </View>
            :null}
          {Object.keys(userInfo).length>5 && userInfo.mobile.length ===11 ?
            <View className='index_title_information f' >
            <View className='index_title_informationImg'>
              <Image src={userInfo.profile}></Image>
            </View>
            <View className='index_user_details'>
              <View className='index_user_name'>{userInfo.username}</View>
              <View className='index_user_record'>让生活更有价值</View>
            </View>
          </View>:null}
          {Object.keys(userInfo).length>5 && userInfo.mobile.length !==11 ?
           <View className='index_title_information f'  onClick={()=>Utils.navigateTo('./../auth/index')}>
             <View className='index_title_informationImg'  >
              <Image src='https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/iconindex.png'></Image>
            </View>
             <View className='index_user_details'>
              <View className='index_user_name'>绑定手机号码</View>
              <View className='index_user_record'>让生活更有价值</View>
            </View>
          </View>:null}
        </View>
          {/*首页头部*/}
        <View className='index_body'>
          <View className='index_exercise f page_between'>
            <View className='index_exerciseTab index_exerciseTab_bg1' onClick={ () => Utils.navigateTo('/pages/index/perimeter/index')}>
              <View className='index_exercise_title'>
                到店打卡
              </View>
              <View className='index_exercise_golink index_golink_icon'>

              </View>
              <View className='index_exercise_coBg index_exercice_bg1'>

              </View>
            </View>
            <View className='index_exerciseTab index_exerciseTab_bg2' onClick={()=> Utils.goDown()}>
              <View className='index_exercise_title'>
                健康打卡
              </View>
              <View className='index_exercise_golink index_golink_icon'>

              </View>
              <View className='index_exercise_coBg index_exercice_bg2'>

              </View>
            </View>
            <View className='index_exerciseTab index_exerciseTab_bg3' onClick={()=> Utils.navigateTo('/pages/index/accustomed/index')}>
              <View className='index_exercise_title'>
                习惯打卡
              </View>
              <View className='index_exercise_golink index_golink_icon'>

              </View>
              <View className='index_exercise_coBg index_exercice_bg3'>

              </View>
            </View>
            {/*<View className='index_exercise_box index_exercise_one f page_between' onClick={ () => Utils.navigateTo('/pages/index/perimeter/index')}>*/}
            {/*  <View className='index_exercise_Activity'>*/}
            {/*    <View className='index_exercise_title'>*/}
            {/*      到店打卡*/}
            {/*    </View>*/}
            {/*    <View className='index_exercise_data'>*/}
            {/*      捡豆豆*/}
            {/*    </View>*/}
            {/*    <View className='index_exercise_link index_exercise_color'>*/}
            {/*      <View className='link_font'>GO</View>*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*  <View className='index_exercise_iconbox'>*/}
            {/*    <View className='index_exercise_icon index_exercise_iconImg'></View>*/}
            {/*  </View>*/}
            {/*</View>*/}
            {/*<View className='index_exercise_box index_exercise_two f page_between' onClick={()=> Utils.navigateTo('/pages/index/lookShare/index')}>*/}
            {/*  <View className='index_exercise_Activity'>*/}
            {/*    <View className='index_exercise_title'>*/}
            {/*      看分享*/}
            {/*    </View>*/}
            {/*    <View className='index_exercise_data'>*/}
            {/*      捡豆豆*/}
            {/*    </View>*/}
            {/*    <View className='index_exercise_link index_exercise_color'>*/}
            {/*      <View className='link_font'>GO</View>*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*  <View className='index_exercise_iconbox'>*/}
            {/*    <View className='index_exercise_icon index_exercise_iconImg'></View>*/}
            {/*  </View>*/}
            {/*</View>*/}
            {/*<View className='index_exercise_box index_exercise_three index_exercise_margin f page_between' onClick={()=> Utils.goDown()}>*/}
            {/*  <View className='index_exercise_Activity'>*/}
            {/*    <View className='index_exercise_title'>*/}
            {/*      健康打卡*/}
            {/*    </View>*/}
            {/*    <View className='index_exercise_data'>*/}
            {/*      捡豆豆*/}
            {/*    </View>*/}
            {/*    <View className='index_exercise_link index_exercise_color'>*/}
            {/*      <View className='link_font'>GO</View>*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*  <View className='index_exercise_iconbox'>*/}
            {/*    <View className='index_exercise_icon index_exercise_iconImg'></View>*/}
            {/*  </View>*/}
            {/*</View>*/}
            {/*<View className='index_exercise_box index_exercise_four index_exercise_margin f page_between'  onClick={()=> Utils.navigateTo('/pages/index/accustomed/index')}>*/}
            {/*  <View className='index_exercise_Activity'>*/}
            {/*    <View className='index_exercise_title'>*/}
            {/*      习惯打卡*/}
            {/*    </View>*/}
            {/*    <View className='index_exercise_data'>*/}
            {/*      捡豆豆*/}
            {/*    </View>*/}
            {/*    <View className='index_exercise_link index_exercise_color'>*/}
            {/*      <View className='link_font'>GO</View>*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*  <View className='index_exercise_iconbox'>*/}
            {/*    <View className='index_exercise_icon index_exercise_iconImg'></View>*/}
            {/*  </View>*/}
            {/*</View>*/}
          </View>
          {/*打卡部分*/}
          {/*<View className='index_notice'>*/}
          {/*  <View className='index_notice_box f page_between'>*/}
          {/*    <View className='index_notice_left f'>*/}
          {/*      <View className='index_notice_img'>*/}

          {/*      </View>*/}
          {/*      <View className='index_notice_font'>*/}
          {/*        <View className='index_notice_fontContext'>*/}
          {/*          打卡捡豆豆，豆豆去消费<Text>3小时前</Text>*/}
          {/*        </View>*/}
          {/*        <View className='index_notice_fontContext'>*/}
          {/*          清爽一夏，新用户注册即可获得...<Text>4小时前</Text>*/}
          {/*        </View>*/}
          {/*      </View>*/}
          {/*    </View>*/}
          {/*    <View  className='index_notice_right'>*/}

          {/*    </View>*/}
          {/*  </View>*/}
          {/*</View>*/}
          {/*通知部分*/}
          <Swiper className='index_banner'
                  circular
                  indicatorDots
                  autoplay>
            {this.state.bannerList.length>0 ? this.state.bannerList.map((item,index) =>{
              return (
                <SwiperItem key={item.id}>
                  <Image src={item.coverImg}> </Image>
                </SwiperItem>
              )
            }):null}
          </Swiper>
          {/*轮播图部分*/}
          <View className='page_goLink'>
            <View className="page_goLink_left" >
               附近打卡门店捡豆数量排行
            </View>
            <View className='page_goLink_right' onClick={() =>Utils.navigateTo('/pages/index/perimeter/index')}>
                 查看全部
            </View>
          </View>
          <View className='page_golink_box'>
            {userMerchantList.length> 0 && userMerchantList.map((item,index) =>{
              return (
                index<3?
                  <View key={item.merchantId} className='MerchantDetails_style f' key={item.merchantId} onClick={ () => Utils.navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${item.merchantId}`)}>
                    {item.markFlag== '1' &&
                    <View className='MerchantDetails_toastBean MerchantDetails_toastBeanStyle1'>
                      打卡得<Text>{item.markBean}</Text>
                    </View>}
                    {item.markFlag== '1' &&
                    <View className='MerchantDetails_takecard MerchantDetails_takeCardStyle1'
                          onClick={(e) =>{
                            e.preventDefault()
                            e.stopPropagation()
                            Utils.setHttpCode(this.saveMark.bind(this))}}>
                      我要打卡
                    </View>}
                    <View className='MerchantDetails_Img' style={{background:`url(${item.coverImg}) no-repeat center/cover`}}>
                    </View>
                    <View className='MerchantDetails_information'>
                      <View className='MerchantDetails_name'>
                        {item.merchantName}
                      </View>
                      <View className='MerchantDetails_tag'>
                        {item.tag && setTag(item.tag).map((items,indexs) =>{
                          return (
                            <View key={indexs} className='MerchantDetails_tagStyle MerchantDetails_tagStyleColor1'>{items}</View>
                          )
                        })}

                      </View>
                      <View className='MerchantDetails_takeCardnum'>
                        <Text className='MerchantDetails_numStyleColor1'>{item.markAmount}人</Text>已打卡
                      </View>
                      <View className='MerchantDetails_takeLimit'>
                        距您{item.distanceRange}
                      </View>
                    </View>
                  </View>
                  :<View key={item.id} className='MerchantDetails_style f' key={item.merchantId} onClick={ () => Utils.navigateTo(`/pages/perimeter/merchantDetails/index?merchantId=${item.merchantId}`)}>
                    {item.markFlag== '1' &&
                    <View className='MerchantDetails_toastBean MerchantDetails_toastBeanStyle2'>
                      打卡得<Text>{item.markBean}</Text>
                    </View>}
                    {item.markFlag== '1' &&
                    <View className='MerchantDetails_takecard MerchantDetails_takeCardStyle2'
                          onClick={(e) =>{
                            e.preventDefault()
                            e.stopPropagation()
                            Utils.setHttpCode(this.saveMark.bind(this))}}>
                      我要打卡
                    </View>}

                    <View className='MerchantDetails_Img' style={{background:`url(${item.coverImg}) no-repeat center/cover`}}>
                    </View>
                    <View className='MerchantDetails_information'>
                      <View className='MerchantDetails_name'>
                        {item.merchantName}
                      </View>
                      <View className='MerchantDetails_tag'>
                        {item.tag && setTag(item.tag).map((items,indexs) =>{
                          return (
                            <View key={indexs} className='MerchantDetails_tagStyle MerchantDetails_tagStyleColor2' >{items}</View>
                          )
                        })}

                      </View>
                      <View className='MerchantDetails_takeCardnum'>
                        <Text className='MerchantDetails_numStyleColor2'>{item.markAmount}人</Text>已打卡
                      </View>
                      <View className='MerchantDetails_takeLimit'>
                        距您{item.distanceRange}
                      </View>
                    </View>
                  </View>
              )
            })}
          </View>
          {/*<View className='page_goLink'>*/}
          {/*  <View className="page_goLink_left">*/}
          {/*    看分享捡豆数量排行*/}
          {/*  </View>*/}
          {/*  <View className='page_goLink_right'  onClick={() =>Utils.navigateTo('/pages/index/lookShare/index')}>*/}
          {/*    查看全部*/}
          {/*  </View>*/}
          {/*</View>*/}
          {/*<View className='page_golink_box'>*/}
          {/*  <View className='lookshare_bodyBox'>*/}
          {/*    {userMomentsList.map(item =>{*/}
          {/*      if(typeof item.syncSubType === 'string' && item.syncSubType.length > 0 ){*/}
          {/*        item.syncSubType = item.syncSubType.split(',')*/}
          {/*      }*/}
          {/*      const ImgScale = item.frontImageHeight/item.frontImageWidth*/}
          {/*      return (*/}
          {/*        <View key={item.id} className='lookshare_VideoAll' onClick={() => this.golookShareById(item.momentId)}>*/}
          {/*          <View className='lookshare_Img' style={ImgScale=='1'?{background:`url(${item.frontImage}) no-repeat 100% 100%`} : {backgroundAttachment:'fixed',background:`url(${item.frontImage}) no-repeat 0 center/cover`}}>*/}
          {/*            {item.categoryName.length > 0 ? <View className='lookshare_tagType'>{item.categoryName}</View>: null}*/}
          {/*            {item.contentType==='video'? <View className='lookshare_VideoIcon'></View> : null}*/}
          {/*            {item.beanFlag&&item.watchStatus== '0'&&*/}
          {/*            <View className='lookshare_beanNum'>*/}
          {/*              {listMoment.contentType==='video'?'观看可得':'阅读可得'}<Text className='lookshare_num'>{item.beanAmount}</Text>*/}
          {/*            </View>}*/}
          {/*            {item.beanFlag && item.watchStatus!= '0'&&*/}
          {/*            <View className='lookshare_beanNum' style={{background:'rgba(165, 165, 165, 1)'}}>*/}
          {/*              已领取<Text className='lookshare_num'>{item.beanAmount}</Text>*/}
          {/*            </View>}*/}
          {/*          </View>*/}
          {/*          <View className='lookshare_ImgTitle'>*/}
          {/*            {item.title}*/}
          {/*          </View>*/}
          {/*          {item.address && item.address.length>0? <View className='lookshare_accress'>*/}
          {/*            <View className='lookshare_accressBox'>*/}
          {/*              {item.address}*/}
          {/*            </View>*/}
          {/*          </View> : null }*/}
          {/*          {item.syncSubType.length > 0 ?  <View className='lookshare_tag'>*/}
          {/*            {item.syncSubType.length > 0 && item.syncSubType.map((tag , index) =>{*/}
          {/*              return (*/}
          {/*                <View key={index} className='tag_Details'>*/}
          {/*                  {tag}*/}
          {/*                </View>*/}
          {/*              )*/}
          {/*            })}*/}
          {/*          </View> : null }*/}
          {/*          <View className='lookshare_user cleanfix'>*/}
          {/*            <View className='lookshare_userImg' style={{background:`url(${item.userProfile}) no-repeat 0 center/cover`}}></View>*/}
          {/*            <View className='lookshare_username' style={item.contentType !== 'video'?{  maxWidth: Taro.pxTransform(120),overflowX: 'hidden',whiteSpace: 'nowrap',textOverflow:'ellipsis'}:{}}>{item.username}</View>*/}
          {/*            {item.contentType !== 'video'?*/}
          {/*              <View className='lookshare_imageText lookshare_data'>*/}
          {/*                <View>距你<Text className='lookshare_blue'>{item.distanceRange}</Text></View>*/}
          {/*              </View>*/}
          {/*              :*/}
          {/*              null}*/}
          {/*          </View>*/}
          {/*          {item.contentType==='video'?<View className='lookshare_data cleanfix'>*/}
          {/*            <View>距你<Text className='lookshare_blue'>{item.distanceRange}</Text></View>*/}
          {/*            <View><Text className='lookshare_blue'>{item.viewAmount}人</Text>已观看</View>*/}
          {/*          </View>:null}*/}
          {/*        </View>*/}
          {/*      )*/}
          {/*    })}*/}
          {/*  </View>*/}
          {/*</View>*/}
        </View>
        <AtToast
          status={status}
          isOpened={isOpened}
          text={text}
          duration={duration}></AtToast>
          {/*首页内容*/}
      </View>
    )
  }
}

export default Index
