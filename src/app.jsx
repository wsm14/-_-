import Taro, { Component } from '@tarojs/taro'
import { Provider } from '@tarojs/mobx'
import authStore from './store/auth'
import beanStore from './store/beanMark'
import pageList from './router/index'
import 'taro-ui/dist/style/index.scss'
import './app.scss'
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }
const store = {
  authStore,
  beanStore
}
class App extends Component {
  config = {
    pages:[
      'pages/index/index',//首页主页
      'pages/payPrice/index',//小程序支付
      'pages/index/lookShare/index',//看视频图文
      'pages/index/perimeter/index',//周边打卡
      'pages/perimeter/map/index',//地图
      'pages/perimeter/beanMark/index',//周边
      'pages/index/lookShare/shareVideo/index',//视频详情
      'pages/index/lookShare/shareImage/index',//圖文详情
      'pages/index/accustomed/drinking/index',//好习惯喝水
      'pages/index/accustomed/customizeHabit/index',//自定义打卡
      'pages/index/accustomed/userExploits/index',//我的战绩
      'pages/index/accustomed/sportsPoster/index',//习惯打卡-比赛详情
      'pages/index/accustomed/index',//习惯打卡
      'pages/index/accustomed/habitCard/index',//好习惯打卡详情
      'pages/index/accustomed/addExpressCard/index',//添加关爱打卡
      'pages/index/accustomed/expressCard/index',//关爱打卡
      'pages/index/healthTakeCard/motionRecord/index',//健康打卡-运动记录
      'pages/index/healthTakeCard/index',//健康打卡主页
      'pages/index/healthTakeCard/healthEnlist',//健康打卡报名
      'pages/index/healthTakeCard/ranking',//健康打卡排行榜

      'pages/perimeter/merchantDetails/index',//周边详情
      'pages/perimeter/index',//周边
      'pages/user/index',//首页个人
      'pages/user/goods/index',//我的订单
      'pages/user/record/index',//打卡记录
      'pages/user/beanRule/index',//卡豆权益
      'pages/user/userConceal/index',//协议规则
      'pages/share/step/index',//分享步数
      'pages/share/download/index',//下载
      'pages/auth/index',//登录
    ],
    subPackages: [
    ],
    requiredBackgroundModes: ['audio'],
    permission:{'scope.userLocation': {
        desc: '位置信息将用于与商家位置的信息共享'
      }},
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle: 'custom',
    },
    tabBar: {
      color: "#A5A5A5",
      selectedColor: "#07C0C2",
      backgroundColor: "#fafafa",
      borderStyle: 'black',
      list: [{
        pagePath: "pages/index/index",
        iconPath: "./assets/image/tab-bar/tab-bar-1.png",
        selectedIconPath: "./assets/image/tab-bar/tab-bar-1Checked.png",
        text: "首页"
      }
      ,
        {
        pagePath: "pages/perimeter/index",
        iconPath: "./assets/image/tab-bar/tab-bar-2.png",
        selectedIconPath: "./assets/image/tab-bar/tab-bar-2Checked.png",
        text: "周边"
      },
        // {
        //   pagePath: "pages/home/index",
        //   iconPath: "./assets/image/tab-bar/tab-bar-3.png",
        //   selectedIconPath: "./assets/image/tab-bar/tab-bar-3Checked.png",
        //   text: "攻略"
        // },
        {
        pagePath: "pages/user/index",
        iconPath: "./assets/image/tab-bar/tab-bar-4.png",
        selectedIconPath: "./assets/image/tab-bar/tab-bar-4Checked.png",
        text: "个人"
      }]
    }
  }

  componentDidMount () {
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
