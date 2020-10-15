import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {View, Text,Input,PickerView} from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import {wxapiGet,wxapiPost} from './../../../../api/api'
import Ajax from './../../../../api/request'
import Utils from './../../../../utils/utils'
import Nav from '../../../../layout/layoutNav/index'
import {AtTextarea} from "taro-ui";
class AddExpress extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '习惯打卡',
  }
  constructor() {
    super(...arguments);
    const date = new Date()
    const hours = []
    const minutes = []
    for (let i = 0; i < 24; i++) {
      if(i <10){
        i = '0'+ i
      }
      hours.push(i)
    }
    for (let i = 0; i <= 59; i++) {
      if(i <10){
        i = '0'+ i
      }
      minutes.push(i)
    }
    this.state = {
      title: '添加',
      dateType: [
        {id: "1", name: '周一'},
        {id: "2", name: '周二'},
        {id: "3", name: '周三'},
        {id: "4", name: '周四'},
        {id: "5", name: '周五'},
        {id: "6", name: '周六'},
        {id: "7", name: '周日'}
      ],//打卡周數組
      btn:true,
      saveUserHabit:{
        identify: 'care',
        markWeek: '',
        notifyTime: '',
        subIdentifyValue: '',
        customFlag: '1',
        subIdentify: '',
      },
      visible: false,
      hours:hours,
      minutes:minutes,
      value:[date.getHours(),date.getMinutes()],
      week: [],
      time:[]
    }
  }
  componentDidShow() {

  }
  onWeek(id){
    const {week} = this.state
    if(week.includes(id)){
      const arr =  week.filter(item =>{
        return item!=id
      })
      this.setState({
        week:[...arr]
      })
    }
    else {
      week.push(id)
      this.setState({
        week:[...week]
      })
    }
  }
  onTime(){
    const {value,time} = this.state
    if(value[0]<10){
      value[0] = '0'+ value[0]
    }
    if(value[1]<10){
      value[1] = '0'+ value[1]
    }
    let times = value[0]+':'+value[1]
    if(time.includes(times)){
       this.setState({
         visible: false
       })
       return
    }
    else {
      time.push(times)
      this.setState({
        time:[...time],
        visible: false
      })
    }
  }
  onChange(e) {
   this.setState({
     value:[...e.target.value]
   })
  }
  saveExpress() {
    const {week , time ,saveUserHabit, btn} = this.state
    if(week.length != 0 && time.length!=0 &&saveUserHabit.subIdentifyValue){
      if(btn == true){
        this.setState({
          btn: false
        })
        Ajax({
          data: {
            ...this.state.saveUserHabit,
            markWeek:week.join(','),
            notifyTime: time.join(','),
          },
          url: wxapiPost.wechatlistUserHabit
        },'post').then(
          res=>{
            const {errMsg} = res
            if(errMsg === 'request:ok'){
              const {success,resultDesc} = res.data
              if(success){

                Utils.goBack()
              }
              else {
                Utils.Toast(resultDesc)
              }
              this.setState({
                btn: true
              })
            }
          }
        )
      }
      else {
        Utils.Toast('请勿重复提交')
      }
    }
    else{
     Utils.Toast('请把资料填写完整')
    }
  }
  render () {
  const {title,dateType,visible,saveUserHabit,week,time } = this.state
    return (
      <View className='page_add_express'>
        <Nav title={title}></Nav>
        {/*导航栏*/}
        <View className='add_expressName'>
          目标名称
          <Input className='add_expressInput' onChange={(e) => this.setState({
            saveUserHabit:{
              ...saveUserHabit,
              subIdentifyValue:e.target.value
             }
            })}
            value={saveUserHabit.subIdentifyValue}
            placeholderClass='placeholders'
            placeholder='点击输入目标名称'>
          </Input>
        </View>
        {/*目标名称*/}
        <View className='add_expressDate'>
          打卡日期
          <View className='add_express_select cleanfix'>
            {dateType.map(item=>{
              return(
                <View key={item.id}
                  className={classNames('add_express_check', week.includes(item.id)?'add_express_onCheck':'add_express_noCheck')}
                  onClick={()=>this.onWeek(item.id)}
                >
                  {item.name}
                </View>
              )
            })}
          </View>
        </View>
        {/*打卡日期*/}
        <View className='add_expressTime'>
          提醒时间
          <View className='add_expressTimeBox'>
            <View className='add_expressTime_tags'>
              <View className='add_expressTime_Btn'>
                <View className='add_expressTime_BtnIcon' onClick={() => this.setState({visible:true})}></View>
              </View>
              {time.map((item,index) =>{
                return (
                  <View className={classNames('add_express_tag', (index+1)%4 ==0 && 'add_express_left', (index+1)>=4 && 'add_express_top')} key={index}>
                    {item}
                    <View className='close_express_tag' onClick={() => {
                      time.splice(index,1)
                      this.setState({
                        time: [...time],
                      })
                    }}></View>
                  </View>
                )
              })}
            </View>
          </View>
        </View>
         {/*提醒时间*/}
        {visible?
          <View className='express_selected' onClick={() => this.setState({visible: false})}>
            <View className='express_selectedBox' onClick={ (e)=> e.stopPropagation()}>
              <View className='express_selectedBtn cleanfix'>
                <View className='express_closeBtn' onClick={() => this.setState({visible:false})}>取消</View>
                 <View>提醒时间</View>
                <View className='express_onBtn' onClick={() => this.onTime()}>确定 </View>
              </View>
              <PickerView className='express_Picker cleanfix' value={this.state.value} onChange={this.onChange}>
                <PickerViewColumn className='express_PickerViewColumn '>
                  {this.state.hours.map((item,index) => {
                    return (
                      <View className='column1' key={index}>{item}</View>
                    );
                  })}
                </PickerViewColumn>
                <PickerViewColumn className='express_PickerViewColumn '>
                  {this.state.minutes.map((item,index) => {
                    return (
                      <View className='column2' key={index}>{item}</View>
                    )
                  })}
                </PickerViewColumn>
              </PickerView>
            </View>
          </View> :
          null}
        <View className='add_express_submit' onClick={()=>this.saveExpress()}>确定</View>
      </View>
    )
  }
}

export default AddExpress
