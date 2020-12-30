import React, {Component} from 'react'
import Taro, {getCurrentInstance} from '@tarojs/taro'
import {Text, View} from '@tarojs/components'
import {city} from './common/city'
import classNames from 'classnames'
import './index.scss'
import {toast,getDom,goBack} from "@/common/utils";
import Toast from '@/components/dakale_toast'
// const filterCity  = (obj) => {
//    return Object.keys(obj).map(item  => {
//      return  {
//        title: item,
//        key: item,
//        items:obj[item]
//      }
//   })
// }
const marginTags = (list, num, style, components) => {
  return (list.map((item, index) => {
      return (
        <View style={(index + 1) % num !== 0 && style}>
          {components(item, index)}
        </View>
      )
    })
  )
}

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      cityJson: city,
      selectValue: '杭州',
      scrollTop:0,
      consent: [
        {name: '杭州'},
        {name: '厦门'}
      ],
      hot: [
        {name: '北京'},
        {name: '上海'},
        {name: '广州'},
        {name: '深圳'},
        {name: '成都'},
        {name: '重庆'},
        {name: '天津'},
        {name: '青岛'},
        {name: '南京'},
        {name: '苏州'},
        {name: '武汉'},
      ],
      visible: false
    }
  }

  setIndex(index) {
    if(index ==='杭州'){
      this.setState({
        selectValue: index,
      },res => {
        goBack()
      })
    }
    else {
      this.setState({
        visible: true
      })
    }
  }
  searchSelect(title) {
    Taro.pageScrollTo({
      selector: `#${title}`,
      duration: 300
    })
  }
  tishiDom() {
    return (
      <View className='city_toast_box'>
        <View>自动定位杭州，更多精彩敬请期待
          详情可咨询客服，联系电话：<Text className='color4'>
            400 -800-5881</Text></View>
      </View>
    )
  }
  render() {
    const tagStyle = {
      marginRight: Taro.pxTransform(16)
    }
    const {consent, hot, selectValue, cityJson,scrollTop,visible} = this.state
    return (
      <View className='city_box'>
        <View className='city_title'>
          默认城市
        </View>
        <View className='city_tags'>
          {marginTags(consent, 4, tagStyle, (item, index) => {
            return (
              <View onClick={() => this.setIndex(item.name)}
                    className={classNames(selectValue === item.name ? 'city_tags_checkedBox' : 'city_tags_box color1')}>
                {selectValue === item.name ? (<View className='city_tags_checkedBox'>
                  <View className='city_tags_boxIcon'></View>{item.name}
                </View>) : item.name}
              </View>
            )
          })}
        </View>
        <View className='city_title'>
          热门城市
        </View>
        <View className='city_tags'>
          {marginTags(hot, 4, tagStyle, (item, index) => {
            return (
              <View onClick={() => this.setIndex(item.name)}
                    className={classNames(selectValue === item.name ? 'city_tags_checkedBox' : 'city_tags_box color1')}>
                {selectValue === item.name ? (<View className='city_tags_checkedBox'>
                  <View className='city_tags_boxIcon'></View>{item.name}
                </View>) : item.name}
              </View>
            )
          })}
        </View>
        {cityJson.map(item => {
          const {title, items} = item
          return (
            <View className='city_father'>
              <View id={title} className='city_type_select color1'>
                {item.title}
              </View>
              {items.map(val => {
                return (
                  <View onClick={() => this.setIndex(item.name)} className='city_type_selectTab font28 color1'>
                    {val.name}
                  </View>
                )
              })}
            </View>
          )
        })}
        <View className='city_right_layer'>
          {cityJson.map(item => {
            const {title, items} = item
            return (
              <View onClick={() => this.searchSelect(title)} className='city_child_box'>{item.title}</View>
            )
          })}
        </View>
        {visible && <Toast title={'您的城市即将开通服务'} Components={this.tishiDom.bind(this)}
                           close={() => this.setState({visible: false},res => {goBack()})}></Toast>}
      </View>
    )
  }
}

export default Index
