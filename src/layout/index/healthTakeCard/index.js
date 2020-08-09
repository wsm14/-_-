import {useState} from '@tarojs/taro'
import {Text,View,Image} from '@tarojs/components'
import './index.scss'
function Card(props) {
  const  {Utils} = props
  return(
    <View className='take_cardBox'>
      <View  className='take_cardNode'>
        <View className='take_cardNodeIcon'></View>
        <View className='take_cardNodefont' onClick={() =>Utils.goDown()}>参赛记录</View>
      </View>
      <View className='take_cardBox_title'>
        <View className='take_card_title clearfix'>
          <View  onClick={() =>Utils.goBack()}></View>
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
        <View className='take_myStep' onClick={() =>Utils.goDown()}>
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
        <View className='take_contest' onClick={() => Utils.navigateTo('/pages/index/healthTakeCard/healthEnlist')}></View>
      </View>
      <View className='take_cardData'>
        <View className='take_cardData_title'>
          <View><Text>今日数据</Text></View>
        </View>
        <View className='clearfix take_card_space'>
          <View>
            <Text>1.34</Text>公里</View>
          <View>
            <View><Text>00</Text>时<Text>35</Text>分</View>
          </View>
          <View>
            <View><Text>58.3</Text>千卡</View>
          </View>
        </View>
        <View className='clearfix take_card_identifying'>
          <View><Text>步行里程</Text></View>
          <View><Text>步行时间</Text></View>
          <View><Text>卡路里</Text></View>
        </View>
        <View className='clearfix take_cardHandle'>
          <View className='take_cardHandle_icon'>
            <View className='take_cardHandle_iconImg Handlebg1' onClick={() =>Utils.goDown()}></View>
            <View className='take_cardHandle_iconTitle'>运动记录</View>
          </View>
          <View className='take_cardHandle_icon'>
            <View className='take_cardHandle_iconImg Handlebg2' onClick={() =>Utils.goDown()}></View>
            <View className='take_cardHandle_iconTitle'>身体数据</View>
          </View>
          <View className='take_cardHandle_icon'>
            <View className='take_cardHandle_iconImg Handlebg3' onClick={() =>Utils.goDown()}></View>
            <View className='take_cardHandle_iconTitle'>排行榜</View>
          </View>
          <View className='take_cardHandle_icon'>
            <View className='take_cardHandle_iconImg Handlebg4' onClick={() =>Utils.goDown()}></View>
            <View className='take_cardHandle_iconTitle'>攒豆规则</View>
          </View>
        </View>
      </View>
      <View className='take_healthCard'>
        <View className='take_healthCard_title'>健康打卡</View>
        <View className='clearfix take_healthCard_Img'>
          <View className='healthCard_Img healthCard_bg1'>
            <View className='healthCard_Img_headline'>户外运动</View>
            <View  className='healthCard_btn healthCard_cl1' onClick={() =>Utils.goDown()}>去完成</View>
          </View>
          <View className='healthCard_Img healthCard_bg2'>
            <View className='healthCard_Img_headline'>健身</View>
            <View  className='healthCard_btn healthCard_cl2' onClick={() =>Utils.goDown()}>去完成</View>
          </View>
          <View className='healthCard_Img healthCard_bg3'>
            <View className='healthCard_Img_headline'>球类</View>
            <View  className='healthCard_btn healthCard_cl3' onClick={() =>Utils.goDown()}>去完成</View>
          </View>
          <View className='healthCard_Img healthCard_bg4'>
            <View className='healthCard_Img_headline'>游泳</View>
            <View className='healthCard_btn healthCard_cl4' onClick={() =>Utils.goDown()}>去完成</View>
          </View>
        </View>
        <View className='clearfix take_healthCard_Img'>
          <View className='healthCard_Img healthCard_bg5'>
            <View className='healthCard_Img_headline' onClick={() =>Utils.goDown()}>户外运动</View>
            <View  className='healthCard_btn healthCard_cl5' onClick={() =>Utils.goDown()}>去完成</View>
          </View>
          <View className='healthCard_Img healthCard_bg6'>
            <View className='healthCard_Img_headline'>健身</View>
            <View  className='healthCard_btn healthCard_cl6' onClick={() =>Utils.goDown()}>去完成</View>
          </View>
          <View className='healthCard_Img healthCard_bg7'>
            <View className='healthCard_Img_headline'>球类</View>
            <View  className='healthCard_btn healthCard_cl7' onClick={() =>Utils.goDown()}>去完成</View>
          </View>
          <View className='healthCard_Img healthCard_bg8'>
            <View className='healthCard_Img_headline'>游泳</View>
            <View className='healthCard_btn healthCard_cl8' onClick={() =>Utils.goDown()}>去完成</View>
          </View>
        </View>
      </View>
    </View>
   );
}
export  default  Card
