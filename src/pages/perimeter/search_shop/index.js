import React from "react";
import Taro from '@tarojs/taro'
import {CoverView, Input, Text, View} from '@tarojs/components'
import {createMerchants} from '@/components/publicShopStyle'
import {backgroundObj, GetDistance, getLat, getLnt, navigateTo, toast,removeStorage} from '@/common/utils'
import './index.scss'
import {getSearchDataStatistic, getSearchRecommend, getSearchConditions} from '@/server/perimeter'
import Waterfall from '@/components/waterfall'

export default class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.instance = null;
    this.state = {
      hotSearchList: [],
      statistic: {
        keyword: '',
        searchType: 'applets'
      },
      searchInfo: {},
      status: '0',
      shopData: {
        page: 1,
        limit: 10,
        smartSiftType: 'markFlag'
      },
      userMerchantList: [],
      countStatus: true,
      storageList:Taro.getStorageSync('storageList')|| []
    }
  }

  getSearchRecommend() {
    getSearchRecommend({}, res => {
      const {hotSearchList = []} = res
      this.setState({
        hotSearchList
      })
    })
  }

  getSearchConditions() {
    const {shopData, statistic: {keyword},storageList} = this.state
    if(!storageList.includes(keyword) && storageList.length<10){
      this.setState({
        storageList:[keyword,...this.state.storageList]
      },res => {
        Taro.setStorageSync('storageList',this.state.storageList)
      })
    }
    else if(!storageList.includes(keyword) && storageList.length===10){
      this.setState({
        storageList:[keyword,...this.state.storageList].slice(0,9)
      },res => {
        Taro.setStorageSync('storageList',this.state.storageList)
      })
    }
    getSearchConditions({...shopData, keyword}, res => {
      const {userMerchantList} = res
      if (userMerchantList && userMerchantList.length > 0) {
        this.setState({
          userMerchantList:[...this.state.userMerchantList,...userMerchantList],
          status: '2',
        })
      } else {
        this.setState({
          countStatus: false,
          status: '2',
        })
      }
    })
  }

  search(e) {
    const {statistic: {}, statistic} = this.state
    this.setState({
      statistic: {
        ...statistic,
        keyword: e.detail.value,
      },
      shopData: {
        page: 1,
        limit: 10,
        smartSiftType: 'markFlag',
      },
      userMerchantList: [],
    }, res => {
      if (this.state.statistic.keyword) {
        getSearchDataStatistic(this.state.statistic, res => {
          const {userMerchantNum, userMerchantNameList =[]} = res
          if (userMerchantNum > 0 && userMerchantNameList.length > 0) {
            this.setState({
              searchInfo: res,
              status: '1'
            })
          } else {
            this.setState({
              status: '1'
            })
          }
        })
      } else {
        this.setState({
          searchInfo: {},
          status: '0'
        })
      }
    })
  }

  searchDetails(e) {
    if (this.instance) {
      clearTimeout(this.instance)
      this.instance = setTimeout(this.search.bind(this, e), 1200)
    } else {
      this.instance = setTimeout(this.search.bind(this, e), 1200)
    }
  }
  cleanList() {
    this.setState({
      storageList:[]
    },res => {
      removeStorage('storageList')
    })

  }
  changeClick(item) {
    this.setState({
      statistic: {
        searchType: 'applets',
        keyword: item,

      },
      userMerchantList: [],
    }, res => {
      this.getSearchConditions()
    })
  }

  onReachBottom() {
    const {shopData,countStatus} = this.state
    if(countStatus){
      this.setState({
        shopData: {
          ...shopData,
          page: shopData.page+1
        }
      },res => {
        this.getSearchConditions()
      })
    }
  }

  componentDidMount() {
    this.getSearchRecommend()
  }


  render() {
    const {hotSearchList,storageList, statistic: {keyword}, searchInfo: {userMerchantNum = '', userMerchantNameList = []}, status, userMerchantList} = this.state
    const hasListObj = {
      '0': (
        <>
          <View className='search_shop_orderTags'>
            <View className='search_shop_title color2 font24'>最近搜索</View>
            <View className='search_shop_close' onClick={() =>this.cleanList()}></View>
          </View>
          {/*最近搜索*/}

          <View className='search_shopTags font24'>
            {storageList.map(item => {
              return (
                <View
                  onClick={() => this.changeClick(item)}
                  className='shopTag'>{item}</View>
              )
            })}
          </View>
          {/*标签*/}

          <View className='search_shop_liner'></View>
          {/*下划线*/}
          <View className='search_hot_search color2 font24'>
            热门搜索
          </View>
          {/*热门搜索*/}
          <View className='search_hot_list'>
            <View className='search_liner'></View>
            {hotSearchList.map(item => {
              const {merchantName} = item
              return (
                <View onClick={() => this.changeClick(merchantName)}
                      className='search_hot_font font_hide font28 color1'>{merchantName}</View>
              )
            })}

          </View>
        </>),
      '1': (
        <>
          <View className='search_shop_layer' onClick={() => this.changeClick(keyword)}>
            <View className='search_shop_icon'></View>
            <View className='font28 color1 font_hide search_hide'>{keyword}</View>
            <View className='font24 color2 search_shop_right'>约{userMerchantNum || 0}个商户</View>
          </View>
          {userMerchantNameList.map(item => {
            return (
              <View className='search_shop_layer' onClick={() => this.changeClick(item)}>
                <View className='search_seach_icon'></View>
                <View className='font28 color1 font_hide search_hide'>{item}</View>
              </View>
            )
          })}
        </>
      ),
      '2': (
        <View className='flex_auto'>
          {userMerchantList.length > 0 ?
            <View className='search_shopPubu'>
              <Waterfall
                list={userMerchantList}
                createDom={createMerchants}
                imgHight={240}
              >
              </Waterfall>
            </View>
            :
            <View className='search_shopNO'>
              <View className='search_shopImg'></View>
              <View className='search_shopImgfont color2 font28'>暂无找到想要的结果，换个关键词试试吧</View>
            </View>
          }
        </View>
      )
    }[status]
    return (
      <View className='search_shop_box'>
        <View className='search_shop_padding'>
          <View className='search_shop_inputBox'>
            <Input type={'text'} confirmType={'search'} onConfirm={() => {keyword && this.changeClick(keyword)}} value={keyword} onInput={(e) => this.searchDetails(e)} className='search_shop_input'
                   placeholder={'搜索附近商户'}></Input>
          </View>
          {hasListObj}
        </View>
      </View>
    );
  }
}
