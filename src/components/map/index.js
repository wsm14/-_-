import React, {useState, useEffect} from "react";
import {Map} from "@tarojs/components";
import Taro from '@tarojs/taro'
import {toast} from "../../common/utils";

export default (props) => {
  const {style, data, polyline, MarkerType, setIndex,openType} = props
  const mapStyle = {
    width: '100%',
    height: '100%'
  }
  const [hashMap, setMap] = useState(null)
  const [destination, setDestination] = useState(null)
  useEffect(() => {
    setMap({...data})
    if (data['desIndex']) {
      setDestination(data['desIndex'])
    }
  }, [data])
  const onMarker = (e) => {
    const {detail: {markerId}} = e
    setIndex(markerId)
    if (openType) {
      filterMarker(hashMap.markers).forEach((item) => {
        if (item.id == markerId) {
            Taro.openLocation({
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
            address: item.address||'',
            name: item.merchantName||'',
          })
        }
      })
    }
  }
  const filterMarker = (data) => {
    return data.map((item, index) => {
      item.width = '60rpx'
      item.height = '60rpx'
      item.latitude = Number(item['lat'])
      item.longitude = Number(item['lnt'])
      item.id = index
      if (index === 0) {
        item.iconPath = 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon324.png'
      } else {
        item.iconPath = 'https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/icon325.png'
        if (destination && destination == index) {
          item.width = '80rpx'
          item.height = '80rpx'
        }
      }
      return item
    })
  }
  // const mapGo = () => {
  //   // const map = wx.createMapContext('test')
  //   // if(destination){
  //   //   map.openMapApp({
  //   //     ...destination,
  //   //     fail: res => {
  //   //       toast('打开地图失败')
  //   //     }
  //   //   })
  //   // }
  // }
  if (hashMap && hashMap.lnt && hashMap.lat) {
    return (
      <Map
        id={'test'}
        enable-zoom={true}
        min-scale={9}
        max-scale={18}
        scale={16}
        onMarkerTap={(e) => onMarker(e)}
        style={style || mapStyle}
        longitude={hashMap.lnt}
        latitude={hashMap.lat}
        markers={MarkerType ? hashMap['markers'] : filterMarker(hashMap['markers'])}
      >
      </Map>
    )
  } else return null
}

