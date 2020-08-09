import Taro from '@tarojs/taro'
import { View,Text, Swiper,Image, SwiperItem} from '@tarojs/components'
import {AtToast,AtTabBar} from "taro-ui"
import Utils from './../../../utils/utils'
import Nav from '../../../../layout/layoutNav'
import './index.scss'
class HealthTakeCard extends Taro.Component{
  defaultProps = {}
  config = {
    navigationBarTitleText: '运动记录' ,
  }
  constructor () {
    super(...arguments)
    this.state = {
      current: 0,
      title: '运动记录'
    }
  }

  componentWillMount() {

  }
  render() {
    const { title } = this.state
    return(
      <View>
        <Nav title={ title }></Nav>
        <View className='motion_frequency cleanfix'>
          <View className='motion_order motion_all'>
            <View className='motion_partakeCard motion_partake'>
              本周参与打卡
            </View>
            <View className='motion_partake_num'>19</View>
            <View className='motion_partake_name'>（次）</View>
          </View>
          <View className='motion_day motion_all'>
            <View className='motion_partakeDays motion_partake'>
              本周参与打卡
            </View>
            <View className='motion_partake_num'>3</View>
            <View className='motion_partake_name'>（天）</View>
          </View>
        </View>
        <View className='motion_Chars'>
          <View className='motion_CharsTitle'>
            <View className='motion_CharsTitleFont'>一周打卡情况</View>
          </View>
        </View>
        <View className='motion_tag'>
          <View className='motion_time'>
            2020-05-20
            <View className='motion_Details motion_color1 clearfix'>
              <View className='motion_icon motion_bg1'></View>
              <View className='motion_detailsBox'>
                <View className='motion_detailsTitle'>
                  户外运动
                </View>
                <View className='motion_detailsTime'>
                  13:08:34
                </View>
              </View>
              <View className='motion_checked'></View>
            </View>
            <View className='motion_Details motion_color2 clearfix'>
              <View className='motion_icon motion_bg2'></View>
              <View className='motion_detailsBox'>
                <View className='motion_detailsTitle'>
                  球类
                </View>
                <View className='motion_detailsTime'>
                  13:08:34
                </View>
              </View>
              <View className='motion_checked'></View>
            </View>
            <View className='motion_Details motion_color3 clearfix'>
              <View className='motion_icon motion_bg3'></View>
              <View className='motion_detailsBox'>
                <View className='motion_detailsTitle'>
                  健身
                </View>
                <View className='motion_detailsTime'>
                  13:08:34
                </View>
              </View>
              <View className='motion_checked'></View>
            </View>
            <View className='motion_Details motion_color4 clearfix'>
              <View className='motion_icon motion_bg4'></View>
              <View className='motion_detailsBox'>
                <View className='motion_detailsTitle'>
                  游泳
                </View>
                <View className='motion_detailsTime'>
                  13:08:34
                </View>
              </View>
              <View className='motion_checked'></View>
            </View>
            <View className='motion_Details motion_color5 clearfix'>
              <View className='motion_icon motion_bg5'></View>
              <View className='motion_detailsBox'>
                <View className='motion_detailsTitle'>
                  舞蹈
                </View>
                <View className='motion_detailsTime'>
                  13:08:34
                </View>
              </View>
              <View className='motion_checked'></View>
            </View>
            <View className='motion_Details motion_color6 clearfix'>
              <View className='motion_icon motion_bg6'></View>
              <View className='motion_detailsBox'>
                <View className='motion_detailsTitle'>
                  瑜伽
                </View>
                <View className='motion_detailsTime'>
                  13:08:34
                </View>
              </View>
              <View className='motion_checked'></View>
            </View>
            <View className='motion_Details motion_color7 clearfix'>
              <View className='motion_icon motion_bg7'></View>
              <View className='motion_detailsBox'>
                <View className='motion_detailsTitle'>
                  武术
                </View>
                <View className='motion_detailsTime'>
                  13:08:34
                </View>
              </View>
              <View className='motion_checked'></View>
            </View>
            <View className='motion_Details motion_color8 clearfix'>
              <View className='motion_icon motion_bg8'></View>
              <View className='motion_detailsBox'>
                <View className='motion_detailsTitle'>
                  其他运动
                </View>
                <View className='motion_detailsTime'>
                  13:08:34
                </View>
              </View>
              <View className='motion_checked'></View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
export default HealthTakeCard
