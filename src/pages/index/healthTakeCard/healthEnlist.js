import Taro from '@tarojs/taro'
import { View,Text, Swiper,Image, SwiperItem} from '@tarojs/components'
import {AtToast,AtTabBar} from "taro-ui"
import Utils from './../../../utils/utils'
import './healthEnlist.scss'
class HealthTakeCard extends Taro.Component{
  defaultProps = {}
  config = {
    navigationBarTitleText: '立即报名 ' ,
  }
  constructor () {
    super(...arguments)
    this.state = {
      current: 0
    }
  }

  componentWillMount() {

  }
  render() {
    return(
      <View className='take_cardBox'>
        <View className='take_cardNode'>
          <View className='take_cardNodeIcon'></View>
          <View className='take_cardNodefont'>参赛记录</View>
        </View>
        <View className='take_cardBox_title'>
          <View className='take_card_title clearfix'>
            <View onClick={() =>Utils.goBack()}></View>
            <View></View>
          </View>
          <View className='take_cardBean'>
            达标赛总奖池（卡豆）
          </View>
          <View className='take_cardBeanAmount'>
            57,123,456
          </View>
          <View className='take_enlist'>
            <View className='take_enlistPeople'>
              <Text>821</Text>人已报名
            </View>
            <View className='take_reward'>
              未报名<Text>参赛满6000步即可瓜分卡豆</Text>
            </View>
            <View className='take_time'>
              5/22 星期五
            </View>
          </View>
          <View className='take_myStep'>
            我的步数<Text>1500</Text>步
          </View>
          <View className='take_schedule'>
            0
            <View  className='take_prompt'>
              <View style={{width:'60%'}}></View>
            </View>
            6000
          </View>
          <View className='take_synchro'></View>
        </View>
        <View className='take_cardEnlist' onClick={ () => Utils.navigateTo('/pages/share/download/index')}>
          <View className='take_cardEnlist_btn'>100卡豆 立即报名</View>
          <View className='take_cardEnlist_Details'>最低奖100卡豆</View>
        </View>
        <View className='take_cardMatch'>
          <View className='take_cardMatch_title'>
            今日比赛
          </View>
          <View className='take_cardMatch_reach'>
            <View>200</View>
            <View>达成目标人数</View>
          </View>
          <View className='take_cardMatch_Details clearfix'>
            <View>
              <Text>1500</Text>
              <Text>预计收益卡豆</Text>
            </View>
            <View>
              <Text>821</Text>
              <Text>参加人数</Text>
            </View>
            <View>
              <Text>57123456</Text>
              <Text>奖池卡豆</Text>
            </View>
          </View>
          <View className='take_cardMatchStatus'>你未报名此次活动</View>
        </View>
        <View className='take_cardDraw'>
          <View className='take_DrawTitle f'>
            <View><Text>三步赚取运动卡豆</Text></View>
            <View><Text>活动规则</Text></View>
          </View>
          <View className='take_drawExplain f'>
            <View className='take_drawDay take_drawDaybg1'></View>
            <View className='take_drawDayGo'><View className='take_drawGoIcon1'></View></View>
            <View className='take_drawDay take_drawDaybg2'></View>
            <View className='take_drawDayGo'><View className='take_drawGoIcon2'></View></View>
            <View className='take_drawDay take_drawDaybg3'></View>
          </View>
          <View className='take_Draw_Details'>
            <View className='take_Draw_tab'>
              <View>支付卡豆</View>
              <View>报名</View>
            </View>
            <View className='take_Draw_tab'>
              <View>6000步完成</View>
              <View>获得奖励资格</View>
            </View>
            <View className='take_Draw_tab'>
              <View>挑战结算</View>
              <View>瓜分卡豆</View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
export default HealthTakeCard
