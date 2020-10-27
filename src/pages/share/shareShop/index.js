import React, { Component } from 'react'
import Taro from '@tarojs/taro'
import {Canvas, View} from '@tarojs/components'
import {share} from '@/api/api'
import {httpGet} from '@/api/newRequest'
import QR from 'wxmp-qrcode'
import './index.scss'
import {authPhotosAlbum} from "@/common/authority";
import {navigateTo,backgroundObj,upLoadFile,toast} from "@/common/utils";
import {inject, observer} from "mobx-react";
@inject('store')
@observer
class Record extends Component {
  constructor() {
    super(...arguments);
    this.state = {
       httpData: {
         shareType: 'activity',
         subType: 'inviteMerchant'
       },
      h5Url: '',
      codeUrl:  '',
      canvasId: 'canvasId',
      showCanvas: false,
      shareFile: ''
    }
  }
  componentDidUpdate(prevProps, prevState) {
    this.createQRcode();
  }
  componentWillUnmount() {
    let userInfo = Taro.getStorageSync('userInfo');
    if(!userInfo || Object.keys(userInfo).length < 5){
       navigateTo('/pages/auth/index')
    }
  }
  getActiveInfo() {
    const {shareFriend:{getShareInfo}} = share
    const { httpData} = this.state
    httpGet({
      url:  getShareInfo,
      data: httpData
    },res => {
      const {h5Url} = res
      this.setState({
        h5Url
      })
    })
  }
  createQRcode = () => {
    let canvasId = this.state.canvasId
    let QRdata = this.state.h5Url
    QR.draw(QRdata, canvasId,() => this.canvasToTempImage(canvasId))
  }
  canvasToTempImage(canvasId) {
    let _this = this
    Taro.canvasToTempFilePath({
      canvasId,
      success: function (res) {
        let tempFilePath = res.tempFilePath; // 临时图片地址，可在放入图片src中使用
        _this.setState({
          codeUrl: res.tempFilePath
        })
      }
    })
  }
  createImg() {
    const _this = this;
    const { userInfo : {username,profile}} = this.props.store.authStore
    upLoadFile(['https://wechat-config.dakale.net/miniprogram/image/shareBackGround.png']).then(res => {
      const {path} =  res[0]
      _this.setState({
        shareFile: path
      },
        async () =>{
        const context = Taro.createCanvasContext('imgCard',this)
        context.drawImage(_this.state.shareFile, 0, 0, 540, 750,0,0,parseInt(Taro.pxTransform(270)),parseInt(Taro.pxTransform(375)));
        context.setFillStyle('white')
        context.fillRect(0,375,270,75)
        context.setFillStyle('#333333')
        context.setFontSize(12)
        context.fillText('加入哒卡乐商家，共赚收益吧!', 10, 418)
        context.drawImage(_this.state.codeUrl, 194, 375, 75, 75,0,0);
        context.draw(false, ()=> {
          Taro.canvasToTempFilePath({
            canvasId: 'imgCard',
            success: function (res) {
              const { tempFilePath  } = res
              authPhotosAlbum(tempFilePath)
              _this.setState({
                showCanvas: false,
              })
            },
            fail: res1 => {
              toast('图片生成失败')
            }
          })
        })
      })
    })
  }
  setImg = () => {
    if(!this.state.showCanvas){
      this.setState({
        showCanvas: true
      },res =>{
        this.createImg()
      })
    }
  }
  componentDidShow() {
    const { userInfo : {username,profile}} = this.props.store.authStore
    this.getActiveInfo()
  }
  render () {
    const { showCanvas } = this.state
    const { userInfo : {username,profile}} = this.props.store.authStore

    return (
      <View className='share_box'>
        <View className='img_layer'>
          <Canvas  className='imgCard' id='imgCard' canvas-id='imgCard'></Canvas>
        </View>
        <View className='share_shop_box'>
          <View className='share_shop'></View>
          <View className='share_user'>
            <View className='share_userBox'>
              <View className='share_profile' style={profile?{...backgroundObj(profile)}:{}}>

              </View>
            </View>
            <View className='share_userCenter'>
              <View className='share_userName font_hide'>
                {username}
              </View>
              <View className='share_userFont font_hide'>
                加入哒卡乐商家，共赚收益吧！
              </View>
              <Canvas id={this.state.canvasId}  canvasId={this.state.canvasId} className='share_code'></Canvas>
            </View>
          </View>
        </View>
        <View className='share_wx' onClick={this.setImg}>
          <View className='share_wx_icon'></View>
          <View className='share_wx_font'>点击保存分享图片</View>
        </View>
      </View>
    )
  }
}
export default Record
