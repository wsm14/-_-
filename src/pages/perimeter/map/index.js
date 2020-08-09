import Taro, { Component } from '@tarojs/taro'
import { View ,Map} from '@tarojs/components'
import Utils from './../../../utils/utils'
import './index.scss'
import {inject, observer} from "@tarojs/mobx";
@inject('beanStore')
@observer
class beanMark extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '微信地图' ,
    navigationStyle: 'default',
  }
  constructor () {
    super(...arguments)
    const {beanStore:{beanMarks}}= this.props
    let lnt = Taro.getStorageSync('lnt')
    let lat = Taro.getStorageSync('lat')
    this.state = {
      markers: [{latitude:beanMarks.merchantLat,longitude:beanMarks.merchantLnt}],
      polyline: [
        [
          {
          points: [{latitude:lat,longitude:lnt},{latitude:beanMarks.merchantLat,longitude:beanMarks.merchantLnt}],
          borderWidth: 5,
          dottedLine: false,
          color: "#4CBBCE",
        }
      ]
     ],
      lnt: lnt,
      lat: lat
    }
  }


  componentDidShow() {

  }

  render () {
    const {markers ,polyline,lnt,lat} = this.state
    return (
      <Map
        className='map_box'
        scale={9}
        longitude={lnt}
        latitude={lat}
        markers={markers}
        polyline={polyline}
      />
    )
  }
}

export default beanMark
