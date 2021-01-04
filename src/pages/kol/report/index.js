import React, {Component, useState} from 'react'
import {View, Text} from '@tarojs/components'
import Taro ,{getCurrentInstance}from "@tarojs/taro";
import './index.scss'
import {toast} from '@/common/utils'
import {navigateTo,redirectTo,goBack} from "@/common/utils";
import {saveUserReport} from '@/server/kol'
import classNames from 'classnames'
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userInfo: {
        name: getCurrentInstance().router.params.name||'嘻嘻'
      },
      list:[
        '搬运抄袭','色情低俗','违法违规','虚假造谣','诈骗信息', '宣扬仇恨','人身攻击','有害信息','侵权'
      ],
      httpData: {
        reportReason: '违法违规',
        ...getCurrentInstance().router.params
      },
      visible: false
    }
  }
  componentDidMount() {

  }
  saveReport() {
    const {  httpData :{reportReason},httpData} = this.state
    if(reportReason!= '') {
      saveUserReport(httpData,res => {
        this.setState({
          visible: true
        })
      })
    }
    else {
      toast('请选择举报原因')
    }
  }
  errorToast(e) {
  }

  render() {
    const {
      userInfo:{name},
      list,
      httpData:{reportReason},
      visible
    } = this.state
    return (
      <View className='report_box'>
        <View className='report_user font32 color1'>
          举报@<Text className='bold'>{name}</Text>的分享
        </View>
        <View className='report_ly font24 color2'>选择你要举报的理由</View>
        <View className='report_tags'>
          {list.map((item,index) => {
            return (
              <View onClick={() => {this.setState({httpData:{...this.state.httpData,reportReason:item}})}}
                    className={`report_tag_box font28 ${reportReason ===item?'report_tag_color2':'report_tag_color1'}`}>
                {item}
              </View>
            )
          })}

        </View>
        <View className='report_toast font24 color2'>* 您的举报将在24小时内被处理，处理结果将在消息通知中反馈</View>
        <View className='report_btn color4 font32 bold' onClick={() => this.saveReport()}>提交举报</View>
        {visible && <View className='report_layer'>
          <View className='report_layer_toast'>
            <View className='report_layer_title font32 bold color1'>提交成功</View>
            <View className='report_layer_content'>
              感谢您对平台的关注，平台会及时进行处理，处理结果会以消息的形式通知。
              <Text className='color4' onClick={(e) => {
                e.stopPropagation()
                redirectTo('/pages/share/download/index')
              }}>建议下载「哒卡乐」APP</Text>
              及时查看
            </View>
            <View className='report_layer_btn color6 font32' onClick={(e) =>goBack()}>
              知道了
            </View>
          </View>
        </View>}
      </View>
    )
  }
}

export default Index
