import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import {goods} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import classNames from 'classnames'
import {toast} from "@/common/utils";
import './index.scss'
import {kol} from "../../../api/api";
class MerchantDetails extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      specialGoodsList: [],
      countStatus: true,
      httpData: {
        page: 1,
        limit: 10
      }
    }
  }

  componentWillMount() {
  }

  onReady() {
    // 生命周期函数--监听页面初次渲染完成
  }
  getListSpecialGoods() {
    const {listSpecialGoods} = goods
    const {httpData} = this.state
    httpGet({
      url: listSpecialGoods,
      data: httpData
    }, res => {
      const {specialGoodsList} = res
      if(specialGoodsList && specialGoodsList.length>0){
        this.setState({
          specialGoodsList: [...this.state.specialGoodsList,...specialGoodsList]
        })
      }
      else {
        this.setState({
          countStatus: false
        },res => {
          toast('暂无数据')
        })
      }
    })
  }
  // 获取周边特价
  componentDidShow() {
     this.getListSpecialGoods()
  }


  onReachBottom() {
    const {httpData, countStatus} = this.state
    if (countStatus) {
      this.setState({
       httpData: {
          ... httpData,
          page:  httpData.page + 1
        },
      }, res => {
        this.getListSpecialGoods()
      })
    } else {
      return toast('暂无数据')
    }

  }//上拉加载
  render() {
    const {
      specialGoodsList
    } = this.state
    return (
      <View className='special_box'>
        {specialGoodsList.map(item => {
          return (
            <View className='special_fall'>
              {shopDetails(item)}
            </View>
          )
        })}
      </View>
    )
  }
}

export default MerchantDetails
