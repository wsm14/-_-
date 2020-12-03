import React, {useEffect, useState} from "react"
import './../../index.scss'
import {Image, Text, View} from "@tarojs/components";
import classNames from "classnames";
import PickTimes from "../pickTimes";
import Taro from "@tarojs/taro";
import {getBeanDetailByUserId} from '@/server/user'
import {toast} from "@/common/utils";
import {httpGet} from "../../../../../api/newRequest";

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
export default function earn({list}) {
  const [types, setType] = useState({
    visible: false,
    type: 0,
  })
  const [currentList, setList] = useState([])
  const [renderList, setRenderList] = useState([])
  const [checkedIndex, setIndex] = useState(0)
  const [httpData, setHttpData] = useState({
    gainMonth: '',
    beanType: '',
    page: 1,
    limit: '10',
    detailType: 'add'
  })
  const [countStatus, setCountStatus] = useState(true)
  const getRenderList = () => {
    getBeanDetailByUserId(httpData, res => {
      const {beanDetailList} = res
      console.log(res)
      if (beanDetailList && beanDetailList.length > 0) {
        setRenderList([
          ...renderList, ...beanDetailList
        ])
      } else {
        toast('暂无数据')
        setCountStatus(false)
      }
    })
  }
  useEffect(() => {
    setList(list)
  }, [
    list
  ])
  useEffect(() => {
    getRenderList()
  }, [httpData])
  const {visible, type} = types
  return (
    <View>
      <View className='rewardDetails_selectId'>
        <View className='rewardDetails_time font24 bold' onClick={() =>
          setType({
            visible: true,
            type: 0,
          })}
        >
          全部时间 <View className='rewardDetails_icon'></View>
        </View>
        <View className='rewardDetails_cad font24 bold' onClick={() => setType({
          visible: true,
          type: 1,
        })}>
          全部类型 <View className='rewardDetails_icon'></View>
        </View>
      </View>
      {visible && <View onClick={(e) => {
        e.stopPropagation();
        setType({
          ...types,
          visible: false
        })
      }} className='rewardDetails_layer'>
        <View onClick={(e) => {
          e.stopPropagation()
        }} className='rewardDetails_layer_content'>
          <View className='rewardDetails_layer_tab'>
            <View className={classNames('rewardDetails_layer_tabs font24', type === 0 ? 'color4' : 'color1')}
                  onClick={() => {
                    if (type === 0) {
                      return
                    } else {
                      setType({
                        visible: true,
                        type: 0,
                      })
                    }
                  }}>
              全部时间
              <View
                className={classNames('rewardDetails_layer_tabBox', type === 0 ? 'rewardDetails_layer_icon2' : 'rewardDetails_layer_icon1')}>
              </View>
            </View>
            <View className={classNames('rewardDetails_layer_tabs font24', type !== 0 ? 'color4' : 'color1')}
                  onClick={() => {
                    if (type === 1) {
                      return
                    } else {
                      setType({
                        visible: true,
                        type: 1,
                      })
                    }
                  }}>
              全部类型
              <View
                className={classNames('rewardDetails_layer_tabBox', type !== 0 ? 'rewardDetails_layer_icon2' : 'rewardDetails_layer_icon1')}>
              </View>
            </View>
          </View>
          {type === 0 &&
          <View className='rewardDetails_layer_content'>
            <View className='rewardDetails_layer_timeBox'>
              <PickTimes></PickTimes>
            </View>
            <View className='rewardDetails_TimeBtn font28 public_auto'>
              <View className='rewardDetails_btnLeft public_center color1'>全部时间</View>
              <View className='rewardDetails_btnRight public_center color4'>确认</View>
            </View>
          </View>
          }
          {type === 1 &&
          <View className='rewardDetails_layer_content'>
            <View className='rewardDetails_layer_tagsBox'>
              {marginTags(currentList, 3, {marginRight: Taro.pxTransform(40)}, (item, index) => {
                return (
                  <View
                    className={classNames('rewardDetails_layer_tags', checkedIndex === index ? 'rewardDetails_layer_tags_checked' : 'rewardDetails_layer_tags_noChecked')}
                    onClick={async () => {
                      await setIndex(index)
                      await setRenderList([])
                      await setType({
                        ...types,
                        visible: false
                      })
                      await setHttpData({
                        gainMonth: '',
                        beanType: item.child,
                        page: 1,
                        limit: '10',
                        detailType: 'add'
                      })
                    }}
                  >
                    {item.value}
                  </View>
                )
              })}

            </View>
          </View>
          }

        </View>
      </View>}
      <View className='rewardDetails_bean_box'>
        <View className='rewardDetails_bean_title'>
          <Text className='color2 font28'>卡豆收入：</Text>
          <Text className='color1 font32 bold'>472</Text>
        </View>
        <View className='rewardDetails_bean_content'>
          {renderList.map(item => {
            const {detailContent = '', detailImg, beanTime = '', beanAmount = ''} = item
            return (
              <View className='rewardDetails_bean_tags'>
                <View className='rewardDetails_bean_tagsPad'>
                  <View className='dakale_nullImage rewardDetails_bean_Img'>
                    {detailImg && <Image style={{width: '100%', height: '100%'}} lazyLoad mode={"scaleToFill"}
                                         src={detailImg}></Image>}
                  </View>
                  <View className='rewardDetails_bean_detailsBox'>
                    <View className='rewardDetails_bean_details'>
                      {detailContent}
                    </View>
                    <View className='rewardDetails_bean_detailsTime'>
                      {beanTime}
                    </View>
                  </View>
                  <View className='rewardDetails_bean_num font32 color1 bold'>+{beanAmount}</View>
                </View>
              </View>
            )
          })}
          {renderList.length === 0 && <View className='rewardDetails_nullStatus'>
            <View className='rewardDetails_nullImage dakale_nullImage'>
              <Image style={{width: '100%', height: '100%'}} lazyLoad mode={"scaleToFill"}
                     src={'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/nullBeans1.png'}>

              </Image>
            </View>
            <View className='font28 color2'>暂无记录</View>
          </View>}
        </View>
      </View>
    </View>
  )
}
