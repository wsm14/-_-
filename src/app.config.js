export default {
  pages: [
    "pages/index/home/index", //视频连刷
    "pages/index/lookAround/index", //逛逛
    "pages/index/user/index", //首页个人
    "pages/index/goods/index",
    "pages/index/sign/index", //签到游戏
    "pages/auth/index", //登录
    "pages/auth/authPrize/index", //券礼包加登录
  ],
  window: {
    backgroundTextStyle: "dark",
    navigationBarBackgroundColor: "#ffffff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
  },
  tabBar: {
    color: "#999999",
    selectedColor: "#333333",
    backgroundColor: "#fafafa",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/home/index",
        iconPath: "./assets/image/tab-bar/home_1.png",
        selectedIconPath: "./assets/image/tab-bar/home.png",
        text: "捡豆",
      },
      {
        pagePath: "pages/index/lookAround/index",
        iconPath: "./assets/image/tab-bar/look_1.png",
        selectedIconPath: "./assets/image/tab-bar/look.png",
        text: "逛逛",
      },
      {
        pagePath: "pages/index/sign/index",
        iconPath: "./assets/image/tab-bar/sign_icon1.png",
        selectedIconPath: "./assets/image/tab-bar/sign_icon.png",
        text: "签到",
      },
      {
        pagePath: "pages/index/user/index",
        iconPath: "./assets/image/tab-bar/me_1.png",
        selectedIconPath: "./assets/image/tab-bar/me.png",
        text: "我的",
      },
    ],
  },
  permission: {
    "scope.userLocation": {
      desc: "位置信息将用于与商家位置的信息共享",
    },
  },
  subPackages: [
    {
      root: "pages/blindBox",
      pages: [
        "shareBox/index", //盲盒助力
        "home/index", // 盲盒首页
        "prizeDetail/index", // 奖品详情
        "prize/index", // 盲盒奖品
        "gamePrize/index", //游戏奖品
      ],
    },
    {
      root: "pages/newUser",
      pages: [
        "rewardDetails/index", //奖励 明细
        "wallet/index", //钱包
        "beanRule/index", //卡豆权益
        "userConceal/index", //协议规则
      ],
    },
    {
      root: "pages/share",
      pages: [
        "download/index", //下载,
        "shareFriend/index", //分享好友,
        "webView/index", //webView页面
        "gameShare/index", //游戏助力页面
        "gameHelp/index", //游戏邀请页面
        "Grab/index", //领取他人发送红包页
        "shareActive/index", //活动主会场
        "shareUser/index", //活动页助力
        "shareSign/index", //集碎片助力
      ],
    },
    {
      root: "pages/perimeter",
      pages: [
        "kaMerchantDetails/index", //集团详情
        "perimeterList/index", //逛逛商品列表
        "publicTypeGoods/index", //逛逛公用功能区页面
        "rankInfo/index", //排行榜
        "perimeterShops/index", //周边好店
        "prefecture/index", //卡豆专区
        "preChildTure/index", //吃喝玩乐购内页
        "delivery/index", //收货地址
        "preSelfour/index", //自我游购内页
        "city/index", //城市定位
        "favourableDetails/index", //特惠详情
        "couponList/index", //有价券列表
        "benchmark/index", //逛逛风向标列表
        "specialOffer/index", //逛逛限时秒杀内层列表
        "speciaMaterial/index", //逛逛爆品福利内层列表
        "groupChild/index", //集团子门店
        "groupList/index", //特惠集团搜索
        "beanReward/index", //卡豆明细
        "commodity/index", //橱窗商品详情
        "businessSell/index", //商家信息
        "special/index", //特价商品
        "commer/index", //电商商品内页
        "goodThings/index", //精选商品
        "bubble/index", //品类风向标
        "nearPerimeter/index", //附近特惠
        "payCouponDetails/index", //有价券详情
        "nearVideo/index", //附近主页视频
        "merchantVideo/index", //商家主页视频
        "videoDetails/index", //视频详情
        "recharge/index", // 话费充值
        "rechargeMember/index", // 会员充值列表
        "rechargeMemberList/index", // 会员充值列表
        "AdvertisingVideo/index", // 视频广告
        "search_shop/index", //商家搜索
        "merchantDetails/index", //商家详情
      ],
    },
    {
      root: "pages/goods",
      pages: [
        "payWeex/index", //支付
        "favourOrder/index", //商品下单页面
        "couponOrder/index", //有价券下单
        "paySuccess/index", //支付成功页面
        "codePay/index", //扫码订单生成订单页
        "orderDetails/index", //订单详情
      ],
    },
    {
      root: "pages/coupon",
      pages: [
        "wraparound/index", //券包
        "couponDetails/index", //券包详情
        "selectCoupon/index", //选择支付券
      ],
    },
    {
      root: "pages/rules",
      pages: [
        "interests/index", //权益说明
        "makeError/index", //打卡失败
        "realName/index", //实名认证
      ],
    },
  ],
};
