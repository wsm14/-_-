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
class customizeHabit extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '自定义打卡',
  }
  constructor() {
    super(...arguments);
    this.state = {
      title : '自定义好习惯',
      addHabitList: [],//用户已选择的数组
      notAddHabitList: [],//用户未选择的数组
      CustomMarkInfo: {
        identify: 'custom',
      }//后端请求参数  包含种类
    }
  }
  componentDidShow() {
    this.getlistCustomMarkInfo()
  }
  getlistCustomMarkInfo(){
    Ajax({
      data:this.state.CustomMarkInfo,
      url: wxapiGet.wechatlistCustomMarkInfo
    },'get').then(
      res=>{
        const {errMsg} = res
        if(errMsg === 'request:ok'){
          const {success,resultDesc} = res.data
          if(success){
            const { content: {addHabitList,notAddHabitList}} =res.data
            this.setState({
              addHabitList: addHabitList||[],
              notAddHabitList: notAddHabitList||[]
            })
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      }
    )
  }
  deleteUserHabit(subIdentify){
    Ajax({
      data:{
        identify: 'custom',
        subIdentify: subIdentify
      },
      url: wxapiPost.wechatlistDeleteUserHabit
    },'post').then(
      res=>{
        const {errMsg} = res
        if(errMsg === 'request:ok'){
          const {success,resultDesc} = res.data
          if(success){
            this.getlistCustomMarkInfo()
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      }
    )
  }
  saveUserHabit(subIdentify) {
    Ajax({
      data: {
        identify: 'custom',
        markWeek: '',
        subIdentify:subIdentify,
        notifyTime: '',
        subIdentifyValue: '',
        customFlag: '0'
      },
      url: wxapiPost.wechatlistUserHabit
    },'post').then(
      res=>{
        const {errMsg} = res
        if(errMsg === 'request:ok'){
          const {success,resultDesc} = res.data
          if(success){
            this.getlistCustomMarkInfo()
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      }
    )
  }
  //请求数据接口
  render () {
    const { title ,addHabitList,notAddHabitList} = this.state
    return (
      <View className='page_custom'>
        <Nav title={title}></Nav>
        {/*导航栏*/}
        <View className='custom_box'>
          {addHabitList.length>0&&<View className='custom_title'>
            已添加
          </View>}
          <View className='custom_body'>
            {addHabitList.map(item =>{
              return (
                <View key={item.id} className='custom_Tag cleanfix'>
                  <View className='custom_TagIcon'></View>
                  <View className='custom_details'>{item.subIdentifyValue}</View>
                  <View className='custom_Change custom_close' onClick={()=>this.deleteUserHabit(item.subIdentify,item.id)}></View>
                </View>
              )
            })}
          </View>
          {notAddHabitList.length>0&&<View className='custom_title1'>
            未添加
          </View>}
          <View className='custom_body'>
            {notAddHabitList.map(item =>{
              return (
                <View key={item.id} className='custom_Tag cleanfix'>
                  <View className='custom_TagIcon'></View>
                  <View className='custom_details'>{item.subIdentifyValue}</View>
                  <View className='custom_Change custom_open' onClick={()=>this.saveUserHabit(item.subIdentify)}></View>
                </View>
              )
            })}
          </View>
        </View>
        {/*关爱打卡选项*/}
        {/*添加按钮*/}
      </View>
    )
  }
}

export default customizeHabit
