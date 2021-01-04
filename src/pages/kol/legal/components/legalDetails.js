import React, {useEffect, useState} from "react";
import {View,Text} from "@tarojs/components";
import {getDom, computedHeight} from "@/common/utils";
import './../index.scss'
import Taro from "@tarojs/taro";

export default ({lever=1}) => {
  const [templateLever, setTemplateLever] = useState(1)
  const templateLeverObj = {
    templateLever1: [1, 1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 3, 3, 3, 3, 3],
    templateLever2: [1, 1, 2, 2, 2, 1, 1, 1, 1, 4, 4, 3, 3, 3, 3, 3],
    templateLever3: [1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 4, 3, 3, 3, 3, 3],
    templateLever4: [1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 3, 3, 3, 3, 3],
    templateLever5: [1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 3, 3, 3],
    templateLever6: [1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 3, 3],
    templateLever7: [1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 3, 3],
    templateLever8: [1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 3],
    templateLever9: [1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 1, 3]
  }
  const request = {
    1: {price: '45%', bean: ''},
    2: {price: '50%', bean: 500},
    3: {price: '55%', bean: 2000},
    4: {price: '60%', bean: 2000},
    5: {price: '65%', bean: 5000},
    6: {price: '70%', bean: 10000},
    7: {price: '75%', bean: 12000},
    8: {price: '80%', bean: 40000},
    9: {price: '90%', bean: 100000},
  }

  const templateObj = {
    1: (item) => {
      return (
        <View class="tableList_type1">
                    <View class="legal_left legal_box_center legal_box_leftFont">
                      {item.label}
                     </View>
                <View class="legal_right">
                <View class="legal_right_font">
                  {item.label === '卡豆补贴' ? (<Text>平台卡豆补贴奖励<Text className='color3'>{request[templateLever].bean}</Text></Text>) : item.value}
                </View>
               </View>
               </View>
      )
    },
    2: (item) => {
      return (
        <View class="tableList_type2">
                     <View class="legal_left legal_box_center legal_box_leftFont">{item.label}</View>
                <View class="legal_right">
                <View class="legal_right_font">
                  {item.label === '带货收益'?
                    (<Text>参与平台带货同时开通商品橱窗，可获得商品差价<Text className='color3'>{request[templateLever].price}</Text>部分收益</Text>):
                    item.value
                  }
                </View>
              </View>
            </View>)
    },
    3: (item) => {
      return (
        <View class="tableList_type3">
            <View class="legal_left">
                <View class="legal_left_child1"> {item.label}</View>
                <View class="legal_left_child2">（待解锁）</View>
            </View>
            <View class="legal_right">
                <View class="legal_right_font">
                     {item.value}
                </View>
            </View>
        </View>)
    },
    4: (item) => {
      return (
         <View class="tableList_type4">
            <View class="legal_left">
                <View class="legal_left_child1">{item.label}</View>
                <View class="legal_left_child2">（待解锁）</View>
            </View>
            <View class="legal_right">
                <View class="legal_right_font">
                    {item.value}
                </View>
            </View>
        </View>)
    }
  }
  useEffect(() => {
    setTemplateLever(lever)
  },[lever])
  const fontList = [
    {label: '身份铭牌', value: `LV${lever - 1}等级身份铭牌，彰显地位`},
    {label: '哒人创作', value: '参与哒人种草、推店、带货'},
    {label: 'IP表情包', value: '发布内容时的IP形象专属表情包，让内容更加有吸引力和乐趣'},
    {label: '专属水印', value: '在自己的图片上打赏专属水印，宣誓版权哦，做更加个性的自我'},
    {label: '带货收益', value: `参与平台带货同时开通商品橱窗，可获得商品差价部分的${request[templateLever].price}收益`},
    {label: '升级礼包', value: '专属优惠券大礼包'},
    {label: '哒人@', value: '发布内容时可以@想@的人'},
    {label: '卡豆补贴', value: `平台卡豆补贴奖励${request[templateLever].bean}`},
    {label: '哒人打赏', value: '发布内容时可以打赏卡豆哦'},
    {label: '专题活动', value: '可以参与平台哒人的专题活动创作，并可获得活动奖励哦'},
    {label: '排名优先', value: '发布的视频图文内容，有优先展示和靠前展示等优势哦'},
    {label: '商家任务', value: '参与商家的新店、新品、优惠活动等任务'},
    {label: '品宣任务', value: '参与品牌商的新店、新品、优惠活动等任务'},
    {label: '限时任务', value: '参与限时奖励任务'},
    {label: '广告任务', value: '参与广告投放任务'},
    {label: '哒人直播', value: '开通哒人直播'},
  ]
  return (
    <View className="legal_box">
      <View className='legal_tablefont'>哒人权益一览</View>
      <View className="legal_tableList">
        {templateLeverObj[`templateLever${templateLever}`].map((item, index) => {
          return templateObj[item](fontList[index])
        })}
      </View>
    </View>
  )
}

