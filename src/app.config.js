export default {
  pages: [
    // 'pages/goods/paySuccess/index',
    // 'pages/goods/kolShopGoods/index',
    // 'pages/goods/getShopGoods/index',
    "pages/index/perimeter/index", //周边打卡
    "pages/index/goods/index",
    "pages/user/index", //首页个人
    "pages/index/lookShare/shareImage/index", //圖文详情
    "pages/index/lookShare/shareVideo/index", //视频详情
    "pages/index/lookShare/index", //看视频图文

    // "pages/perimeter/beanMark/index", //周边
    "pages/auth/index", //登录
    "pages/payPrice/index", //小程序支付
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
  },
  tabBar: {
    color: "#A5A5A5",
    selectedColor: "#07C0C2",
    backgroundColor: "#fafafa",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/perimeter/index",
        iconPath: "./assets/image/tab-bar/perimeter.png",
        selectedIconPath: "./assets/image/tab-bar/perimeterTrue.png",
        text: "周边",
      },
      // {
      //   pagePath: "pages/perimeter/index",
      //   iconPath: "./assets/image/tab-bar/card.png",
      //   selectedIconPath: "./assets/image/tab-bar/cardTrue.png",
      //   text: "打卡",
      // },
      {
        pagePath: "pages/index/goods/index",
        iconPath: "./assets/image/tab-bar/goods.png",
        selectedIconPath: "./assets/image/tab-bar/goodsTrue.png",
        text: "订单"
      },
      {
        pagePath: "pages/user/index",
        iconPath: "./assets/image/tab-bar/me.png",
        selectedIconPath: "./assets/image/tab-bar/meTrue.png",
        text: "我的",
      },
    ],
  },
  permission: {
    "scope.userLocation": {
      desc: "位置信息将用于与商家位置的信息共享",
    },
  },
subPackages:[
    {
      "root": "pages/kol/",
      "pages": [
        "shareVideo/index",///kol视频详情页,
        "shareImage/index",//kol图片详情页,
        "follow/index",//关注列表,
        "fans/index",//粉丝列表,
      ]
    },
    {
    "root": "pages/newUser/",
    "pages": [
      "merchantDetails/index",///商家主页,
      "shopFamily/index",//,我的家店
      "userDetails/index",//个人主页,
      "userFamily/index",//我的家人,
      "goods/index", //我的订单
      "record/index", //打卡记录
      "beanRule/index", //卡豆权益
      "userConceal/index", //协议规则
      "accustomed/expressCard/index", //关爱打卡
      'accustomed/addExpressCard/index'//配置关爱打卡
    ]
  },
    {
    "root": "pages/share/",
    "pages": [
      "download/index",///下载,
      "step/index",//,同步步数
      "shareFriend/index",//分享好友,
      'shareShop/index',//分享家店
      'pay_wx_lite/index',//微信支付
    ]
  },
    {
    "root": "pages/perimeter/",
    "pages": [
      "shopDetails/index", //商品详情
      "merchantDetails/index", //周边详情
      "special/index",//特价商品
      "index", //周边首页
    ]
  },
  {
    "root": "pages/goods/",
    "pages": [
      "payWeex/index", //kol支付
      "configOrder/index", //kol下单
      'kolShopGoods/index',
      'getShopGoods/index',
      'paySuccess/index',
    ]
  },
  ]
}
