import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text,PickerView} from '@tarojs/components'
import { AtList, AtListItem } from 'taro-ui'
import {wxapiGet} from '../../../api/api'
import Ajax from '../../../api/request'
import Utils from '../../../utils/utils'
import './index.scss'
import Nav from '../../../layout/layoutNav/index'
class Record extends Component {
  constructor() {
    super(...arguments);
    const date = new Date()
    const years = [date.getFullYear()]
    const months = []
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    this.state = {
      years: years,
      year: date.getFullYear(),
      months: months,
      month: date.getMonth()+1,
      value: [9999, parseInt(date.getMonth())],
      visible:false,
      userMarkList: [],
      getHttpServer: {
        page : 1,
        limit : 10,
        markMonth:'',
      }
    }
  }
  componentDidShow() {
    this.getlistCard()
  }
  getBean(){
    let bean = 0
    if(this.state.userMarkList&&this.state.userMarkList.length>0){
      this.state.userMarkList.forEach(item =>{
        bean+=parseInt(item.beanAmount)
      })
    }
    return bean
  }
  getlistCard() {
    const {getHttpServer, month, year} = this.state
    this.setState({
      getHttpServer: {
        ...getHttpServer,
        markMonth: year + '-' + month
      }
    }, res => {
         this.getList()
    })
  }
  getList() {
    Ajax({
      data: this.state.getHttpServer,
      url: wxapiGet.wechatMarkTrack
    },'get').then(
      res=>{
        const {errMsg} = res
        if(errMsg === 'request:ok'){
          const {success,resultDesc} = res.data
          if(success){
            const { content: {userMarkList}} =res.data
            this.setState({
              userMarkList: userMarkList
            })
            if(userMarkList.length == '0'){
              Utils.Toast('暂无数据')
            }
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      }
    )
  }
  onChange = e => {
    const val = e.detail.value
    this.setState({
      year: this.state.years[val[0]],
      month: this.state.months[val[1]],
      value: val
    })
  }
  render () {
    const { year ,month ,visible,userMarkList} = this.state
    return (
      <View className='record_box'>
        <Nav title={'打卡记录'}></Nav>
        {visible?
          <View className='record_selected' onClick={() => this.setState({visible: false})}>
            <View className='record_selectedBox' onClick={ (e)=> e.stopPropagation()}>
              <View className='record_selectTitle'>
                <Text className='record_selectTitleIcon'>本月</Text>
              </View>
              <View className='record_date'>
                {year}-{month >= 10?parseInt(month) : '0'+parseInt(month) }
              </View>
              <PickerView className='record_Picker clearfix' value={this.state.value} onChange={this.onChange}>
                <PickerViewColumn className='record_PickerViewColumn'>
                  {this.state.years.map((item,index) => {
                    return (
                      <View key={index}>{item}年</View>
                    );
                  })}
                </PickerViewColumn>
                <PickerViewColumn className='record_PickerViewColumn'>
                  {this.state.months.map((item,index) => {
                    return (
                      <View key={index}>{item}月</View>
                    )
                  })}
                </PickerViewColumn>
              </PickerView>
              <View className='record_buttonBox cleanfix'>
                <View className='record_button record_buttonReload' onClick={() => this.setState({visible: false})}>取消</View>
                <View className='record_button record_buttonSubmit'>完成</View>
              </View>
            </View>
          </View> :
          null}
        <View className='record_timeSelect cleanfix' onClick={() => this.setState({visible: true})}>
          <View><Text>本月</Text></View>
          <View><Text>得{this.getBean()}</Text></View>
        </View>

        {userMarkList.map(item =>{
          return (
            <View key={item.merchantId} className='record_cardDetails'>
              <View className='record_cardList'>
                <View className='record_listTitle f'>
                  <View><Text>{item.merchantName}</Text></View>
                  <View>打卡成功</View>
                </View>
                <View className='record_listline'></View>
                <View className='record_listDefnite f'>
                  <View className='record_listImg' style={{background:`url(${item.coverImg}) no-repeat center/cover`}}>

                  </View>
                  <View className='record_listCondition'>
                    <View>
                      打卡时间：{item.markTime}
                    </View>
                    <View>
                      得<Text>{item.beanAmount}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        })}
      </View>
    )
  }
}

export default Record
