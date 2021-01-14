import React, {useEffect, useState} from 'react'
import {Image, View} from "@tarojs/components";
import Taro, {useReachBottom} from "@tarojs/taro";
import './../../../index.scss'
import {getSearchUserList} from '@/server/perimeter'
import {backgroundObj, deleteFollow, saveFollow} from "@/common/utils";

const UserView = ({keyword, current}) => {
  const [data, setData] = useState({
    page: 1,
    limit: 10
  })
  const [list, setList] = useState([])
  const [countStatus, setCountStatus] = useState(true)
  useEffect(() => {
    setData({
      page: 1,
      limit: 10,
      keyword: keyword
    })
    setList([])

  }, [keyword])
  useEffect(() => {
    getUserList()
  }, [data])
  const filterList = (key, list, falg) => {
    return list.map(item => {
      if (item.userIdString === key) {
        if (falg) {
          item.userFollowStatus = '1'
        } else {
          item.userFollowStatus = '0'
        }
      }
      return item
    })
  }
  const getUserList = () => {
    const {keyword} = data
    if(keyword){
      getSearchUserList(data, res => {
        const {userList} = res
        if (userList && userList.length > 0) {
          setList([...list, ...userList])
        } else {
          setCountStatus(false)
        }
      })
    }
  }
  const createView = (list) => {
    return list.map(item => {
      const {
        userIdString,
        username,
        userLevelSign,
        profile,
        level,
        introduction,
        userLevelImage,
        userFollowStatus
      } = item
      return (
        <View className='search_user_box'>
          <View className='search_user_content'>
            <View className='search_user_profile dakale_profile' style={profile ? backgroundObj(profile) : {}}></View>
            <View className='search_user_details'>
              <View className='search_user_name font_hide'>{username} <Image className='userLevel_Image' src={userLevelImage} lazyLoad mode='scaleToFill'></Image></View>
              <View className='search_user_dec font_hide'>{introduction}</View>
            </View>
            {userFollowStatus !== '1' ?

              <View className='search_user_btn search_user_btnStyle1'
                    onClick={() => saveFollow({
                      followType: 'user',
                      followUserId: userIdString,
                    }, res => {
                      setList(filterList(userIdString, list, true))
                    })}>关注</View> :
              <View
                onClick={() => deleteFollow({
                followUserId: userIdString,
              }, res => {
                setList(filterList(userIdString, list, false))
              })} className='search_user_btn search_user_btnStyle2'>已关注</View>
            }
          </View>
        </View>
      )
    })
  }
  useReachBottom(() => {
    if (countStatus && current ==2) {
      setData({
        ...data,
        page: data.page + 1
      })
    }
  })
  return (<View style={current == 2 ? {display: 'block'} : {display: 'none'}}>
    <View className='flex_auto'>
      {list.length > 0 ?
        <View className='search_shopPubu'>
          {createView(list)}
        </View>
        :
        <View className='search_shopNO'>
          <View className='search_shopImg'></View>
          <View className='search_shopImgfont color2 font28'>暂无找到想要的结果，换个关键词试试吧</View>
        </View>
      }
    </View>
  </View>)
}
export default UserView
