import React, { Component } from 'react'
import Taro ,{getCurrentInstance} from '@tarojs/taro'
import { View,Text, Swiper,Image, SwiperItem} from '@tarojs/components'
import {AtToast,AtTabBar} from "taro-ui"
import Utils from './../../../../utils/utils'
import './index.scss'
import {wxapiGet ,wxapiPost} from "./../../../../api/api";
import Ajax from "./../../../../api/request";
import classNames from  'classnames'
class HibitCard extends Component{
  defaultProps = {}
  config = {
    navigationBarTitleText: '好习惯打卡' ,
  }
  constructor () {
    super(...arguments)
    const habit =
      [
        {name:'wakeUp' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon60.png'},
        {name:'breakFast',backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon61.png'},
        {name:'lunch' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon62.png'},
        {name:'dinner' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon63.png'},
        {name:'sleep' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon64.png'},

        //早餐
        {name:'phone',backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon77.png'},
        {name:'takeMedicine' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon78.png'},
        {name:'bloodPressure' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon79.png'},
        {name:'bloodSugar' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon80.png'},
        //关爱

        {name:'money',backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon81.png'},
        {name:'read' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon82.png'},
        {name:'fruit' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon83.png'},
        {name:'accompany' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon84.png'},
        {name:'skincare' ,backgroundUrl:'https://dakale-web.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/index/icon85.png'}
        //自定义
        ]
    let list =  habit.filter(item =>{
      if(item.name.includes(getCurrentInstance().router.params.subIdentify)){
        return item
      }
   })
    this.state = {
      countDown:'',
      markStatus:'',
      userHabitMarkInfo:{},
      list:list
    }
  }
 componentDidMount() {
   if(Object.keys(getCurrentInstance().router.params).length===0){
     Utils.Toast('参数错误，回到习惯打卡页面')
     Utils.navigateTo('pages/index/accustomed/index')
   }
   else {
    this.getMarkDetail(getCurrentInstance().router.params)
   }
 }
 getMarkDetail(data) {
   Ajax({
     data:data,
     url: wxapiGet.wechatGetMarkDetail
   },'get').then(
     res=>{
       const {errMsg} = res
       if(errMsg === 'request:ok'){
         const {success,resultDesc} = res.data
         if(success){
          let { content:{countDown,markStatus,userHabitMarkInfo} } =res.data
           userHabitMarkInfo = JSON.parse( userHabitMarkInfo)
           this.setState({
             countDown,
             markStatus,
             userHabitMarkInfo
           })
         }
         else {
           Utils.Toast(resultDesc)
         }
       }
     }
   )
 }//获取习惯打卡内容
 setMarkDetail(data){
   Ajax({
     data:data,
     url: wxapiPost.wechatUserTask
   },'post').then(
     res=>{
       const {errMsg} = res
       if(errMsg === 'request:ok'){
         const {success,resultDesc} = res.data
         if(success){
           this.setState({
             markStatus:'1'
           })
         }
         else {
           Utils.Toast(resultDesc)
         }
       }
     }
   )
 }//打卡成功改变按钮状态为看分享
 setCard(status) {
   switch (status) {
     case '0' : this.setMarkDetail(getCurrentInstance().router.params);break;
     case '1' : Utils.navigateTo('/pages/index/lookShare/index');break;
     case '2' : return;break;
     case '3' : Utils.Toast('打卡已错过');break;
     default : return ;
   }
 }
  render() {
   let {  countDown, markStatus, userHabitMarkInfo,list} = this.state
    let data =  userHabitMarkInfo.todayDate?userHabitMarkInfo.todayDate.split('-') : []
    return(
      <View className='hibitCard_box' style={list.length>0?{background:`url(${list[0].backgroundUrl})  no-repeat center/cover`}:{}}>
        <View className='hibitCard_title'>
          <View className='hibitCard_titleTop'>
            <View className='hibitCard_titleIcon'>
              {userHabitMarkInfo.title}
            </View>
            <View className='hibitCard_titleBack' onClick={ () => Utils.goBack()}></View>
          </View>
          {/*早起挑战赛和回退按钮*/}
        </View>
        <View className='hibitCard_dates'>
          <View className='hibitCard_mounth'>{data[2]}</View>
          <View className='hibitCard_years'>{data[0]+'.'+data[1]}</View>
        </View>
        <View className='hibitCard_user'>
          <View className='hibitCard_userName'>
            {userHabitMarkInfo.name}
          </View>
          <View className='hibitCard_eatFood'>
            {userHabitMarkInfo.nameDesc}
          </View>

        </View>
        <View className='hibitCard_details'>
          <View className='hibitCard_dateTitle'>{userHabitMarkInfo.serialDayDesc}</View>
          <View className='hibitCard_date'><Text className='hibitCard_datenum'>{parseInt(userHabitMarkInfo.serialDayNum)}</Text>天</View>
          <View className='hibitCard_nowDate'>{userHabitMarkInfo.todayDesc}</View>
          <View className='hibitCard_people'>{parseInt(userHabitMarkInfo.signAmount)}人<Text className='hibitCard_onPartake'>正在参与</Text></View>
        </View>
        <View className='hibitCard_btn'>
          <View className='hibitCard_submit' onClick={() =>this.setCard(markStatus)}>
          {
            markStatus === '0' && '立即打卡'||
            markStatus === '1' && '看视频领卡豆'||
            markStatus === '2' && '运动中'||
            markStatus === '3' && '错过打卡'}
          </View>
          <View className='hibitCard_Toast'>
            完成打卡即可看分享领卡豆
          </View>
        </View>
      </View>
    )
  }
}
export default HibitCard
