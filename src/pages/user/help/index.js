  import Taro, { Component } from '@tarojs/taro'
  import { View,Text} from '@tarojs/components'
  import { observer, inject } from '@tarojs/mobx'
  import Navigation from '../../component/Navigation'
  import router from '../../utils/utils'
  import { AtTabBar } from 'taro-ui'
  import ajax from '../../api/request'
  import './help.scss'
  class Index extends Component {

    config = {
      navigationBarTitleText: '帮助中心'
    }

    constructor () {
      super(...arguments)
      this.state = {
         nav:{
           title:'客服中心',
           fn:()=>{
           }
         }
      }
    }
    styles = () =>{
      if(process.env.TARO_ENV === 'weapp'){
        return {
          padding:'15px 0'
        }
      }
      else return {}

    }
    gofeedBack= () => {
      router.navigateTo('feedback')
    }

    render () {
      const style = this.styles()
      return (
        <View className='help_box'>
          {process.env.TARO_ENV === 'weapp' ?'' : <Navigation navData={this.state.nav}></Navigation>}
            {/*页面导航*/}
            <View className='help_frequentlyQuestion'>
               常见问题
            </View>
            {/*常见问题  */}
            <View className='help_Details'>
               <View className='help_question f'>
                 <View className='help_left_title'>
                    个人帐户
                 </View>
                 <View className='help_right_title'>
                   <View className='help_right_top' style={style}>账户无法登陆怎么办?</View>
                   <View className='help_right_bottom' style={style}>手机号注销了问么登陆?</View>
                 </View>
               </View>
               <View className='help_question f'>
                <View className='help_left_title'>
                  订单相关
                </View>
                <View className='help_right_title'>
                  <View className='help_right_top' style={style}>预定留位超时了怎么办?</View>
                  <View className='help_right_bottom' style={style}>为什么预约成功没有提醒?</View>
                </View>
              </View>
               <View className='help_question f'>
                <View className='help_left_title'>
                  投诉反馈
                </View>
                <View className='help_right_title'>
                  <View className='help_right_top' style={style}>商家仅接受现金支付怎么办?</View>
                  <View className='help_right_bottom' style={style}>商家拒绝退单怎么处理?</View>
                </View>
              </View>
            </View>
            {/*用户反馈  */}
            <View className='help_frequentlyQuestion'>
              意见反馈
             </View>
            {/*意见反馈  */}
            <View className='help_feedback f page_between' onClick={this.gofeedBack}>
              <View>
                提出您想反馈的问题
              </View>
              <View className='help_setQuestion'>
              </View>
            </View>
          <View className='help_goSelect f'>
            <View className='borders'></View>电话客服:<Text className='help-telephone'> 10108976</Text><View className='borders'></View>
          </View>
        </View>
      )
    }
  }

  export default Index
