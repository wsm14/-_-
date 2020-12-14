import React, { Component } from 'react'
import Taro,{getCurrentInstance} from '@tarojs/taro'
import { View, Button,Image, Text,Swiper, SwiperItem} from '@tarojs/components'
import Nav from '@/components/nav'
import {kol} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import {backgroundObj,deleteFollow,saveFollow,toast} from '@/common/utils'
import './index.scss'
class Index extends Component {
  constructor () {
    super(...arguments)
    this.state = {
      httpData: {
        page:1,
        limit:'10',
        userId: getCurrentInstance().router.params.userId||'',
        followType: 'user'
      },
      userFollowList: [],
      countStatus: true
    }

  }
  getFollowList() {
    const {httpData} = this.state
    const {follow: {listOtherUserFollowByUserId}} = kol
    httpGet({
      data: httpData,
      url: listOtherUserFollowByUserId
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
            followUserIdString,
            followType
          } = item
          return (
            <View key={index} className='follow_tab' style={index!=list.length-1&&{borderBottom:'1px solid #E5E5E5'}}>
              <View className='follow_userProFile' style={{...backgroundObj(userProfile)}}></View>
              <View className='follow_userDetails'>
                <View className='follow_userName'>
                  <View className='follow_userTop'>{userName}</View>
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
                  onClick={() => {
                    let that = this
                    saveFollow({
                      followType: followType,
                      followUserId: followUserIdString,
                    }, res => {
                      let list = that.state.userFollowList.map(items =>{
                        if(items.followUserIdString ===followUserIdString){
                          items.ownerFollowStatus = '1'
                        }
                        return items
                      })
                      that.setState({
                        userFollowList: list
                      })
                    })
                  }}
                >
                  关注
                </View>
                :
                <View className='follow_userInterest_box follow_userInterest_false'
                      onClick={() => {
                        let that = this
                        deleteFollow({
                          followUserId: followUserIdString,
                        },res =>{
                          let list = that.state.userFollowList.map(items =>{
                            if(items.followUserIdString ===followUserIdString){
                              items.ownerFollowStatus = '0'
                            }
                            return items
                          })
                          that.setState({
                            userFollowList: list
                          })
                        })
                      }}
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
  onReachBottom(){
    const {httpData,countStatus} = this.state
    if(countStatus){
      this.setState({
        httpData: {
          ...httpData,
          page: httpData.page + 1
        },
      },res =>{
        this.getFollowList()
      })
    }

  }//上拉加载
  componentWillMount () { }
  componentDidMount () {
  }
  componentWillUnmount () { }
  componentDidShow() {
    this.getFollowList()
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
  render () {
    const { userFollowList,countStatus} = this.state
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
