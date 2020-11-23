import React from "react";
import Taro from '@tarojs/taro'
import {Map, View} from "@tarojs/components";
import MapView from '@/components/map'
import {authGeography} from '@/common/authority'
import {getMerchantLat} from '@/server/index'
import './index.scss'
export default class Index extends React.Component{
  constructor() {
    super(...arguments);

    this.state = {
      data:{
        markers: []
      },
      httpData: {
        page: 1,
        limit: 20,
        distance: '',
        filterType:'',
        categoryIds: '',
        smartSiftType: '',
      }
    }
  }
  getLocation() {
    authGeography((e) => {
      const {
        latitude,
        longitude
      } = e
      this.setState({
        data: {
          ...this.state.data,
          lat: Number(latitude),
          lnt: Number(longitude),
          markers:[
            {
              lat:latitude,
              lnt:longitude
            }
          ],
          desIndex: '0'
        },
      },res => {
        this.getMerchantData()
      })
    },true)
  }
  getMerchantData() {
    getMerchantLat(this.state.httpData,res => {
     const {userMerchantList} = res
      const  {data:{markers}} =this.state
      console.log(userMerchantList)
      this.setState({
         data:{
           ...this.state.data,
           markers:[...markers,...userMerchantList]
         }
      })
    })
  }
  setDataIndex(id) {
    console.log(id)
    this.setState({
      data: {
        ...this.state.data,
        desIndex: id
      }
    })
  }
  componentDidMount() {
    this.getLocation()
  }

  render() {
    const {data} = this.state
    return (
      <View className='page_maps'>
        <MapView data={
          data
        }
        openType
        setIndex={this.setDataIndex.bind(this)}
        ></MapView>
      </View>

    )
  }
}
