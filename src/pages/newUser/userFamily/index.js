import React, {Component, useState} from 'react'
import { View,Text} from '@tarojs/components'
import './index.scss'
import Card from './../components/card'
import List from './../components/list'
import {user} from '@/api/api'
import {toast} from '@/common/utils'
import {httpGet} from '@/api/newRequest'
import Consent from "../components/consent";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userInfo: {},
      httpData:{
        page: 1,
        limit: 10
      },
      userList: [],
      countStatus: true
    }
  }
  getUserDetails() {
    const {userFamily:{getFamilyUser}} = user
    httpGet({
      data:{},
      url:getFamilyUser
    },res =>{
       this.setState({
         userInfo: {...res}
       })
    })
  }
  getUserList() {
    const {httpData} = this.state
    const {userFamily:{getListUser}} = user
    httpGet({
      data:httpData,
      url: getListUser
    },res =>{
      const {userList} = res
      if(userList && userList.length >0){
        if(userList && userList.length === 10){
          this.setState({
            userList:[...this.state.userList,...userList]
          })
        }
        else {
          this.setState({
            countStatus: false,
            userList:[...this.state.userList,...userList]
          })
        }
      }
      else {
        this.setState({
          countStatus: false
        },res => {
          if(this.state.userList.length > 0){
            toast('暂无更多')
          }
        })
      }
    })
  }
  onReachBottom() {
    const {page, limit,countStatus,httpData} = this.state
    if (countStatus) {
      this.setState({
        httpData:{
          ...httpData,
          page: httpData.page+1
        }
      }, res =>{
        this.getUserList()
      })
    }
  }
  componentDidShow(){
    this.getUserDetails()
    this.getUserList()
  }
  errorToast(e) {
  }
  render () {
    const {
      userInfo,
      userList,
      countStatus,
      userInfo:{
      sumBean,
      sumBeanUnit,
      todaySumBean,
      todaySumBeanUnit,
      totalCount}
    } = this.state
    return (
      <View className='page_family'>
        <View className='family_box'>
          <Card data={userInfo}></Card>
        </View>
        <View className='family_details'>
          <View className='familyTitle'>
            我的家人
          </View>
          <View className='familyVital'>
            {totalCount == '0'?'暂无家人':`共有${totalCount||'0'}位家人`}
          </View>
        </View>
        {userList&& userList.length>0 ?
          <View className='family_tags'>
            <List list={userList}></List>
            {!countStatus &&
            <View className='list_countStatus'>
                - 暂无更多 -
            </View>
            }
          </View>
          :
          <Consent></Consent>
        }
      </View>
    )
  }
}

export default Index
