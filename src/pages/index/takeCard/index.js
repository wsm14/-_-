import React from "react";
import Taro from '@tarojs/taro'
import {CoverImage, CoverView, Map, View} from "@tarojs/components";
import MapView from '@/components/map'
import {authGeography,scanCode} from '@/common/authority'
import {getMerchantLat} from '@/server/index'
import Router from '@/common/router'
import classNames from "classnames";
import router from "../../../common/router";
import {NavHeight} from "@/common/utils";
import Selects from './components/select'
import Slider from './components/silder'
import {createMerchantByMap} from '@/components/publicShopStyle'
import {getCategory, getLimit} from '@/server/common'
import './index.scss'
import {inject, observer} from "mobx-react";
@inject('store')
@observer
export default class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.state = {
      data: {
        markers: []
      },
      httpData: {
        page: 1,
        limit: 20,
        distance: '',
        categoryIds: '',
        filterType: '',
        smartSiftType: '',
      },
      desIndex: -1,
      selectResult: [],
      scale: 16,
    }
  }

  getLocation() {
    const {lat,lnt} = this.props.store.locationStore
    this.setState({
      data: {
        ...this.state.data,
        lat,lnt,
        markers: [
          {
            lat,lnt,
          }
        ],
        desIndex: '0'
      },
    }, res => {
      this.getMerchantData()
    })
  }

  //配置地图
  getSelectPromise() {
    getCategory({parentId: '0'}, res => {
      const {categoryDTOList} = res
      this.setState({
        selectResult: [
          {
            name: '附近',
            dataIndex: 'distance',
            value: 'value',
            type: 'one',
            data: [{"value": "", "distance": "全部"}, {"value": "500", "distance": "500m"}, {
              "value": "1000",
              "distance": "1km"
            }, {"value": "2000", "distance": "2km"}, {"value": "5000", "distance": "5km"}, {
              "value": "10000",
              "distance": "10km"
            }]
          },
          {
            name: '品类',
            dataIndex: 'categoryName',
            type: 'two',
            data: [...categoryDTOList]
          },
          {
            name: '智能排序',
            dataIndex: 'filterType',
            type: 'one',
            value: 'value',
            data: [{filterType: '智能排序', value: '智能排序'}, {filterType: '捡豆数量', value: '捡豆数量'}, {
              filterType: '有优惠',
              value: '有优惠'
            }, {filterType: '到店打卡', value: '到店打卡'}, {filterType: '商家分享', value: '商家分享'}]
          },
        ]
      })
    })
  }

  //获取配置详情
  getMerchantData() {
    getMerchantLat(this.state.httpData, res => {
      const {userMerchantList} = res
      const {data: {markers}} = this.state
      this.setState({
        data: {
          ...this.state.data,
          markers: [markers[0], ...userMerchantList]
        },
        desIndex: -1,
      })
    })
  }

  //获取周边商家详情
  linkTo() {
    router({routerName: 'search_shop',})
  }

  //跳转搜索页面
  setDataIndex(id) {
    this.setState({
      desIndex: id
    })
  }

  //地图 选中小图标
  componentDidHide() {
    this.setState({
      data: {
        markers: []
      }
    })
  }

  //页面返回时删除地图
  componentDidShow() {
    this.getLocation();
    this.getSelectPromise()
  }

  componentDidMount() {
    this.getSelectPromise()
  }

  filterScale(value) {
    return ({
      '': 16,
      '500': 18,
      '1000': 17,
      '2000': 16,
      '5000': 15,
      '100000': 14
    }[value]) || 12
  }

  setSelectTab(key, value) {
    const {httpData, selectResult} = this.state
    if (key === 'distance') {
      this.setState({
        httpData: {
          ...httpData,
          [key]: value
        },
        scale: this.filterScale(value)
      }, res => {
        this.getMerchantData()
      })
    }
    else if(key === 'filterType'){
      if(value === '智能排序'){
        this.setState({
          httpData: {
            ...httpData,
            filterType: '',
            smartSiftType: '',
          },
        }, res => {
          this.getMerchantData()
        })
      }
      else if(value === '捡豆数量'){
        this.setState({
          httpData: {
            ...httpData,
            filterType: '1',
            smartSiftType: '',
          },
        }, res => {
          this.getMerchantData()
        })
      }
      else if(value === '有优惠'){
        this.setState({
          httpData: {
            ...httpData,
            filterType: '',
            smartSiftType: 'couponTitles',
          },
        }, res => {
          this.getMerchantData()
        })
      }
      else if(value === '到店打卡'){
        this.setState({
          httpData: {
            ...httpData,
            filterType: '',
            smartSiftType: 'markFlag',
          },
        }, res => {
          this.getMerchantData()
        })
      }
      else if(value === '商家分享'){
        this.setState({
          httpData: {
            ...httpData,
            filterType: '',
            smartSiftType: 'merchantShare',
          },
        }, res => {
          this.getMerchantData()
        })
      }
    }
    else {
      this.setState({
        httpData: {
          ...httpData,
          [key]: value
        },
      }, res => {
        this.getMerchantData()
      })
    }

  }

  render() {
    const {data, desIndex, selectResult, httpData, scale} = this.state
    return (
      <View className='page_maps'>
        <CoverView style={{paddingTop: Taro.pxTransform(NavHeight())}} className='page_maps_titleBox'>
          <CoverView className='maps_search'>
            <CoverView onClick={() => this.linkTo()}
                       placeholderClass={'placeholder_style1'}
                       className='maps_input2'>
              搜一下附近玩乐
            </CoverView>
          </CoverView>

        </CoverView>
        {(desIndex>-1 && desIndex !== 0) &&
        <CoverView className='page_merchantList'>
          {createMerchantByMap(data.markers[desIndex])}
        </CoverView>}
        <Slider data = {data}></Slider>
        <Selects Top={78 + NavHeight()}
                 httpData={httpData}
                 list={selectResult} visible={true}
                 onChange={(key, value) => this.setSelectTab(key, value)}></Selects>
        {Object.keys(data).length > 1 &&
        <MapView data={
          data
        }
                 desIndex={desIndex}
                 openType
                 setIndex={this.setDataIndex.bind(this)}
                 scale={scale}
        ></MapView>
        }
        <CoverView className='silder_btn color6 font32 bold' onClick={() => scanCode()}>扫码打卡</CoverView>
      </View>
    )
  }
}
