import React, {useEffect, useState} from "react";
import classNames from 'classnames'
import {View} from "@tarojs/components";
import {backgroundObj} from '@/common/utils'
import './../index.scss'
export default (props) => {
  const {list} = props
  const [userList ,setList] = useState([])
  useEffect(() =>{
    setList(list)
  },[list])
  return (
    <View className='list_box'>
      {userList.map((item,index) =>{
        const {
          username,
          profile,
          residentAddress,
          introduction,
          gender,
          parentTotalRevenue
        } = item
        return (
          <View key={index} className='list_tags'>
            <View className='list_details'>
              <View className='list_left'>
                <View className='list_profile' style={{...backgroundObj(profile)}}></View>
                <View className='list_dec'>
                  <View className='list_username'>
                    <View className='list_user font_hide'>{username}</View>
                    <View className={classNames('list_sex_bg' &&gender== 'F'?'list_sex_girl':'list_sex_boy' )}></View>
                    <View className='list_city'>{residentAddress}</View>
                  </View>
                  <View className='list_userDec font_hide'>
                    {introduction||'这个人什么都没有留下哦'}
                  </View>
                </View>
              </View>
              <View className='list_right'>
                <View className='list_bean'>{parentTotalRevenue||0}</View>
                <View className='list_beanDec'>贡献（卡豆)</View>
              </View>
            </View>
          </View>
        )
      })}

    </View>
  )
}
