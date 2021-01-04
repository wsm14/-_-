import React, {Component} from 'react'
import Taro from '@tarojs/taro'
import {View, Text, Swiper, SwiperItem, ScrollView, CoverView, CoverImage} from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import {inject, observer} from "mobx-react";
import Banner from '@/components/banner'
import {getBanner, getCategory} from '@/server/common'
import {getSearchConditions} from '@/server/perimeter'
import {toast, navigateTo} from "@/common/utils";
import Router from '@/common/router'
import {goBack, getDom,GetDistance,backgroundObj, filterStrList,getLat, getLnt} from "@/common/utils";

@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      bannerType: 'near',//轮播图参数
      categoryDTOList: [],
      httpData: {
        page: 1,
        limit: 10,
        distance: '',
        categoryIds: '',
        filterType: '1',
        smartSiftType: '',
      },
      scroll_left: 0,
      countStatus: true,
      userMerchantList: [],
      categoryIndex: 0
    }
  }

  getBanner() {
    getBanner(
      {bannerType: this.state.bannerType}, res => {
        let {bannerList} = res
        console.log(bannerList)
        this.setState({
          bannerList
        })
      }
    )
  }

  getCategory() {
    getCategory({parentId: '0'}, res => {
      const {categoryDTOList} = res
      this.setState({
        categoryDTOList
      })
    })
  }

  //获取轮播图
  getMerchantAll() {
    const {httpData} = this.state
    getSearchConditions(httpData, res => {
      const {userMerchantList} = res
      if (userMerchantList && userMerchantList.length > 0) {
        this.setState({
          userMerchantList: [...this.state.userMerchantList, ...userMerchantList]
        })
      } else {
        this.setState({
          countStatus: false
        }, res => {
          toast('暂无数据')
        })
      }
    })
  }

  setCategoryById(id, index) {
    const {categoryIndex} = this.state
    console.log(id)
    if (index!==categoryIndex) {
      this.setState({
        httpData: {
          ...this.state.httpData,
          categoryIds: id,
        },
        countStatus: true,
        categoryIndex: index,
        userMerchantList: [],
      }, res => {
        if (index > 3) {
          getDom('.street_tab_box', (res) => {
            let width = 0
            for (let i = 0; i < (index - 3); i++) {
              width = width + Number(res[i].width) + 24
            }
            this.setState({
              scroll_left: width
            })
          })
        }
        this.getMerchantAll()
      })
    }
    else  return
  }

  componentDidMount() {
    this.getBanner();
    this.getMerchantAll()
    this.getCategory()
  }

  //获取个人足迹


  onReachBottom() {
    const {countStatus, httpData} = this.state
    if (countStatus) {
      this.setState({
        httpData: {
          ...this.state.httpData,
          page: httpData.page + 1
        }
      }, res => {
        this.getMerchantAll()
      })
    } else {
      toast('暂无数据')
    }
  }//上拉加载


  render() {
    const {lat, lnt} = this.props.store.locationStore
    const {
      categoryDTOList,
      bannerList,
      userMerchantList,
      categoryIndex,
      httpData: {
        categoryIds
      },
      scroll_left
    } = this.state
    return (
      <View className='street_box'>
        <View className='street_banner'>
          <View className='street_goBack' onClick={() =>goBack()}></View>
        </View>
        <View className='street_shop'>
          <ScrollView
            scrollX
            scrollWithAnimation={true}
            scrollLeft={
              categoryIndex > 3 ? scroll_left : false}
            className='street_tab'>
            <View className='street_tab_box' onClick={() => this.setCategoryById('', 0)}>
              <View
                className={classNames('street_tab_select', categoryIndex === 0  ? 'font28 bold' : 'font24')}>附近推荐</View>
              {categoryIndex === 0  &&
              <View className='street_tab_liner'></View>}
            </View>
            {categoryDTOList.map((item, index) => {
              const {categoryName, categoryIdString} = item
              return (
                <View className='street_tab_box' onClick={() => this.setCategoryById(categoryIdString, index + 1)}>
                  <View
                    className={classNames('street_tab_select', categoryIndex === index+1 ? 'font28 bold' : 'font24')}>{categoryName}</View>
                  {categoryIndex === index+1  && <View className='street_tab_liner'></View>}
                </View>
              )
            })}
          </ScrollView>
          {userMerchantList.filter(item => item.markFlag === '1').map(items => {
            const {brandFlag,brandName,merchantName,tag,coverImg,lat,lnt,businessHub,categoryName,perCapitaConsumption,markBean,merchantId} =  items
            return (
              <View onClick={() => Router({
                routerName:'merchantDetails',
                args:{
                  merchantId: merchantId
                }
              })} className='street_shop_details'>
                <View className='street_shop_image dakale_nullImage' style={backgroundObj(coverImg)}>
                  {brandFlag === '1' && <View className='street_pinpai'>{brandName}</View>}
                  <View className='street_merchantImg dakale_profile' style={backgroundObj(coverImg)}></View>
                </View>
                <View className='street_userShop'>
                  <View className='street_userShop_title font_hide  font32 bold'>{merchantName}</View>
                  <View className='street_userShop_tags public_center'>
                    {filterStrList(tag).map(val => {
                      return (
                        <View  className='street_userShop_tagsBox'>{val}</View>
                      )})
                    }
                  </View>
                  <View className='street_userShop_limit public_center font24'>
                    <View className='street_userShop_icon'>

                    </View>
                    {/*{GetDistance(getLat(), getLnt(), lat, lnt)}*/}
                    {GetDistance(getLat(), getLnt(), lat, lnt)} {' '+businessHub} {' ' + categoryName} ￥{perCapitaConsumption}/人
                  </View>
                </View>
                <View className='street_liner'></View>
                <View className='street_shopMarks'>
                  <View className='street_shopMarks_icon'></View>
                  <View className='street_shopMarks_title font28 bold  color1'>到店打卡特惠</View>
                </View>
                <View className='street_shopMarksBean'></View>
                <View className='street_shopMarksBeanNum font24'>
                  打卡捡豆<Text className='color3'>+{markBean}</Text>
                </View>
                <View className='street_shopMarksLiner'></View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}

export default Index
