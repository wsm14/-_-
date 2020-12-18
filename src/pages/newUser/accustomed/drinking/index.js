import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text, Swiper,Image, SwiperItem} from '@tarojs/components'
import Utils from '../../../../utils/utils'
import './index.scss'
import {wxapiGet ,wxapiPost} from "./../../../../api/api";
import Ajax from "./../../../../api/request";
import classNames from  'classnames'
const setList = (num) =>{
  let list = []
  for(let i = 0; i<num; i++){
     list .push(i)
  }
  return list
}
//设置喝水次数状态
const filter = (item,drinkNum,markStatus) =>{
  const style = {}
  if(markStatus == 0 ){
    if(item > drinkNum-1) {
      style.icon = 'drinking_statusIcon drinking_statusFalse'
      style.font = 'drinking_font drinking_falseColor'
    }
    else if(item == drinkNum-1){
      style.icon = 'drinking_statusNow'
      style.font = 'drinking_font drinking_falseColor'
    }
    else {
      style.icon = 'drinking_statusIcon drinking_statusTrue'
      style.font = 'drinking_font drinking_trueColor'
    }
  }
  else {
    if(item > drinkNum) {
      style.icon = 'drinking_statusIcon drinking_statusFalse'
      style.font = 'drinking_font drinking_falseColor'
    }
    else if(item == drinkNum){
      style.icon = 'drinking_statusNow'
      style.font = 'drinking_font drinking_falseColor'
    }
    else {
      style.icon = 'drinking_statusIcon drinking_statusTrue'
      style.font = 'drinking_font drinking_trueColor'
    }
  }

  return style
}
//设置喝水字体样式
class drinking extends Taro.Component{
  defaultProps = {}
  config = {
    navigationBarTitleText: '八杯水打卡' ,
  }
  constructor () {
    super(...arguments)
    this.state = {
      userHabitMarkInfo: {},
      drinkNum: '',
      countDown: '',
      markStatus: '',
      type: '0'
    }
  }
  componentDidShow() {
    this.getMarkDetail();
  }
  getType(code,timeCode) {
    if((code == 0 && timeCode == 0)||(code == 2 && timeCode == 0)){
      this.setState({
        type: 0
      })
    }
    else if(code == 1){
      this.setState({
        type: 1
      })
    }
    else if(code == 2 && timeCode != 0){
      this.setState({
        type: 2
      },res =>{
        Utils.setInterVal(this.state.countDown,this.setInteval.bind(this))
      })
    }
  }
  getMarkDetail(){
    Ajax({
      data: {subIdentify: 'drinking',
             identify: 'custom'},
      url: wxapiGet.wechatGetMarkDetail
    }, 'get').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success, resultDesc} = res.data
          if (success) {
            let {content: {userHabitMarkInfo,drinkNum, countDown, markStatus}} = res.data

            this.setState({
              drinkNum, countDown, markStatus,userHabitMarkInfo:JSON.parse(userHabitMarkInfo)
            },res =>{
              this.getType(this.state.markStatus,this.state.countDown)
            })
          } else {
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  setMarkDetail(){
    const  {type} = this.state
    if(type == 0){
      Ajax({
        data: {},
        url: wxapiPost.wechatDrinkingMark
      }, 'post').then(
        res => {
          const {errMsg} = res
          if (errMsg === 'request:ok') {
            const {success, resultDesc} = res.data
            if (success) {
              let {content: {drinkNum, countDown, markStatus}} = res.data
              this.setState({
                drinkNum, countDown, markStatus
              }, ()=>{
                this.getType(this.state.markStatus,this.state.countDown)
              })
            } else {
              Utils.Toast(resultDesc)
            }
          }
        }
      )
    }
    else if(type == 1){
      Utils.navigateTo('/pages/index/lookShare/index')
    }
    else if(type == 2){
      Utils.Toast('正在喝水')
    }
    else {

    }
  }//获取习惯打卡内容
  setInteval(time){
    this.setState({
      countDown:time
    })
  }

  render() {
    const { countDown ,drinkNum ,markStatus ,userHabitMarkInfo,type} = this.state
    const list = setList(8)
    let data =  userHabitMarkInfo.todayDate?userHabitMarkInfo.todayDate.split('-') : []
    return(
      <View className='drinking_box'>
        <View className='drinking_titleBox'>
          <View className='drinking_title'>
            <View className='drinking_titleTop'>
              <View className='drinking_titleIcon'>
                {userHabitMarkInfo.title}
              </View>
              <View className='drinking_titleBack' onClick={ () => Utils.goBack()}></View>
            </View>
            {/*早起挑战赛和回退按钮*/}
          </View>
          <View className='drinking_dates'>
            <View className='drinking_mounth'>{data[2]}</View>
            <View className='drinking_years'>{data[0]+'.'+data[1]}</View>
          </View>
          <View className='drinking_encourage'>
          </View>
          <View className='drinking_drinkIcon'>
          </View>
          <View className='drinking_details'>
            <View className='drinking_date'><Text className='drinking_dateNum'>{parseInt(userHabitMarkInfo.serialDayNum)}</Text>天</View>
            <View className='drinking_details_decitory'>{userHabitMarkInfo.serialDayDesc}</View>
            <View className='drinking_details_people'><Text className='drinking_details_peopleNum'>{userHabitMarkInfo.signAmount}人</Text>正在参与</View>
          </View>
        </View>
          {/*喝水上面部分*/}
        <View className='drinking_status clearfix'>
          {list.map(item =>{
            const style = filter(item,drinkNum)
            return (
              <View className='drinking_statusBox' key={item}>
                <View className={style.icon}></View>
                <View className={style.font}>第{item+1}天</View>
              </View>
            )
          })
          }
        </View>
           {/*喝水次数 */}
        <View className='drinking_btn' onClick={() =>this.setMarkDetail() }>
          {type == '0' && '喝水打卡' ||
           type == '1' && '看分享领卡豆'||
           type == '2' && '00:'+ countDown}
        </View>
      </View>
    )
  }
}
export default drinking
