import Taro,{getCurrentPages} from '@tarojs/taro'
import React ,{ Component }  from 'react'
import { View,Text} from '@tarojs/components'
import {AtButton} from 'taro-ui'
import './index.scss'
import { observer, inject } from 'mobx-react'
import Utils from './../../utils/utils'
@inject('store')
@observer
class Index extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '微信授权',
    navigationStyle:'default'
  }
  constructor() {
    super(...arguments);
    this.state = {
      btnType:{
        type:'',
        fn:this.setAuth,
        handleType:'0',
        text: '微信授权登录',
      },//授權參數
    }
  }
  setPropsState = (obj)=>{
    this.setState({
      ...obj
    })
  }
  setUserInfo = (e) =>{
    Utils.authGetUserInfo(e,res=>{
      const { errMsg } = res
      if(errMsg && errMsg != 'request:ok'){
        Utils.errorToast('服务器异常')
      }
      else{
        const {data :{success,content:{userInfo},resultDesc}} = res
        if(success){
          const {data :{content:{userInfo}}} = res
          Taro.setStorageSync('userInfo',userInfo)
          this.setState({
            btnType:{
              type:'getPhoneNumber',
              fn:this.setAuth,
              handleType:'1',
              text: '授权手机号码'
            }
          },()=>{
             this.props.store.authStore.setUserInfoStore(Taro.getStorageSync('userInfo'))
          })
        }
        else {
           Utils.Toast(resultDesc)
        }
      }
    })
  }//授权用户
  setAuth =(e,type) =>{
    if(type == 0){

    }
    if(type == 1) {
      this.setTelePhone(e)
    }
    if(type == 2) {
      this.setUserInfo(e)
    }
  }//用戶授权点击事件
  setTelePhone = (e) =>{
    Utils.bindTelephone(e,res=>{
      const { errMsg } = res
      if(errMsg && errMsg != 'request:ok'){
        Utils.errorToast('服务器异常')
      }
      else{
        const {data :{success,content:{userInfo},resultDesc}} = res
        if(success){
          Taro.setStorageSync('userInfo',userInfo)
          this.setState({
            btnType:{
              type:'',
              fn:'',
              handleType:'',
            },
          },res =>{
            this.props.store.authStore.setUserInfoStore(Taro.getStorageSync('userInfo'))
            Utils.goBack('登录成功')
          })
        }
        else {
          Utils.Toast(resultDesc)
        }
      }
    })
  }//授权手机号
  setHomeinit = () => {
    if(Taro.getStorageSync('userInfo') &&  Taro.getStorageSync('userInfo')!==undefined && Taro.getStorageSync('userInfo').mobile.length===11){
       return
    }
    //如果已经授权
    else{
      Utils.initialize(res =>{
        if(typeof res ==='number'){
          if(res === 1){
            this.setPropsState({
              btnType:  {
                type:'getPhoneNumber',
                handleType: res,
                fn: this.setAuth,
                text: '授权手机号码'
              }
            })
          }
          else if(res === 2){
            this.setPropsState({
              btnType: {
                type:'getUserInfo',
                handleType:res,
                fn:this.setAuth,
                text: '授权个人信息'
              }
            })
          }
          else if(res === 0){
            this.props.store.authStore.setUserInfoStore(Taro.getStorageSync('userInfo'))
            Utils.goBack('登录成功')
          }
        }
      })
    }
    //如果未授权则调用初始化函数根据初始化数据进行对于操作  type 1 未授权手机  type 2 信息手机未授权
  } // 判断用户是否授权
  componentDidShow() {
    Taro.clearStorage({
      success: res => {
        this.setHomeinit();
      },
      fail: res => {
        toast('缓存清理错误')
      }
    })

  }
  render () {
    const {btnType} = this.state
    return (
      <View className='auth_box'>
        <View className='auth_logo'>
        </View>
        <View>
          <AtButton
            className='btn-button'q
            openType = {btnType.type}
            onGetUserInfo = {(e) => btnType.fn(e,btnType.handleType)}
            onGetPhoneNumber = {(e) => btnType.fn(e,btnType.handleType)}
            >
            {btnType.text}
          </AtButton>
        </View>
        <View className='auth_logo2'>
          <View className='auth_logoImg'></View>
          <View className='auth_condition'>
            登录即为同意使用
            <Text className='auth_treaty'>《用户协议》</Text>
            <Text className='auth_conceal'>《隐私政策》</Text>
          </View>
        </View>
      </View>
    )
  }
}

export default Index
