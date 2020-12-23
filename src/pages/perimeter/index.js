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
import {createMerchantByView} from '@/components/publicShopStyle'


@inject('store')
@observer
class Index extends Component {
  constructor() {
    super(...arguments)
    this.interceptors = null
    this.state = {
      bannerType: 'near',//轮播图参数
      categoryDTOList: [],
      bannerList: [],
      tabCount: 0,
      httpData: {
        page: 1,
        limit: 10,
        distance: '',
        categoryIds: '',
        filterType: '',
        smartSiftType: '',
      },
      selectList: [
        {
          title: '智能排序',
          key: 'filterType',
          value: ''
        },
        {
          title: '捡豆数量',
          key: 'filterType',
          value: '1'
        },
        {
          title: '有优惠',
          key: 'smartSiftType',
          value: 'couponTitles'
        },
        {
          title: '到店打卡',
          key: 'smartSiftType',
          value: 'markFlag'
        },
        {
          title: '商家分享',
          key: 'smartSiftType',
          value: 'merchantShare'
        }
      ],
      countStatus: true,
      userMerchantList: [],
      navHeight: {paddingTop: Taro.pxTransform(64)},
      setBackGround: {},
      iconStatus: false,
      scrollSelect: false,
      visible: false,

      selectIndex: '智能排序'
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

  setCategory(item, index) {
    const {httpData} = this.state
    if (!item && index === 0) {
      this.setState({
        httpData: {
          ...httpData,
          page: 1,
          categoryIds: '',

        },
        tabCount: index,
        userMerchantList: [],
        countStatus: true,
      }, res => {
        this.getMerchantAll()
      })
    } else {
      const {categoryIdString} = item
      this.setState({
        httpData: {
          ...httpData,
          page: 1,
          categoryIds: categoryIdString,
        },
        tabCount: index,
        userMerchantList: [],
        countStatus: true,
      }, res => {
        this.getMerchantAll()
      })
    }
  }

  componentDidMount() {
    this.getBanner();
    this.getMerchantAll()
    this.getCategory()
  }

  //获取个人足迹
  onPageScroll(e) {
    if (this.interceptors) {
      clearTimeout(this.interceptors)
      this.interceptors = setTimeout(this.setSearch.bind(this, e), 50)
    } else {
      this.interceptors = setTimeout(this.setSearch.bind(this, e), 50)
    }
    const {scrollTop} = e
    if (scrollTop > 255) {
      this.setState({
        scrollSelect: true
      })
    } else {
      this.setState({
        scrollSelect: false
      })
    }

  }

  setSearch(e) {
    const {setBackGround} = this.state
    let scale = 0
    console.log(e.scrollTop)
    if (e.scrollTop >= 125) {
      this.setState({
        setBackGround: {
          color: 'rgba(51, 51, 51, 1)',
          background: 'rgba(255, 255, 255, 1)'
        },
        iconStatus: true
      }, res => {
        if (e.scrollTop >= 245) {
          this.setState({
            scrollSelect: true
          })
        } else {
          this.setState({
            scrollSelect: false
          })
        }
      })
    } else {
      scale = e.scrollTop / 125
      this.setState({
        setBackGround: {
          background: `rgba(255, 255, 255, 0)`
        },
        iconStatus: false
      })
    }
  }

  setScroll() {
    Taro.pageScrollTo({
      selector: `.street_select`,
      duration: 300,
      complete: res => {
        console.log(111)
        this.setState({
          visible: true
        })
      },
    })
  }

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
    const {
      categoryDTOList,
      bannerList,
      tabCount,
      userMerchantList,
      httpData,
      navHeight,
      setBackGround,
      iconStatus,
      scrollSelect,
      visible,
      selectList,
      selectIndex
    } = this.state
    return (
      <View catchMove className='street_box'>
        <CoverView style={setBackGround} className='perimerter_fixed'>
          <CoverView style={navHeight} className='perimerter_fixed_title'>
            <CoverView className='perimerter_title'>
              <CoverView className='perimerter_city'>
                <CoverImage className='perimerter_city_box'
                            src={iconStatus ? 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon46.png' : 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon40.png'}>
                </CoverImage>
                <CoverView onClick={(e) => {
                  e.stopPropagation();
                  navigateTo('/pages/perimeter/city/index')
                }} className='perimerter_city_font'>杭州</CoverView>
                <CoverImage className='perimerter_city_select'
                            src={iconStatus ? 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon47.png' : 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon41.png'}></CoverImage>
              </CoverView>
              打卡
            </CoverView>
            <CoverView className='perimerter_search'>
              <CoverView onClick={() => navigateTo('/pages/perimeter/search_shop/index')}
                         placeholderClass={classNames(iconStatus ? 'placeholder_style1' : 'placeholder_style2')}
                         className={classNames(iconStatus ? 'perimerter_input2' : 'perimerter_input1')}>
                搜一下附近玩乐
              </CoverView>
              <CoverImage
                className='perimerter_codeBox'
                onClick={() => scanCode()}
                src={iconStatus ? 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon45.png' : 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon42.png'}>
              </CoverImage>
            </CoverView>
          </CoverView>
        </CoverView>
        <View className='street_top'>
          <Banner
            showNear={true}
            autoplay={bannerList.length > 1 ? true : false}
            imgStyle
            data={bannerList}
            imgName={'coverImg'}
            style={{width: '100%', height: '100%'}}
            boxStyle={{width: '100%', height: '100%'}}
          ></Banner>
        </View>
        <View className='street_map'>
          <View className='street_lookMap_titleBox public_auto'>
            <View className='street_lookMap_left bold'>周边打卡地图</View>
            <View className='street_lookMap_right'>
              <View className='street_lookMap_title'>查看全部</View>
              <View className='street_lookMap_icon'></View>
            </View>
          </View>
          <View className='street_mapView'></View>
        </View>
        {<View className={classNames(!scrollSelect ? 'street_select' : 'street_select_fixed')}>
          <View className='street_select_left' onClick={() => this.setScroll()}>
            <View className={classNames('font28 color1 bold', visible && 'color4')}>{selectIndex}</View>
            <View
              className={classNames('street_select_iconBox', visible ? 'street_select_icon2' : 'street_select_icon1')}></View>
            <View className='street_select_liners'></View>
          </View>
          <ScrollView className='street_select_scrollView'
                      scrollX
          >
            <View onClick={() => this.setCategory('', 0)}
                  className={classNames('street_select_Tabs', tabCount === 0 && 'font28 bold')}>
              附近推荐
              {tabCount === 0 && <View className='street_select_liner'></View>}
            </View>
            {categoryDTOList.map((item, index) => {
              const {categoryName} = item
              return (
                <View onClick={() => this.setCategory(item, (index + 1))}
                      className={classNames('street_select_Tabs', tabCount === (index + 1) && 'font28 bold')}>
                  {categoryName}
                  {tabCount === (index + 1) && <View className='street_select_liner'></View>}
                </View>
              )
            })}

          </ScrollView>
        </View>}
        <View className='street_select_view'>
          {userMerchantList.map(item => {
            return (
              <View className='createMerchantByView_box'>
                {createMerchantByView(item)}
              </View>
            )
          })}
        </View>
        {visible &&
        <View className='street_layer' catchMove onClick={(e) => {e.stopPropagation();this.setState({
          visible: false
        })}}>
          <View className='street_layer_select'>
            {selectList.map(item => {
              return (
                <View className='street_layer_Tabs'>
                  <Text className={classNames(selectIndex === item.title?'color4':'color8')}>
                    {item.title}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
        }
      </View>
    )
  }
}

export default Index
