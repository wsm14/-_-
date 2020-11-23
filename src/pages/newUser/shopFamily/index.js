import React, {Component, useState} from 'react'
import { View,Text} from '@tarojs/components'
import './index.scss'
import {user} from '@/api/api'
import {toast} from '@/common/utils'
import {httpGet} from '@/api/newRequest'
import Card from './../components/card'
import List from './../components/shopList'
import Consent from './../components/consent'
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        page: 1,
        limit: 10,
      },
      merchant:{},
      userMerchantList: [],
      countStatus: true,
    }
  }
  getMerchantDetails() {
    const {shopFamily:{getMyMerchant}} = user
    httpGet({
      data:{},
      url:getMyMerchant
    },res =>{
      this.setState({
        merchant: {...res}
      })
    })
  }
  getMerchantList() {
    const {httpData} = this.state
    const {shopFamily:{getMyMerchantList}} = user
    httpGet({
      data:httpData,
      url: getMyMerchantList
    },res =>{
      const {userMerchantList} = res
      if(userMerchantList && userMerchantList.length > 0){
        if(userMerchantList && userMerchantList.length === 10){
          this.setState({
            userMerchantList: [...this.state.userMerchantList,...userMerchantList]
          })
        }
        else {
          this.setState({
            countStatus: false,
            userMerchantList: [...this.state.userMerchantList,...userMerchantList]
          })
        }
      }
      else {
        this.setState({
          countStatus: false
        },res => {
          if(this.state.userMerchantList.length > 0){
            toast('暂无更多')
          }
        })
      }
    })
  }
  onReachBottom() {
    const {countStatus,httpData} = this.state
    if (countStatus) {
      this.setState({
        httpData:{
          ...httpData,
          page: httpData.page+1
        }
      }, res =>{
        this.getMerchantList()
      })
    }
  }
  componentDidShow(){
    this.getMerchantDetails()
    this.getMerchantList()
  }

  errorToast(e) {
  }
  render () {
    const {merchant,merchant:{totalCount},userMerchantList,countStatus} = this.state
    return (
      <View className='page_family'>
        <View className='family_box'>
          <Card data={merchant}></Card>
        </View>
        <View className='family_details'>
          <View className='familyTitle'>
            我的家店
          </View>
          <View className='familyVital'>
            {totalCount == '0'?'暂无家店':`共有${totalCount||'0'}家家店`}
          </View>
        </View>
        {userMerchantList&& userMerchantList.length>0 ?
          <View className='family_tags'>
            <List list={userMerchantList}></List>
            {!countStatus &&
            <View className='list_countStatus'>
              - 暂无更多 -
            </View>
            }
          </View> :
          <Consent type={'shopFamily'}></Consent>
        }


      </View>
    )
  }
}

export default Index
