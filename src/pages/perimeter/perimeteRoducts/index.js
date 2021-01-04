import React, {Component, PureComponent} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {CoverView, Image, ScrollView, Text, View} from '@tarojs/components'
import ShopDetails from './components/shopDetails/index'
import {perimeter, wxapiGet} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import classNames from 'classnames'
import {toast, getDom, GetDistance, getLat, getLnt,backgroundObj,navigateTo} from "@/common/utils";
import Banner from '@/components/banner'

import {shopDetails} from '@/components/publicShopStyle'

import Waterfall from '@/components/waterfall'
import './index.scss'
class Index extends PureComponent {
  constructor() {
    super(...arguments)
    this.state = {
      countStatus: true,
      //允许翻页参数
      bannerList: [],
      httpData: {
        page: 1,
        limit: 10
      },
      //商家参数
      searchMerchantData: {
        categoryIds: '',
        keyword: '',
        page: 1,
        limit: 10
      },
      //特价商品参数
      categoryData: {
        parentId: '0'
      },
      //类目参数
      bannerHttp: {
        bannerType: 'surroundingSpecial'
      },
      //轮播图参数
      categoryList: [],
      //商家数组
      categoryIndex: 0,
      merchantIndex: 0,
      scroll_left: 0,
      scroll_left1: 0,
      userMerchantList: [],
      countStatus1: true,
      countStatus2: true,
      specialGoods: {
        page: 1,
        limit: 10
      },
      specialGoodsList: [],
      merchantHttp: {
        page:1,
        limit:10
      },
      merchantGoodList: []
    }
  }
  getSpecialGoods() {
    const {listSpecialGoods} = perimeter
    const {specialGoods} = this.state
    httpGet({
      url: listSpecialGoods,
      data: specialGoods
    }, res => {
      const {specialGoodsList} = res
      if (specialGoodsList && specialGoodsList.length > 0) {
        this.setState({
          specialGoodsList: [...this.state.specialGoodsList, ...specialGoodsList]
        })
      } else{
        this.setState({
          countStatus2: false
        },res => {
          toast('暂无更多商品')
        })
      }
    })
  }
  //获取全部特价商品
  componentWillMount() {
  }
  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  // 获取周边特价
  componentDidMount() {
    this.getBanner()
    this.getCategory()
    this.getSpecialGoodsMerchant()
    this.getSpecialGoods();
  }

  getBanner() {
    const {bannerHttp} = this.state
    const {wechatBanner} = wxapiGet
    httpGet({
      data: bannerHttp,
      url: wechatBanner
    }, res => {
      const {bannerList} = res
      this.setState({
        bannerList
      })
    })
  }

  getCategory() {
    const {getListCategory} = perimeter
    const {categoryData} = this.state
    httpGet({
      data: categoryData,
      url: getListCategory
    }, res => {
      const {categoryList} = res
      categoryList.unshift({
        categoryName: '推荐',
        id: '',
        idString: ''
      })
      this.setState({
        categoryList
      })
    })
  }
  getMerchantDetails() {
    const {getMerchantSpecialGoods} = perimeter
    const {merchantHttp} = this.state
    httpGet({
      url: getMerchantSpecialGoods,
      data: merchantHttp
    }, res => {
      const {specialGoodsList} =res
      const {merchantGoodList} = this.state
      if(specialGoodsList &&specialGoodsList.length >0){
        this.setState({
          merchantGoodList:[...merchantGoodList,...specialGoodsList]
        })
      }
      else {
        this.setState({
          countStatus: false
        },res => {
          toast('无更多数据')
        })
      }
    })
  }
  //获取商家特价商品
  getSpecialGoodsMerchant() {
    const {getSpecialGoodsMerchant} = perimeter
    const {searchMerchantData} = this.state
    httpGet({
      data: searchMerchantData,
      url: getSpecialGoodsMerchant
    }, res => {
      const {userMerchantList} = res
      if (userMerchantList && userMerchantList.length > 0) {
        this.setState({
          userMerchantList: [...this.state.userMerchantList, ...userMerchantList]
        })
      } else {
        this.setState({
          countStatus1: false
        }, res => {
          toast('暂无更多商家')
        })
      }
    })
  }

  setSearchCategory(index, item) {
    const {
      categoryIndex
    } = this.state
    if (index === categoryIndex) {
      return
    } else {
      this.setState({
        categoryIndex: index,
        scroll_left1: 0,
        merchantIndex: 0,
        searchMerchantData: {
          ...this.state.searchMerchantData,
          categoryIds: item.id,
          page:1,
          limit:10
        },
        httpData: {
          page: 1,
          limit: 10
        },
        merchantHttp: {
          page:1,
          limit:10
        },
        kolGoodsList:[],
        userMerchantList: [],
        merchantGoodList:[],
        countStatus: true,
        countStatus1: true,
        countStatus2: true,
      }, res => {
        this.getSpecialGoodsMerchant()
        if (index > 3) {
          getDom('.roducts_tab_font', (res) => {
            let width = 0
            for (let i = 0; i < (index - 3); i++) {
              width = width + Number(res[i].width) + 24
            }
            this.setState({
              scroll_left: width
            })
          })
        }
      })
    }
  }

  //设置分类
  setSearchMerchant(index, item) {
    const {
      merchantIndex,
      merchantHttp
    } = this.state

    if (merchantIndex === index) {
      return
    } else if (index === 0) {
      this.setState({
        merchantIndex: 0
      })
    } else {
      const {userMerchantIdString} = item
      this.setState({
        merchantIndex: index,
        merchantHttp: {
          page:1,
          limit:10,
          merchantId: userMerchantIdString
        },
        merchantGoodList:[],
      }, res => {
        this.getMerchantDetails()
        if (index > 1) {
          getDom('.shopTab_box', (res) => {
            let width = 0
            for (let i = 0; i < (index - 1); i++) {
              width = width + Number(res[i].width) + 12
            }
            this.setState({
              scroll_left1: width
            })
          })
        }
      })
    }
  }
  //设置商家
  onLeftMerchant(){
    const {searchMerchantData, countStatus1}  = this.state
    if(countStatus1){
      this.setState({
        searchMerchantData:{
          ...searchMerchantData,
          page:searchMerchantData.page+1
        }
      },res => {
        this.getSpecialGoodsMerchant()
      })
    }
    else return toast('暂无更多商家')
  }
  onReachBottom() {
    const {
      specialGoods,
      merchantIndex,
      countStatus2,
      countStatus,
      merchantHttp
    } = this.state
    if(merchantIndex === 0){
      if(countStatus2){
        this.setState({
          specialGoods:{
            ...specialGoods,
            page:specialGoods.page+1
          }
        },res => {
          this.getSpecialGoods()
        })

      }
      else {
        toast('暂无更多商品')
      }
    }
   else {
      if(countStatus){
        this.setState({
          merchantHttp:{
            ...merchantHttp,
            page:merchantHttp.page+1
          }
        },res => {
          this.getMerchantDetails()
        })

      }
      else {
        toast('暂无更多商品')
      }
    }
  }//上拉加载
  render() {
    const {
      bannerList,
      categoryList,
      categoryIndex,
      scroll_left,
      userMerchantList,
      merchantIndex,
      scroll_left1,
      specialGoodsList,
      merchantGoodList
    } = this.state
    return (
      <View className='roducts_box'>
        <CoverView onClick={() => navigateTo('/pages/perimeter/search_fav/index')} className='roducts_searchBox public_center'>
          <CoverView className='roducts_search public_center'>
            <CoverView className='zSearch zSearchBox'></CoverView>
            <CoverView className='font24 color2'>搜索周边特惠</CoverView>
          </CoverView>
        </CoverView>
        <View className='roducts_bannerBox'>
          <Banner
            showNear={true}
            autoplay={bannerList.length > 1 ? true : false}
            imgStyle
            data={bannerList}
            imgName={'coverImg'}
            borderRadius={true}
            style={{width: '100%', height: '100%',}}
            boxStyle={{width: '100%', height: '100%',}}
          ></Banner>
        </View>
        <ScrollView
          scrollX
          scrollWithAnimation={true}
          scrollLeft={
            categoryIndex > 3 ? scroll_left : false}
          className='roducts_tab'>
          {categoryList.map((item, index) => {
            return (
              <View
                onClick={() => this.setSearchCategory(index, item)}
                className={classNames('roducts_tab_font', categoryIndex === index ? 'font40 bold color1 selectIndex' : 'font32 color8')}
              >
                {item.categoryName}
              </View>
            )
          })}
        </ScrollView>
        <View className='products_shop'>
          <View className='shop_titlte'>
            <View className='color1 bold font40'>周边特价店</View>
            <View className='color2 font20 shop_titlte_english'>Special offers around</View>
            <ScrollView
              scrollX
              onScrollToLower={
                this.onLeftMerchant.bind(this)
              }
              scrollWithAnimation={true}
              scrollLeft={
                merchantIndex > 1 ? scroll_left1 : false}
              className='shopTab'>
              <View className='shopTab_box' onClick={() => this.setSearchMerchant(0)}>
                <Image className={classNames(merchantIndex === 0 ? 'imgSelect' : 'imgStyle')}
                       src={'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/foverAll.png'}
                ></Image>
                <View
                  className={classNames('font24 color1 font_hide', merchantIndex === 0 ? 'shopTab_title' : 'shopTab_title1')}
                >
                  全部特价
                </View>
              </View>
              {userMerchantList.map((item, index) => {
                const {
                  lat,
                  lnt,
                  merchantName,
                  coverImg
                } = item
                return (
                  <View className='shopTab_box' onClick={() => this.setSearchMerchant(index + 1, item)}>
                    <View className='shopTablayer'>
                      <Image className={classNames(merchantIndex === index + 1 ? 'imgSelect' : 'imgStyle')}
                             src={coverImg}
                      >

                      </Image>
                      <View className='tab_layer'>
                        <View className='tab_accress_icon'></View>
                        <View
                          className='tab_accress_font font20 color6'>{GetDistance(getLat(), getLnt(), item.lat, item.lnt)}</View>
                      </View>
                    </View>
                    <View
                      className={classNames('font24 color1 font_hide',
                        merchantIndex === index + 1 ? 'shopTab_title' : 'shopTab_title1')}
                    >{merchantName}</View>
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </View>
        <View className='products_foot_box'>
          {specialGoodsList.length > 0 && merchantIndex===0 &&
            <Waterfall
              list={specialGoodsList}
              createDom={shopDetails}
              imgHight={240}
            >
            </Waterfall>
          }
          {merchantIndex!==0 && <ShopDetails merchantData={userMerchantList[merchantIndex-1]} list={merchantGoodList}></ShopDetails>}
        </View>
      </View>
    )
  }
}

export default Index
