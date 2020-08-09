import Taro, { Component } from '@tarojs/taro'
import { View,Text, Swiper, SwiperItem } from '@tarojs/components'
import Nav from './../../../layout/layoutNav'
import {wxapiPost} from './../../../api/api'
import Ajax from './../../../api/request'
import Utils from './../../../utils/utils'
import './index.scss'
import {inject, observer} from "@tarojs/mobx";
@inject('beanStore')
@observer
class beanMark extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '打卡领卡豆' ,
  }
  constructor () {
    super(...arguments)
    this.state = {
      title : '打卡领卡豆' ,
      showType: 0,
      beanMarKData: {

      }
    }
  }


  componentDidShow() {
  this.getInit()
  }
  getInit() {
    const {beanStore:{beanMarks ,code,merchantId}} =this.props
    this.setState({
      beanMarKData: beanMarks,
      code: code,
      merchantId: merchantId
    },res =>{
      if(this.state.code =='3002' ||this.state.code =='4003' ){
        this.setState({
          showType: 1,
        })
      }
      else if(this.state.beanMarKData.resultCode =='3018'){
        this.setState({
          showType: 2,
        })
      }
      else if(this.state.beanMarKData.resultCode !='3018' && this.state.beanMarKData.length>=2){
        this.setState({
          showType: 0,
        })
      }
      else {
        this.setState({
          showType: 3,
        })
      }
    })
  }
  saveBeanMark() {
    Ajax({
      data: {merchantId: this.state.merchantId.merchantId},
      url: wxapiPost.wechatBeanMark,
    },'post').then(
      res => {
        const {errMsg} = res
        if (errMsg === 'request:ok') {
          const {success,resultCode, resultDesc} = res.data
          if (success) {
            let {content} = res.data
            if(content.resultCode == '3018'){
              this.setState({
                showType: 2,
              })
              Utils.Toast('无法打卡，不在打卡范围内')
            }
            else {
              this.setState({
                showType: 0,
                beanMarKData: content
              })
            }
          }
          else {
            this.setState({
              showType: 1,
            })
            Utils.Toast(resultDesc)
          }
        }
      }
    ).catch(e =>{
      Utils.Toast(e)
    })
  }
  render () {
    const { title,showType ,beanMarKData } =  this.state
    return (
      <View>
        <Nav title={title}></Nav>
        {showType === 0 && <View className='mark_success'>
          <View className='mark_success_icon'></View>
          <View className='mark_success_title'></View>
          <View className='mark_success_bean'>+<Text className='mark_success_beanNum'>{beanMarKData.beanAmount}</Text>卡豆</View>
          <View className='mark_success_btn'>看分享领卡豆</View>
          <View className='mark_success_linkBtn mark_success_linkColor1' onClick={ () =>Utils.goBack()}>我要点单</View>
          <View className='mark_success_linkBtn mark_success_linkColor2' onClick={ () =>Utils.goBack()}>继续打卡</View>
          <View className='mark_success_linkBtn mark_success_linkColor3' onClick={ () =>Utils.navigateTo('/pages/user/record/index')}>我的卡豆</View>
        </View>}
        {showType === 1 &&
        <View className='mark_fail'>
          <View className='mark_failIcon'></View>
          <View className='mark_failTitle'>操作失败</View>
          <View className='mark_failBtn mark_failColor1' onClick={ () =>this.saveBeanMark()}>再次尝试</View>
          <View className='mark_failBtn mark_failColor2' onClick={ () =>Utils.goBack() }>取消</View>
        </View>}
        {showType ===2 &&
        <View className='mark_fail1'>
          <View className='mark_failIcon'></View>
          <View className='mark_failTitle'>抱歉～未在门店打卡范围内</View>
          <View className='mark_failBtn mark_failColor1' onClick={ () =>Utils.navigateTo('/pages/perimeter/map/index')}>去导航</View>
          <View className='mark_failBtn mark_failColor2' onClick={ () =>Utils.goBack()}>取消</View>
        </View>
        }
        {showType ===3 && <View className='mark_netWork'>
          <View className='mark_NetworkIcon'></View>
          <View className='mark_failTitle'>网络异常</View>
          <View className='mark_failBtn mark_failColor1' onClick={ () =>this.saveBeanMark()}>再次尝试</View>
          <View className='mark_failBtn mark_failColor2' onClick={ () =>Utils.goBack() }>取消</View>
        </View>}
      </View>
    )
  }
}

export default beanMark
