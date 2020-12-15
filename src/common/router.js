import Taro from "@tarojs/taro";

const navigateTo = (url, events) => {
  Taro.navigateTo({
    url: url,
    events: events || {},
  })
  //跳转
}
//页面跳转
const redirectTo = (url) => {
  Taro.redirectTo({
    url: url
  })
}
//页面重定向
const switchTab = (url) => {
  Taro.switchTab({
    url: url
  })
}
//跳转tab页面
export default ({routerName, type = 'navigateTo', args = {}}) => {
  const routerObj = {
    goods: "pages/index/goods/index", //订单中心
    perimeter: "pages/index/perimeter/index", //周边打卡,
    takeCard: "pages/index/takeCard/index", //打卡地图
    user: 'pages/index/user/index',//首页个人
    lookShare: "pages/index/lookShare/index", //看视频图文
    shareImage: "pages/index/lookShare/shareImage/index", //圖文详情
    shareVideo: "pages/index/lookShare/shareVideo/index", //视频详情
    //tab页面和分享
    couponDetails: "pages/coupon/couponDetails/index",//券包详情
    wraparound: 'pages/coupon/wraparound/index', //券包
    //券包
  }[routerName]
  const types = type
  if (typeof args === 'object') {
    args = Object.keys(args).map(item => {
      return `${item}=${args[item]}`
    }).join('&')
  }
  switch (types) {
    case 'navigateTo':
      return navigateTo(routerObj + (args ? `?+${args}` : ''))
    case 'redirectTo':
      return redirectTo(routerObj + (args ? `?+${args}` : ''))
    case 'switchTab':
      return switchTab(routerObj + (args ? `?+${args}` : ''))
  }
}


