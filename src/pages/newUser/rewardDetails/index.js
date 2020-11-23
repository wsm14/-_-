import React, {Component, useState} from 'react'
import {View, Text} from '@tarojs/components'
import Taro from "@tarojs/taro";
import './index.scss'
import {toast} from '@/common/utils'
import {navigateTo} from "../../../common/utils";
import classNames from 'classnames'
import Tabs from '@/components/tabs'

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      setting: {
        tabList: ['卡豆收入', '卡豆支出', '现金记录'],
        current: 0
      },
      visible: false,
      type: 0,
      testObj: [
        {
          list: [{id:'1',name:'嘻嘻嘻'}, {id:'2',name:'哈哈哈'},{id:'3',name: '滴滴滴'}]
        },
        {
          list: [{id:'4',name:'得得得'}, {id:'5',name:'测测测'},{id:'6',name: '哇哇哇'} ]
        },
        {
          list: [{id:'7',name:'嘎嘎嘎嘎'}, {id:'8',name:'得得得而'},{id:'9',name: '嘻嘻'},
            {id:'10',name:'得得得而'},{id:'11',name: '嘻嘻'}]
        }
      ]
    }
  }
  setShowLayer(type,boolean) {
    if(type){
      this.setState({
        type:type
      },res =>{
        this.setState({
          visible: boolean
        })
      })
    }
    else {
      this.setState({
        visible: boolean
      })
    }
  }
  setType(index) {
    const {type} = this.state
    if(type ===index){
      return
    }
    else {
      this.setState({
        type:index
      })
    }
  }
  setIndex(index) {
    if (index != this.state.setting.current) {
      this.setState({
        setting: {
          ...this.state.setting,
          current: index
        },
      })
    }
    return
  }

  componentDidMount() {

  }

  errorToast(e) {
  }

  render() {
    const {
      setting,
      type,
      visible
    } = this.state
    const tabStyle = {
      height: Taro.pxTransform(88),
      borderRadius: '0px',
      display: 'flex',
      left: '0',
      right: '0',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: '#FFFFFF',
      padding: `0 ${Taro.pxTransform(69)}`,
      position: 'fixed',
    }
    return (
      <View className='rewardDetails_box'>
        <Tabs fn={this.setIndex.bind(this)} style={tabStyle} {...setting}></Tabs>
        <View className='rewardDetails_selectId'>
          <View className='rewardDetails_time font24 bold' onClick={() => this.setShowLayer(0,true)}>
            全部时间 <View className='rewardDetails_icon'></View>
          </View>
          <View className='rewardDetails_cad font24 bold' onClick={() => this.setShowLayer(1,true)}>
            全部类型 <View className='rewardDetails_icon'></View>
          </View>
        </View>
        {visible &&
        <View className='rewardDetails_layer animated fadeInUp'>
          <View className='rewardDetails_layer_content'>
            <View className='rewardDetails_layer_tab'>
              <View className={classNames('rewardDetails_layer_tabs font24', type === 0 ? 'color4' : 'color1')} onClick={() => this.setType(0)}>
                全部时间
                <View
                  className={classNames('rewardDetails_layer_tabBox', type === 0 ? 'rewardDetails_layer_icon2' : 'rewardDetails_layer_icon1')}>
                </View>
              </View>
              <View className={classNames('rewardDetails_layer_tabs font24', type !== 0 ? 'color4' : 'color1')} onClick={() => this.setType(1)}>
                全部类型
                <View
                  className={classNames('rewardDetails_layer_tabBox', type !== 0 ? 'rewardDetails_layer_icon2' : 'rewardDetails_layer_icon1')}>
                </View>
              </View>
            </View>
            <View className='rewardDetails_layer_content'>
              {type === 1 &&
                <View className='rewardDetails_layer_tagBox'>

                </View>
              }
            </View>
          </View>
        </View>}
      </View>
    )
  }
}

export default Index
