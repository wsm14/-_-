import Taro from '@tarojs/taro'
import { View,Text, Swiper,Image, SwiperItem} from '@tarojs/components'
import {AtToast,AtTabBar} from "taro-ui"
import Utils from './../../../utils/utils'
import Card from '../../../layout/index/healthTakeCard/index'
class HealthTakeCard extends Taro.Component{
  defaultProps = {}
  config = {
    navigationBarTitleText: '健康打卡' ,
  }
  constructor () {
    super(...arguments)
    this.state = {
      current: 0
    }
  }
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  componentWillMount() {

  }
  render() {
    const  { current } = this.state
    return(
      <View>
       <Card Utils={Utils}></Card>
      </View>
    )
  }
}
export default HealthTakeCard
