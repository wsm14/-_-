import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text} from '@tarojs/components'
import Utils from '../../../utils/utils'
import './index.scss'
import {wxapiGet, wxapiPost} from "./../../../api/api";
import Ajax from "./../../../api/request";
class Accustomed extends Component{
  constructor () {
    super(...arguments)
    this.state = {
      userHabitList: [],//获取习惯打卡项目数组
      markCount: '0', //已打卡个数
      unmarkCount: '5', //未打卡个数
      insistDayNum: '0', //坚持天数
      simple: {
        identify: 'habit',
        subIdentify: 'wakeUp'
      },//http获取到比赛简单信息
      matchInfo: {
        matchName: '',
        matchMarkTime: "",
        totalBeanAmount: '',
        matchDate: ""
      }
    }
  }
  componentDidShow() {
    this.getRequestAll()
  }
  getUserHabit() {
    return Ajax({
        data:{},
        url: wxapiGet.wechatGetUserHabit
      },'get')
  }
  getSimpleInfo(){
    return  Ajax({
      data:this.state.simple,
      url: wxapiGet.wechatGetSimpleInfo
      },
    'get')
  }
  setFilterArray(Array,filterArray,type){
    let list = []
    Array.forEach(item =>{
      filterArray.forEach(item1 =>{
        if(item1[type] === item){
          list.push(item1)
        }
      })
    })
    return list
  }
  getRequestAll(){
    Promise.all([this.getUserHabit(),this.getSimpleInfo()]).then(
      res=>{

        let errMsg1  = res[0].errMsg
        let errMsg2  = res[1].errMsg
        if(errMsg1 === 'request:ok' && errMsg2 === 'request:ok'){
          let success1 =  res[0].data.success
          let success2 =  res[1].data.success
          if(success1 && success2){
            const { content: {userHabitList,markCount,unmarkCount,insistDayNum}} =res[0].data
            const { content: {matchInfo:{matchName,totalBeanAmount,matchMarkTime,matchDate}}} =res[1].data
            this.setState({
              userHabitList: userHabitList||[],
              markCount: markCount,
              unmarkCount: unmarkCount,
              insistDayNum: insistDayNum,
              matchInfo:{
                matchName,
                totalBeanAmount,
                matchMarkTime,
                matchDate
              }
            })
          }
          else {
            Utils.Toast(res[0].data.resultDesc || res[1].data.resultDesc)
          }
        }
      }
    )
  }
  setMarkDetail(e,data){
    e.stopPropagation()
    if(data.identify !=='subIdentify'){
      Ajax({
        data:data,
        url: wxapiPost.wechatUserTask
      },'post').then(
        res=>{
          const {errMsg} = res
          if(errMsg === 'request:ok'){
            const {success,resultDesc} = res.data
            if(success){
              this.state.userHabitList.forEach((item,index)=>{
                if(item['subIdentify'] === data['subIdentify']){
                  this.state.userHabitList[index].markStatus = 1
                  this.setState({
                    userHabitList:[...this.state.userHabitList]
                  })
                }
              })
            }
            else {
              Utils.Toast(resultDesc)
            }
          }
        }
      )
    }
    else{
      Utils.navigateTo('/pages/index/accustomed/drinking/index')
    }
  }//打卡
  goHabit(item){
    if(item.customFlag === '0' && item.subIdentify !=='drinking'){
      Utils.navigateTo(`/pages/index/accustomed/habitCard/index?subIdentify=${item.subIdentify}&identify=${item.identify}`)
    }
    else if(item.customFlag === '0' && item.subIdentify ==='drinking'){
      Utils.navigateTo('/pages/index/accustomed/drinking/index')
    }
  }
  render() {
    const {markCount,unmarkCount,insistDayNum,userHabitList,matchInfo} = this.state
    const habit = ['wakeUp','breakFast','lunch','dinner' ,'sleep']
    const curelist =this.setFilterArray(['care'],userHabitList,'identify')
    const habitList = this.setFilterArray(habit,userHabitList,'subIdentify')
    const customlist = this.setFilterArray(['custom'],userHabitList,'identify')
    return(
      <View className='Accustomed_box'>
        <View className='Accustomed_title'>
          <View className='Accustomed_titleTop'>
            <View className='Accustomed_titleIcon'></View>
            <View className='Accustomed_titleBack' onClick={() => Utils.goBack()}></View>
          </View>
          {/*早起挑战赛和回退按钮*/}

          <View className='Accustomed_titleBean'>
            达标赛总奖池(卡豆)
          </View>


          {/* 达标赛总奖池标题*/}
          <View className='Accustomed_titleBeanNum'>
            {matchInfo.totalBeanAmount}
          </View>

          {/* 奖池卡豆数量 */}
          <View className='Accustomed_titleCard_times'>
            <Text className='Accustomed_titleCard_date'>
              {matchInfo.matchDate}
            </Text>
            <Text className='Accustomed_titleCard_dateTime'>
            打卡时间:{matchInfo.matchMarkTime}
            </Text>
          </View>

          {/* 比赛时间 */}
          <View className='Accustomed_titleCard_record'>
            还有<Text className='Accustomed_titleCard_aguments'>{unmarkCount}项</Text>未打卡,最长习惯坚持<Text className='Accustomed_titleCard_aguments'>{insistDayNum}天</Text>
          </View>

          {/* 打卡记录 */}
        </View>
        <View className='Accustomed_body'>
          <View className='Accustomed_itemize'>
            {habitList.map((item,index) =>{
              let str = `Accustomed_habit Accustomed_habitbg${index+1}`
              return (
                <View key={index} className={str} onClick={ () => Utils.navigateTo(`/pages/index/accustomed/habitCard/index?subIdentify=${item.subIdentify}&identify=${item.identify}`)}>
                  <View className='Accustomed_habit_title'>{item.subIdentifyValue}</View>
                  {item.markStatus == 0?
                    <View className='Accustomed_habit_btn btncolor'>
                    <Text className='Accustomed_habit_btnIcon'>打卡</Text>
                  </View>:
                    <View className='Accustomed_habit_btn' style={{background:'rgba(242, 242, 242, 1)',color:'rgba(165, 165, 165, 1)'}}>
                      <Text>
                         {item.markStatus === '1' && '已打卡'||
                          item.markStatus === '2' && '运动中'||
                          item.markStatus === '3' && '错过打卡'}</Text>
                    </View>
                  }
                </View>
              )
            })}
            <View className='Accustomed_habit Accustomed_habitbg6'>
              <View className='Accustomed_census'>
                <View className='Accustomed_censusNow'>
                  今日打卡
                </View>
                <View className='Accustomed_term'>
                  {markCount}项
                </View>
              </View>
            </View>
          </View>
          {/* 习惯打卡 */}
          <View className='Accustomed_enlist' onClick={() => Utils.navigateTo('/pages/index/accustomed/sportsPoster/index')}></View>
          {/* 比赛报名 */}
          <View className='Accustomed_express'>
            <View className='Accustomed_expressTitle'>关爱打卡</View>
            <View className='Accustomed_expressDetails'>指定事件前未完成目标.我们会提醒你哦</View>
            <View className='Accustomed_expresstakeCard'>
              {curelist.map((item,index) =>{
                return (
                  <View key={index} className='Accustomed_listTakeCard' onClick={() => this.goHabit(item)}>
                    <View className='Accustomed_listTakeleft cleanfix'>
                      <View className='listTakeleft_icon'>
                      </View>
                      <View className='listTakeleft_details'>
                        <View className='details_title'>
                          {item.subIdentifyValue}
                        </View>
                        <View className='details_Date'>
                          已坚持完成<Text className='date_Time'>{item.serialDayAmount}</Text>天
                        </View>
                      </View>
                    </View>

                      {item.markStatus === '0'?
                        <View className='Accustomed_listTakerignt Accustomed_listRightColor1' onClick={ (e) => this.setMarkDetail(e,{identify:item.identify,subIdentify:item.subIdentify})}>打卡</View>:
                        <View className='Accustomed_listTakerignt Accustomed_listRightColor2'  onClick={ (e) => {return e.stopPropagation()}}>已完成</View>
                      }

                  </View>
                )
              })}
              <View className='Accustomed_insertTakeCard'>
                <View className='Accustomed_insertBtn color1' onClick={()=>Utils.navigateTo(`/pages/index/accustomed/expressCard/index`) }>
                  <Text className='Accustomed_insertBtnIcon'>添加目标</Text>
                </View>
              </View>
            </View>
          </View>
          {/* 关爱打卡 */}
          <View className='Accustomed_customize'>
            <View className='Accustomed_customizeTitle'>自定义好习惯</View>
            <View className='Accustomed_customizeTakeCard'>
              {customlist.map((item,index) =>{
                return (
                  <View key={index} className='Accustomed_listTakeCard'  onClick={() => this.goHabit(item)}>
                    <View className='Accustomed_listTakeleft cleanfix'>
                      <View className='listTakeleft_icon'>
                      </View>
                      <View className='listTakeleft_details'>
                        <View className='details_title'>
                          {item.subIdentifyValue}
                        </View>
                        <View className='details_Date'>
                          已坚持完成<Text className='date_Time'>{item.serialDayAmount}</Text>天
                        </View>
                      </View>
                    </View>

                    {item.markStatus === '0'?
                      <View className='Accustomed_listTakerignt Accustomed_listRightColor1'onClick={ (e) => this.setMarkDetail(e,{identify:item.identify,subIdentify:item.subIdentify})}>打卡</View>:
                      <View className='Accustomed_listTakerignt Accustomed_listRightColor2'  onClick={ (e) => {return e.stopPropagation()}}>已完成</View>
                    }

                  </View>
                )
              })}
              <View  className='Accustomed_insertTakeCard' onClick={ () => Utils.navigateTo('/pages/index/accustomed/customizeHabit/index')}>
                <View className='Accustomed_insertBtn color2'>
                  <Text className='Accustomed_insertBtnIcon'>添加习惯</Text>
                </View>
              </View>
            </View>
          </View>
          {/* 自定义打卡 */}
        </View>
      </View>
    )
  }
}
export default Accustomed
