import Taro, { Component } from '@tarojs/taro'
import {View, Text, Image} from '@tarojs/components'
import './index.scss'
import classNames from 'classnames'
import {wxapiGet,wxapiPost} from './../../../../api/api'
import Ajax from './../../../../api/request'
import Utils from './../../../../utils/utils'
import Nav from '../../../../layout/layoutNav/index'
class sportsPoster extends Component {
  defaultProps = {}
  config = {
    navigationBarTitleText: '比赛详情',
  }
  constructor() {
    super(...arguments);
    this.state = {
      matchInfo:{},
      serialDayAmount:'0',
      tomorrowMatchInfo:{},
      userNextMatchStatus:'0'
    }
  }
  componentDidShow() {
    this.getMarkInfo()
  }
  getMarkInfo(){
    Ajax({
      data:{
        identify: 'habit',
        subIdentify: 'wakeUp'
      },
      url: wxapiGet.wechatGetMatch
    },'get').then(
      res=>{
        const {errMsg} = res
        if(errMsg === 'request:ok'){
          const {success,resultDesc} = res.data
          if(success){
            const { content:
              {
                matchInfo,
                serialDayAmount,
                tomorrowMatchInfo,
                userNextMatchStatus
              }} =res.data
            this.setState({
              matchInfo: matchInfo|| {},
              tomorrowMatchInfo: tomorrowMatchInfo|| {},
              serialDayAmount: serialDayAmount || '0',
              userNextMatchStatus: userNextMatchStatus || '0'
            })
          }
          else {
            Utils.Toast(resultDesc)
          }
        }
      }
    )
  }

  //请求数据接口
  render () {
    const {
      matchInfo,
      serialDayAmount,
      tomorrowMatchInfo,
      userNextMatchStatus} = this.state
    return (
      <View className='sportsPoster_box'>
        <View className='sportsPoster_titleBox'>
          <View className='sportsPoster_title'>
            <View className='sportsPoster_titleTop'>
              <View className='sportsPoster_titleIcon'>
                {matchInfo.matchName}
              </View>
              <View className='sportsPoster_titleBack' onClick={ () => Utils.goBack()}></View>
            </View>
            {/*早起挑战赛和回退按钮*/}
          </View>
             {/*标题和回退*/}
          <View className='sportsPoster_titleCard_times'>
            <Text className='sportsPoster_titleCard_date'>
              {matchInfo.matchDate}
            </Text>
            <Text className='sportsPoster_titleCard_dateTime'>
              打卡时间:  {matchInfo.matchMarkTime}
            </Text>
          </View>
             {/*打卡时间*/}
          <View className='sportsPoster_simpleBox' onClick={ () => Utils.navigateTo('/pages/index/accustomed/userExploits/index')}>
            <View className='sportsPoster_simpleIcon'></View>
            <View className='sportsPoster_font'>我的战绩</View>
          </View>
             {/*参赛记录*/}
          <View className='sportsPoster_constor'>
            <View className='sportsPoster_simpleIcon'></View>
            <View className='sportsPoster_font'>领豆规则</View>
          </View>
             {/*规则协议*/}
        </View>
        <View className='sportsPoster_body'>
          <View className='sportsPoster_beanNum'>
            <View className='sportsPoster_beanTitle'>
              达标赛总奖池(卡豆)
            </View>
            <View className='sportsPoster_bean'>
              {tomorrowMatchInfo.totalBeanAmount}
            </View>
            <View className='sportsPoster_beanPeople'>
              明日开赛<View className='sportsPoster_peopleDetails'>已有<Text className='sportsPoster_peopleColor'>{tomorrowMatchInfo.signAmount}人</Text>报名</View>
            </View>
          </View>
             {/*卡豆池*/}
          {userNextMatchStatus !== '1'?
          <View onClick={ () => Utils.navigateTo('/pages/share/download/index')} className='sportsPoster_btn sportsPoster_btnColor1'>
              <View className='sportsPoster_status'>立即报名</View>
              <View className='sportsPoster_price'>付{matchInfo.signBeanAmount}卡豆</View>
            </View>:
          <View onClick={ () => Utils.navigateTo('/pages/share/download/index')} className='sportsPoster_btn sportsPoster_btnColor2'>
              已报名
           </View>
          }

             {/*报名按钮*/}
          <View className='sportsPoster_cardMatch'>
            <View className='sportsPoster_cardMatch_title'>
              今日比赛
            </View>
            <View className='sportsPoster_cardMatch_reach'>
              <View>{matchInfo.targetUserAmount}</View>
              <View>达成目标人数</View>
            </View>
            <View className='sportsPoster_cardMatch_Details clearfix'>
              <View>
                <Text>{matchInfo.earnBeanAmount}</Text>
                <Text>预计收益卡豆</Text>
              </View>
              <View>
                <Text>{matchInfo.signAmount}</Text>
                <Text>参加人数</Text>
              </View>
              <View>
                <Text>{matchInfo.totalBeanAmount}</Text>
                <Text>奖池卡豆</Text>
              </View>
            </View>
            <View className='sportsPoster_cardMatchStatus'>你{matchInfo.userMatchStatus ==='0' ?'未':'已'}报名此次活动</View>
          </View>
             {/*报名详情*/}
          <View className='sportsPoster_cardBottom'>
            <View className='sportsPoster_cardBottom_title'>
              三步瓜分巨额挑战奖励卡豆
            </View>
            <View className='sportsPoster_cardBottom_icon'>
              <View className='sportsPoster_cardBottom_iconImg clearfix'>
                <View className='img_icon img_bg1'>

                </View>
                <View className='img_icon img_bg2'>

                </View>
                <View className='img_icon img_bg3'>

                </View>
              </View>
              <View className='sportsPoster_cardBottom_iconDetails clearfix'>
                <View className='iconDetail1'>
                  <View className='iconDetails_title'>支付契约金</View>
                  <View className='iconDetails_work'>报名</View>
                  <View className='iconDetails_date'>今天</View>
                </View>
                <View className='iconDetail2'>
                  <View className='iconDetails_title'>打卡挑战完成</View>
                  <View className='iconDetails_work'>获得奖励资格</View>
                  <View className='iconDetails_date'>明天</View>
                </View>
                <View className='iconDetail3'>
                  <View className='iconDetails_title'>挑战结算</View>
                  <View className='iconDetails_work'>瓜分卡豆</View>
                  <View className='iconDetails_date'>后天</View>
                </View>
              </View>
              <View className='sportsPoster_line'></View>
            </View>
          </View>
             {/*报名步骤*/}
        </View>
      </View>
    )
  }
}

export default sportsPoster
