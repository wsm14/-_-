import React, {Component, useState, useRef} from 'react'
import {View, Text} from '@tarojs/components'
import Taro from "@tarojs/taro";
import './index.scss'
import {navigateTo, marginTags} from "@/common/utils";
import classNames from 'classnames'
import Tabs from '@/components/tabs'
import Earn from './components/earn'
import {getRootAndParent} from '@/server/common'

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      setting: {
        tabList: ['卡豆收入', '卡豆支出', '现金记录'],
        tabData: [
          {root: 'userTrade', parent: 'earn'},
          {root: 'userTrade', parent: 'expenses'},
          {root: 'userCashTrade'}],
        current: 0
      },
      type: 0,
      keyValueList: {
        '0': [],
        '1': [],
        '2': []
      },
      checkedIndex: 0
    }
  }


  //显示隐藏弹层
  setType(index) {
    const {type} = this.state
    if (type === index) {
      return
    } else {
      this.setState({
        type: index
      })
    }
  }

  // 切换查询条件类型
  setIndex(index) {
    if (index != this.state.setting.current) {
      this.setState({
        setting: {
          ...this.state.setting,
          current: index
        },
        checkedIndex: 0,
        visible: false
      })
      if (this.state.keyValueList[index].length === 0) {
        getRootAndParent(this.state.setting.tabData[index], (res) => {
          const {keyValueList} = res
          keyValueList.unshift({
            value: "全部类型",
            child: ''
          })
          this.setState({
            keyValueList: {
              ...this.state.keyValueList,
              [index]: keyValueList
            }
          })
        })
      }
    }
    return
  }


  //切换查看类型
  componentDidMount() {
    getRootAndParent(this.state.setting.tabData[0], (res) => {
      const {keyValueList} = res
      keyValueList.unshift({
        value: "全部类型",
        child: ''
      })
      this.setState({
        keyValueList: {
          ...this.state.keyValueList,
          0: keyValueList
        }
      })
    })
  }

  errorToast(e) {
  }

  render() {
    const {
      setting,
      setting: {
        current
      },
      type,
      visible,
      keyValueList,
      checkedIndex
    } = this.state
    const tabStyle = {
      height: Taro.pxTransform(88),
      borderRadius: '0px 0px 20px 20px',
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
        <Earn list={keyValueList[0]}></Earn>
      </View>
    )
  }
}

export default Index
