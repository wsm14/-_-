import React from "react";
import Taro from '@tarojs/taro'
import {CoverView, Input, Text, View} from '@tarojs/components'
import {backgroundObj, GetDistance, getLat, getLnt, navigateTo, toast} from '@/common/utils'
import Tabs from '@/components/tabs'
import {shopDetails,nullMerchantFav,nullGoodsFav,createMerchants} from '@/components/publicShopStyle'
import {perimeter} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import Waterfall from '@/components/waterfall'
import './index.scss'

export default class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.instance = null;
    this.state = {
      setting: {
        tabList: ['商家', '特价商品'],
        current: 0
      },

      httpData: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      httpData1: {
        page: 1,
        limit: 10,
        keyword: ''
      },
      //特价商品参数
      userMerchantList: [],
      //商家渲染数据
      merchantGoodList: [],
      //商品渲染数据
      publicList:[],
      publicSearch: {
        page: 1,
        limit: 10,
      },
      countStatus: true,
      countStatus1: true,
      countStatus3: true
    }
  }

  setIndex(index) {
    const {httpData,userMerchantList,merchantGoodList,httpData1} = this.state
    if (index != this.state.setting.current) {
      this.setState({
        setting: {
          ...this.state.setting,
          current: index
        },
        httpData: {
          ...httpData,
          keyword: '',
        },
        httpData1: {
          ...httpData1,
          keyword: '',
        },
        publicSearch: {
          page: 1,
          limit: 10,
        },
        publicList:[],
        countStatus3: true,
        countStatus: true,
        countStatus1: true,
      }, res => {
        if(index === 0){
          if(userMerchantList.length>0){
            return
          }
          this.getShopByMerchant()
        }
        else if(index === 1){
          if(merchantGoodList.length>0){
            return
          }
          this.getShop()
        }
      })
    }
    return
  }
  search(e) {
    const {setting : {current}} = this.state
    if(current === 0)
      this.setState({
        userMerchantList: [],
        publicList:[],
        publicSearch: {
          page: 1,
          limit: 10,
        },
        countStatus1: true,
        httpData: {
          keyword: e.detail.value,
          page: 1,
          limit: 10
        },
        publicHttp:{
          page: 1,
          limit:10
        },
      },res =>{
        this.getShopByMerchant()
      })
    else {
      this.setState({
        merchantGoodList: [],
        countStatus: true,
        httpData1: {
          keyword: e.detail.value,
          page: 1,
          limit: 10
        },
        publicList:[],
        publicSearch: {
          page: 1,
          limit: 10,
        },
      },res =>{
        this.getShop()
      })
    }
  }
  searchDetails(e) {
    if(this.instance){
      clearTimeout(this.instance)
      this.instance = setTimeout(this.search.bind(this,e),1200)
    }
    else {
      this.instance = setTimeout(this.search.bind(this,e),1200)
    }
  }
  onReachBottom() {
    const {setting : {current},httpData,httpData1,userMerchantList,merchantGoodList,publicSearch,countStatus1,countStatus,countStatus3} = this.state
    if(current === 0 && userMerchantList.length>0){
      if(countStatus1){
        this.setState({
          httpData: {
            ...httpData,
            page: httpData.page+1,
          },
        },res =>{
          this.getShopByMerchant()
        })
      }
      else toast('暂无更多数据')
    }
    else if(current === 1 && merchantGoodList.length>0){
      console.log(current,'2222')
      if(countStatus){
        this.setState({
          httpData1: {
            ...httpData1,
            page: httpData1.page+1,
          },
        },res =>{
          this.getShop()
        })
      }
      else toast('暂无更多数据')

    }
    else {
      if(countStatus3){
        this.setState({
          publicSearch: {
            ...publicSearch,
            page: publicSearch.page+1,
          },
        },res =>{
          this.setPublicList()
        })
      }
      else toast('暂无更多数据')
    }
  }
  componentDidMount() {
    this.getShopByMerchant()
  }
  setPublicList() {
    const {getSpecialGoodsMerchant,listSpecialGoods} = perimeter
    const {setting: {current},publicSearch} = this.state
    if(current === 0){
      httpGet({
        data: publicSearch,
        url: getSpecialGoodsMerchant
      }, res => {
        const {userMerchantList} = res
        if (userMerchantList && userMerchantList.length > 0) {
          this.setState({
            publicList: [...this.state.publicList, ...userMerchantList]
          })
        } else {
          this.setState({
            countStatus3: false
          }, res => {
            toast('暂无更多商家')
          })
        }
      })
    }
    else {
     httpGet({
        url: listSpecialGoods,
        data: publicSearch
      }, res => {
        const {specialGoodsList} = res
        const {publicList} = this.state
        if (specialGoodsList && specialGoodsList.length > 0) {
          this.setState({
            publicList: [...publicList, ...specialGoodsList]
          })
        } else {
          this.setState({
            countStatus: false
          }, res => {
            toast('无更多数据')
          })
        }
    })
    }
  }
  getShopByMerchant() {
    const {getSpecialGoodsMerchant} = perimeter
    const {httpData} = this.state
    httpGet({
      data: httpData,
      url: getSpecialGoodsMerchant
    }, res => {
      const {userMerchantList} = res
      if (userMerchantList && userMerchantList.length > 0) {
        this.setState({
          userMerchantList: [...this.state.userMerchantList, ...userMerchantList]
        })
      } else {
        if(this.state.userMerchantList.length === 0){
          this.setPublicList()
        }
       else {
          this.setState({
            countStatus1: false
          }, res => {
            toast('暂无更多商家')
          })
        }
      }
    })
  }
  getShop() {
    const {listSpecialGoods} = perimeter
    const {httpData1} = this.state
    httpGet({
      url: listSpecialGoods,
      data: httpData1
    }, res => {
      const {specialGoodsList} = res
      const {merchantGoodList} = this.state
      if (specialGoodsList && specialGoodsList.length > 0) {
        this.setState({
          merchantGoodList: [...merchantGoodList, ...specialGoodsList]
        })
      } else {
        if(this.state.merchantGoodList.length === 0){
          this.setPublicList()
        }
        else {
          this.setState({
            countStatus: false
          }, res => {
            toast('无更多数据')
          })
        }
      }
    })
  }
  render() {
    const tabStyle = {
      height: Taro.pxTransform(88),
      borderRadius: '0px 0px 20px 20px',
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      background: '#FFFFFF',
      padding: `0 ${Taro.pxTransform(38)}`,
      position: 'relative',
    }
    const {
      setting,
      setting: {current},
      userMerchantList,
      merchantGoodList,
      publicList,

    } = this.state
    return (
      <View className='search_fav_box'>
        <View className='fixed_tab'>
          <View className='search_input_box'>
            <Input value={current===0 ? this.state.httpData.keyword:this.state.httpData1.keyword} onInput={(e) => this.searchDetails(e)} type='text' className='search_input' placeholder={'搜索门店/商品'}></Input>
          </View>
          <View className='search_inTab'>
            <Tabs type fn={this.setIndex.bind(this)} style={tabStyle} {...setting}></Tabs>
          </View>
        </View>

        <View className='search_center'>
          {current === 0 && userMerchantList.length === 0 &&
            nullMerchantFav()
          }
          {current === 1 && merchantGoodList.length === 0 && nullGoodsFav()}
          <Waterfall
            list={current===0?(userMerchantList.length>0?userMerchantList:publicList):(merchantGoodList.length>0?merchantGoodList:publicList)}
            createDom={current === 0 ?createMerchants : shopDetails}
            imgHight={240}
          >
          </Waterfall>
        </View>
      </View>
    );
  }
}
