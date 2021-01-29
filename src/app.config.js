export default {
  pages: [
    "pages/index/perimeter/index", //周边打卡
    "pages/index/takeCard/index",
    "pages/index/goods/index",
    "pages/index/user/index", //首页个人
    "pages/index/lookShare/shareImage/index", //圖文详情
    "pages/index/lookShare/shareVideo/index", //视频详情
    "pages/payPrice/index", //小程序支付兼容
    "pages/auth/index", //登录
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#ffffff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black",
    navigationStyle: "custom",
  },
  tabBar: {
    color: "#A5A5A5",
    selectedColor: "#333333",
    backgroundColor: "#fafafa",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/perimeter/index",
        iconPath: "./assets/image/tab-bar/perimeter.png",
        selectedIconPath: "./assets/image/tab-bar/perimeterTrue.png",
        text: "周边",
      },
      {
        pagePath: "pages/index/takeCard/index",
        iconPath: "./assets/image/tab-bar/card.png",
        selectedIconPath: "./assets/image/tab-bar/cardTrue.png",
        text: "打卡",
      },
      {
        pagePath: "pages/index/goods/index",
        iconPath: "./assets/image/tab-bar/goods.png",
        selectedIconPath: "./assets/image/tab-bar/goodsTrue.png",
        text: "订单",
      },
      {
        pagePath: "pages/index/user/index",
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
  subPackages: [
    {
      root: "pages/kol/",
      pages: [
        "legal/index", //达人等级
        "report/index", //举报
        "shareVideo/index", ///kol视频详情页,
        "shareImage/index", //kol图片详情页,
        "follow/index", //关注列表,
        "fans/index", //粉丝列表,
      ],
    },
    {
      root: "pages/newUser/",
      pages: [
        "incomeDetails/index", //收益明细
        "rewardDetails/index", //奖励 明细
        "wallet/index", //钱包
        "merchantDetails/index", ///商家主页,
        "shopFamily/index", //,我的家店
        "userDetails/index", //个人主页,
        "userFamily/index", //我的家人,
        "record/index", //打卡记录
        "beanRule/index", //卡豆权益
        "userConceal/index", //协议规则
        "accustomed/expressCard/index", //关爱打卡
        "accustomed/addExpressCard/index", //配置关爱打卡
      ],
    },
    {
      root: "pages/share/",
      pages: [
        "download/index", ///下载,
        "step/index", //,同步步数
        "shareFriend/index", //分享好友,
        "shareShop/index", //分享家店
        "pay_wx_lite/index", //微信支付
        "webView/index", //webView页面
        "mPay_wx_lite/index", //商家端支付页面
      ],
    },
    {
      root: "pages/perimeter/",
      pages: [
        'commodity/index',//橱窗商品详情
        'willCity/index', //即将开通
        "businessSell/index", //商家信息
        "city/index", //城市定位
        "search_shop/index", //商家搜索
        "search_fav/index", //特价搜索
        "favourableDetails/index", //砍价详情
        "shopDetails/index", //商品详情
        "merchantDetails/index", //商家详情
        "special/index", //特价商品
        "perimeteRoducts/index",
        "repeatStatus/index", //打卡状态： 重复打卡
        "abnormalStatus/index", //打卡状态： 超过距离
        "tipView/index", //打卡状态： 超过距离
        "lookShare/index", //看视频图文
        'groupMerchant/index',//集团核销列表
        "index", //周边首页
      ],
    },
    {
      root: "pages/goods/",
      pages: [
        "payWeex/index", //kol支付
        "configOrder/index", //kol下单
        "favourOrder/index", //特价下单
        "kolShopGoods/index", //普通商品详情
        "getShopGoods/index", //扫码订单详情
        "paySuccess/index", //kol支付成功
        "codePay/index", //扫码订单生成订单页
        "code_wx_pay/index", //扫码订单支付页面
        "code_scanPay_Susccess/index", //扫码订单成功页面
        "codeCoupon/index", //设置优惠券
      ],
    },
    {
      root: "pages/coupon/",
      pages: [
        "wraparound/index", //券包
        "couponDetails/index", //券包详情
        "voucherDetails/index", //抵扣券详情
      ],
    },
  ],
};
