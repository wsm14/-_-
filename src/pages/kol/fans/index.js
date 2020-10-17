import React, { Component } from 'react'
import Taro ,{getCurrentInstance}from '@tarojs/taro'
import { kol} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import {navigateTo} from '@/common/utils'
import {View,ScrollView} from '@tarojs/components'
import {backgroundObj,deleteFollow,saveFollow,toast} from '@/common/utils'
import './../follow/index.scss'
class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      httpData:{
        followUserId:getCurrentInstance().router.params.userId||'',
        page:1,
        limit: 10,
      },
      countStatus: true,
      userFollowList: []
    }
  }
  componentDidShow() {
     this.getFall()
  }
  getFall(){
    const {httpData} = this.state
    const {fans: {getFans}} = kol
    httpGet({
      url:getFans,
      data:httpData
    },res =>{
      const {userFollowList} = res
      if(userFollowList&&userFollowList.length>0){
        this.setState({
          userFollowList: [...this.state.userFollowList,...userFollowList,]
        },res =>{
          if(userFollowList.length<10){
            this.setState(
              {
                countStatus: false
              }
            )
          }
        })
      }
      else {
        this.setState(
          {
            countStatus: false
          }
        )
      }
    })
  }
  errorToast(e) {
    this.setState({
      Toast: {
        status: 'error',
        text: e,
        isOpened: true
      }
    })
  }
  onReachBottom(){
    const {httpData,countStatus} = this.state
    if(countStatus){
      this.setState({
        httpData: {
          ...httpData,
          page: httpData.page + 1
        },
      },res =>{
        this.getFall()
      })
    }

  }//上拉加载
  CreateView(list) {
    return (
      <View className='follow_userTags'>
        {list.map((item,index) =>{
          const {
            userName,
            ownerFollowStatus,
            userRemark,
            level,
            userProfile,
            userIdString,
            followType
          } = item
          return (
            <View key={index} className='follow_tab' style={index!=list.length-1&&{borderBottom:'1px solid #E5E5E5'}}>
              <View className='follow_userProFile' style={{...backgroundObj(userProfile)}}></View>
              <View className='follow_userDetails'>
                <View className='follow_userName'>
                  <View>{userName}</View>
                  {level > 0 && <View className='follow_tag'>
                    <View className='follow_icon'></View>
                    <View className='follow_tagFont'>哒人</View>
                  </View>}
                </View>
                <View className='follow_userDescribe'>{userRemark}</View>
              </View>
              {ownerFollowStatus !=='1'?
                <View
                  className='follow_userInterest_box follow_userInterest_true'
                  onClick={() =>saveFollow({
                    followType: followType,
                    followUserId: userIdString,
                  },res =>{
                    toast({content:'关注成功'})
                    this.getFollowList()
                  })}
                >
                  关注
                </View>
                :
                <View className='follow_userInterest_box follow_userInterest_false'
                      onClick={() =>deleteFollow({
                        followUserId: userIdString,
                      },res =>{
                        toast({content:'取消成功'})
                        this.getFollowList()
                      })}
                >
                  取消关注
                </View>
              }

            </View>
          )
        })}
      </View>

    )
  }
  render () {
    const {userFollowList,countStatus} = this.state
    return (
      <View className='follow_box'>
        {this.CreateView(userFollowList)}
        {!countStatus&& <View className='follow_over'>
          暂无更多
        </View>}
      </View>
    )
  }
}

export default Index
