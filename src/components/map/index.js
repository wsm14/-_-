import React, {useState, useEffect} from "react";
import {CoverView, Map} from "@tarojs/components";
import Taro from '@tarojs/taro'
import {toast} from "../../common/utils";

export default (props) => {
  const {style, data, polyline, MarkerType, desIndex, setIndex, openType,scale} = props
  const mapStyle = {
    width: '100%',
    height: '100%'
  }
  const [hashMap, setMap] = useState({})
  const [destination, setDestination] = useState(null)
  const [marker, setMarkers] = useState([])
  useEffect(() => {
    setMap({...data})
    const {markers = []} = data
    setMarkers(markers)
  }, [data])
  useEffect(() => {
      setDestination(desIndex)
  }, [desIndex])
  const onMarker = (e) => {
    const {detail: {markerId}} = e
    console.log(markerId)
    setIndex(markerId)
    // if (openType) {
    //   filterMarker(hashMap.markers).forEach((item) => {
    //     if (item.id == markerId) {
    //       //   Taro.openLocation({
    //       //   latitude: parseFloat(item.latitude),
    //       //   longitude: parseFloat(item.longitude),
    //       //   address: item.address||'',
    //       //   name: item.merchantName||'',
    //       // })
    //     }
    //   })
    // }
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
          const {merchantName} = item
          item.callout = {
            content: merchantName,
            color: 'rgba(255, 255, 255, 1)',
            bgColor:'rgba(239, 71, 111, 1)',
            display: 'ALWAYS',
            padding: 6,
            borderRadius: 12,
            fontSize: 12,
            anchorX:0,//横向偏移
          }
          item.width = '80rpx'
          item.height = '80rpx'
        }
        else {
          delete item.callout
        }
      }
      return item
    })
  }
  const {lnt = 0, lat = 0} = hashMap
  return (
    <Map
      id={'test'}
      enable-zoom={true}
      min-scale={9}
      max-scale={16}
      scale={scale||16}
      onMarkerTap={(e) => onMarker(e)}
      style={style || mapStyle}
      longitude={lnt}
      latitude={lat}
      markers={filterMarker(marker)}
    >
    </Map>
  )
}

