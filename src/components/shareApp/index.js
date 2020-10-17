import React,{useState,useEffect} from "react";
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Button, View} from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'
import {httpGet} from "../../api/newRequest";
import {wxapiGet} from "../../api/api";
import Utils from "../../utils/utils";
export default (props) =>{
  const {userId,content,jumpObj} = props
  const [data,setData] = useState()
  useEffect(() =>{
    httpGet({data:{userId: userId},url:wxapiGet.wechatUserByUniqueId}, res =>{
      const {content:{userInfo,userInfo:{profile,username}}} = res
      setData(userInfo)
    })
  },[userId])
  return (
    <View>
     <View className = 'page_share_download'>
        <View className = 'page_share_downloadBox'>
          <View className='page_share_userDetails'>
            <View className= 'page_share_profile' style={{background:`url(${data.shareUserProfile}) no-repeat center/cover`}}></View>
            <View className= 'page_share_userBox'>
              <View className='page_share_userName'>{data.username}</View>
              <View className='page_share_userTitle'>{content}</View>
            </View>
          </View>
          <View  className='page_share_btn'>
            <Button
              appParameter={JSON.stringify(jumpObj)}
              openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle'>打开APP</Button>
          </View>
        </View>
      </View>
     <View className='page_share_openApp'>
        <Button
          appParameter={JSON.stringify({jumpUrl: 'imageMomentDetailPage',id: getUserMomentDetail.momentId
            , type : 'jumpToPage', jumpType : "native" ,path:'imageMomentDetailPage',params:{id: getUserMomentDetail.momentId}})}
          openType='launchApp' onError={(e) =>this.goAppError(e)} className='page_share_btnStyle1'>App内打开</Button>
      </View>
    </View>
  )
}
