import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {ScrollView, Text, View} from '@tarojs/components'
import Banner from '@/components/banner'
import {coupons, billboard, exploreShop,shopDetails} from '@/components/publicShopStyle'
import MarkPhone from '@/components/payTelephone'
import {wxapiGet, perimeter} from '@/api/api'
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
  filterSetting,
  filterStrList,
  getLat,
  getLnt
} from '@/common/utils'
import './merchantDetails.scss'
import {httpPost} from "../../../api/newRequest";
import {AtActionSheet} from "taro-ui";

class MerchantDetails extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      merchantHttpData: {merchantId: getCurrentInstance().router.params.merchantId },
      banner: {
        bannerType: 'merchant',
        merchantId: getCurrentInstance().router.params.merchantId
      },
      userMerchant: {},
      bannerList: [],
      userMerchantInfo: {},
      userInfo: {
        userId: getCurrentInstance().router.params.shareUserId
      },
      getMerchantDetails: {
        merchantId: getCurrentInstance().router.params.merchantId,
        page: 1,
        limit: 5,
      },
      type: getCurrentInstance().router.params.type,
      kolMomentsList: [],
      countStatus: true,
      visible: false,
      specialGoodsList: [],
      goodsList:[]
    }
  }

  componentWillMount() {
  }

  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }

  componentDidShow() {
    this.getBannerList()
    this.getListRecommend()
    this.getMerchantById()
    this.getMerchantDetails()
    this.getGoodList()
  }
  getGoodList() {
    const {merchantDetails: {getListMerchant}} = perimeter
    return httpGet({
      data: { merchantId: getCurrentInstance().router.params.merchantId},
      url: getListMerchant
    }, res => {
      const {goodsList} = res
      this.setState({
        goodsList
      })
    })
  }
  getMerchantDetails() {
    const {merchantDetails: {getMomentByMerchantId}} = perimeter
    const {getMerchantDetails, countStatus} = this.state
    return httpGet({
      data: getMerchantDetails,
      url: getMomentByMerchantId
    }, res => {
      const {kolMomentsList} = res
      if (kolMomentsList && kolMomentsList.length > 0) {
        return this.setState({
          kolMomentsList: [...this.state.kolMomentsList, ...kolMomentsList]
        })
      }
      return this.setState({
        countStatus: false
      })
    })
  }
  //获取商家信息
  getMerchantById() {
    const {merchantHttpData} = this.state
    return httpGet({
      data: merchantHttpData,
      url: wxapiGet.wechatGetUserMerchant
    }, res => {
      const {userMerchant} = res
      console.log(res)
      this.setState({
        userMerchantInfo: {...userMerchant}
      },res => {
        this.getMerchantLove()
      })
    })
  }
  getBannerList() {
    const {banner} = this.state
    httpGet(
      {
        data: banner,
        url: wxapiGet.wechatUserBanner
      }, res => {
        const {bannerList} = res
        console.log(res)
        this.setState({
          bannerList
        })
      }
    )
  }
  //获取商家轮播图
  getListRecommend() {
    const {merchantHttpData} = this.state
    return httpGet({
      data: merchantHttpData,
      url: wxapiGet.wechatListRecommend
    }, res => {
      this.setState({
        userMerchant: res,
      })
    })
  }
  getMerchantLove() {
    const { userMerchantInfo:{merchantId}} = this.state
    const {getMerchantSpecialGoods} = perimeter
    httpGet({
      url: getMerchantSpecialGoods,
      data: {
        merchantId: merchantId,
        page: 1,
        limit: 6
      }
    }, res => {
      const {specialGoodsList} =res
    })
  }
  //获取商家猜你喜欢
  onReachBottom() {
    const {getMerchantDetails, countStatus} = this.state
    if (countStatus) {
      this.setState({
        getMerchantDetails: {
          ...getMerchantDetails,
          page: getMerchantDetails.page + 1
        },
      }, res => {
        this.getMerchantDetails()
      })
    } else {
      return toast('暂无数据')
    }

  }//上拉加载
  render() {
    const {
      userMerchant,
      userMerchant:
        {merchantCoverImg,
          merchantName,
          tag,
          businessHub,
          topCategoryValue,
          cuisine,
          perCapitaConsumption
        },
      bannerList,
      userMerchantInfo,
      userMerchantInfo: {
        businessStatus,
        businessTime,
        allImgs,
        services,
        address,
        provinceName,
        cityName,
        districtName,
        lat,
        lnt,
        userIdString,
        telephone,
        merchantFollowStatus
      },
      kolMomentsList,
      visible,
      specialGoodsList,
      goodsList
    } = this.state
    return (
      <View className='merchantBox'>
        <Banner
          autoplay={bannerList.length > 1 ? true : false}
          imgStyle
          data={bannerList}
          imgName={'coverImg'}
          style={{width: '100%', height: Taro.pxTransform(440)}}
          boxStyle={{width: '100%', height: Taro.pxTransform(440)}}
        ></Banner>
        <View className='merchantDetails_shop'>
          <View className='merchant_name font_noHide'>
            {merchantName}
          </View>
          <View className='merchant_desc'>
            「{businessHub}·{cuisine} 人均{perCapitaConsumption}元」
          </View>
          <View className='merchant_tag'>
            <View className='merchat_tag_box'>
              人气商家
            </View>

          </View>
          <ScrollView
            scrollX
            className='merchant_shopImg'>
            {filterStrList(allImgs).map(item => {
              return (<View className='shopImgBox' style={{...backgroundObj(item)}}></View>)
            })}
          </ScrollView>
          <View className='share_btn public_center'
                onClick={() => navigateTo(`/pages/newUser/merchantDetails/index?userId=${userIdString}`)}>
            <View className='share_icon'></View>
            <View>看商家分享捡豆</View>
          </View>
          <View className='merchant_shop_details'>
            <View className='merchat_time'>
              <View className='merchant_time_go'></View>
              <View className='merchant_time_box'>
                <View className='merchant_bisinissStatus'>
                  <Text>
                    {businessStatus === '0' ? '休息中 | ' : '营业中 | '}
                  </Text>
                  <Text style={{color: 'rgba(153, 153, 153, 1)'}}>{businessTime}</Text>
                </View>
                <View className='merchant_time_tags'>
                  {services && services.map((item, index) => {
                    if (index < 5) {
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
                <View className='merchant_city_icon3' onClick={() => this.setState({visible: true})}></View>
              </View>
              <View className='merchat_city_details'>
                <View className='merchat_city_names font_hide'>
                  {districtName + address}
                </View>
                <View className='merchat_city_limit'>
                  距您{GetDistance(getLat(), getLnt(), lat, lnt) + ' '} {filterSetting(GetDistance(getLat(), getLnt(), lat, lnt))}
                </View>
              </View>
            </View>
          </View>

        </View>
        {/*<View className='merchant_active'>*/}
        {/*  <View className='merchant_active_title'>*/}
        {/*    <View className='merchant_active_iconBox active_icon1'>*/}

        {/*    </View>*/}
        {/*    <View className='merchant_active_biaoti'>*/}
        {/*      到店优惠*/}
        {/*    </View>*/}

        {/*  </View>*/}
        {/*  <View className='merchant_active_dec'>*/}
        {/*    店铺超级优惠权益 到店消费直接抵扣*/}
        {/*  </View>*/}
        {/*  <View className='active_go'></View>*/}
        {/*</View>*/}
        {/*{coupons()}*/}
        {/*{coupons()}*/}
        {/*{coupons()}*/}
        {specialGoodsList.length > 0&&
          <>
            <View className='merchant_active' onClick={() => navigateTo('/pages/perimeter/special/index')}>
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
              className='merchant_newPrice'
            >
              {specialGoodsList.map(item => {
                return (shopDetails(item))
              })}
            </ScrollView>
          </>
        }

        {goodsList && goodsList.length > 0 &&
        <>
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
            className='merchant_billboard'
          >
            {goodsList.map((item, index) => {
              return (billboard(this, item))
            })}
          </ScrollView>
        </>
        }
        {kolMomentsList && kolMomentsList.length > 0 &&
        <>
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
          {kolMomentsList.map((item, index) => {
            let that = this
            return (exploreShop(this, item))
          })}
        </>
        }
        <View className='merchant_layer'>
          <View className='merchant_layer_btn'>
            <View className='merchant_layer_btn1'>
              <View className='merchant_layer_btnBox merchant_layer_btnIcon1'></View>
              <View>买单</View>
            </View>
            <View className='merchant_layer_limit'></View>
            <View className='merchant_layer_btn2'>
              <View className='merchant_layer_btnBox merchant_layer_btnIcon3'></View>
              <View>到店打卡</View>
            </View>
            <View className='merchant_layer_limit'></View>
            {merchantFollowStatus === '0' ?
              <View className='merchant_layer_btn2'>
                <View className='merchant_layer_btnBox merchant_layer_btnIcon2' onClick={() => saveFollow({
                  followType: 'merchant',
                  followUserId: userIdString,
                }, res => {
                  this.setState({
                    userMerchantInfo: {
                      ...this.state.userMerchantInfo,
                      merchantFollowStatus: '1'
                    }
                  }, () => {
                    toast('关注成功')
                  })
                })}></View>
                <View>关注</View>
              </View> :
              <View className='merchant_layer_btn2' onClick={() => deleteFollow({followUserId: userIdString}, res => {
                this.setState({
                  userMerchantInfo: {
                    ...this.state.userMerchantInfo,
                    merchantFollowStatus: '0'
                  }
                }, () => {
                  toast('取消成功')
                })
              })}>
                <View className='merchant_layer_btnBox merchant_layer_btnIcon4'></View>
                <View>已关注</View>
              </View>
            }

          </View>
          <View className='merchant_shop' onClick={() => this.setState({visible: true})}>立即预约</View>
        </View>
        {visible &&
        <MarkPhone onClose={() => this.setState({visible: false})} onCancel={() => this.setState({visible: false})}
                   data={filterStrList(telephone)}></MarkPhone>
        }
      </View>
    )
  }
}

export default MerchantDetails
