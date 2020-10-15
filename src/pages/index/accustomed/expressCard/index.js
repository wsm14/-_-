import React, { Component } from 'react'
import Taro,{getCurrentInstance} from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import {wxapiGet,wxapiPost} from './../../../../api/api'
import Ajax from './../../../../api/request'
import Utils from './../../../../utils/utils'
import Nav from '../../../../layout/layoutNav/index'
class Express extends Component {
  defaultProps = {}
  constructor() {
    super(...arguments);
    this.state = {
      title : '关爱目标',
      addHabitList: [],//用户已选择的数组
      notAddHabitList: [],//用户未选择的数组
      CustomMarkInfo: {
        identify: 'care',
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
        identify: 'care',
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
            identify: 'care',
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
      <View className='page_express'>
        <Nav title={title}></Nav>
        {/*导航栏*/}
        <View className='express_box'>
          {addHabitList.length>0&&<View className='express_title'>
            已添加
          </View>}
          <View className='express_body'>
            {addHabitList.map(item =>{
              return (
                <View key={item.id} className='express_Tag cleanfix'>
                  <View className='express_TagIcon'></View>
                  <View className='express_details'>{item.subIdentifyValue}</View>
                  <View className='express_Change express_close' onClick={()=>this.deleteUserHabit(item.subIdentify,item.id)}></View>
                </View>
              )
            })}
          </View>
          {notAddHabitList.length>0&&<View className='express_title1'>
            未添加
          </View>}
          <View className='express_body'>
            {notAddHabitList.map(item =>{
              return (
                <View key={item.id} className='express_Tag cleanfix'>
                  <View className='express_TagIcon'></View>
                  <View className='express_details'>{item.subIdentifyValue}</View>
                  <View className='express_Change express_open' onClick={()=>this.saveUserHabit(item.subIdentify)}></View>
                </View>
              )
            })}
          </View>
        </View>
        {/*关爱打卡选项*/}
        <View className='express_add' onClick={() => Utils.navigateTo('/pages/index/accustomed/addExpressCard/index')}></View>
        {/*添加按钮*/}
      </View>
    )
  }
}

export default Express
