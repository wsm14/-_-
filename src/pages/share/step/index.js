import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import { View,Text, Swiper, SwiperItem ,OpenData,Button} from '@tarojs/components'
import Utils from './../../../utils/utils'
import {wxapiGet} from './../../../api/api'
import Ajax from './../../../api/request'
if (process.env.TARO_ENV === 'h5'){
  require('./index.scss')
}
else if(process.env.TARO_ENV === 'weapp'){
  require('./index.scss')
}
class Index extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: ''
  }
  constructor() {
    super(...arguments);
    this.state = {
      cuttent:{
        type: 'step',
        value: '--'
      },
      hangleType :{
        text: '',
        btnType: '',
        btnFn: ''
      },
      appType: {
        text: '回到app',
        btnType: 'launchApp',
        btnFn: ''
      }
    }
  }
  getSetting(openId){
    Taro.getSetting({
      success:(res) => {
        if (!res.authSetting['scope.werun']) {
          Taro.authorize({
            scope: 'scope.werun',
            success:(result) => {
              //用户第一次进来并且直接就同意了
              //用户开启了权限，直接开始业务
              this.getWxRun(openId)
            },
            fail:() => {
              this.setState({
                hangleType :{
                  text: '授权微信步数',
                  btnType: 'openSetting',
                  btnFn: ''
                }
              }, res =>{
                 Utils.Toast('请点击授权按钮同步步数')
              })
              //点亮button
            }
          })
        }
        else {
          this.getWxRun(openId)
          // 用户开启了权限，直接开始业务
        }
      }
    })
  }
  getOpenId(fn){
    Utils.getCode().then(res =>{
      if(res.errMsg === "login:ok"){
        Ajax({
          data:{
            code:res.code
          },
          url:wxapiGet.wechatStepAuth
        },'get')
          .then(
            result =>{
              const { errMsg ,statusCode } = result
              if(errMsg === 'request:ok' && statusCode ===200){
                const {success,content,resultDesc} = result.data
                if(success){
                  return fn(content.openId)
                }
                else {
                  Utils.Toast(resultDesc)
                }
              }
              else{
                Utils.Toast('服务器错误')
              }
            }
          )
      }
      else {
        Utils.Toast(res.errMsg)
      }
    })
  }
  getWxRun(openId) {
    Taro.getWeRunData({
      success: result => {
        const {encryptedData , iv} = result
        Ajax({data:{encryptedData,iv,openId},url:wxapiGet.wechatStepEncryptedData}).then(
          step =>{
            const { errMsg ,statusCode } = step
            if(errMsg === 'request:ok' && statusCode ===200){
              const {success,content,resultDesc} = step.data
              if(success){
                this.setState({
                  cuttent : {
                    type: 'step',
                    value: content.step|| 0},
                  hangleType :{
                    ...this.state.appType
                  }
                })
              }
              else {
                Utils.Toast(resultDesc)
              }
            }
            else {
              Utils.Toast(errMsg)
            }
          }
        )
      }
    })
  }
  test(e){
  }
  error(e){
  }
  componentDidShow() {
    this.getOpenId( openId =>{
      this.getSetting(openId)
    })
  }
  render () {
    const { cuttent ,hangleType } = this.state
    return (
      <View className='step_box'>
        <View className='step_title'>
          <View className='step_back'>
            <View className='step_back_icon'>
            </View>
          </View>
        </View>
        <View className='step_AvatarUrl'>
          <open-data  type='userAvatarUrl'></open-data>
        </View>
        <View className='step_userInfo'>
          <open-data  type='userNickName'></open-data>
        </View>
        <View className='step_num'>
          <View>{cuttent.value}</View>
          <View>今日步数</View>
        </View>
        <View className='step_btn'>
          <Button openType={hangleType.btnType}
                  onOpenSetting={this.test}
                  app-parameter={JSON.stringify(cuttent)}
                  onError={(e) =>this.error(e)}
          >
            {hangleType.text}
          </Button>
        </View>
        <View className='step_information'>
          <View className='step_informationTitle'>
            同步微信运动方法
          </View>
          <View className='step_informationDetails'>
            1.若步数仍未获取，则点击“打开授权设置页面”按钮，允许【哒卡乐】使用我的微信步数：
          </View>
          <View className='step_informationDetails'>
            2.获取微信步数后点击“返回APP”即同步成功，可领取相关步数运动币奖励：
          </View>
          <View className='step_informationDetails'>
            3.每次进入APP点击“同步微信步数”即可同步当前最新步数。
          </View>
        </View>
      </View>
    )
  }
}

export default Index
