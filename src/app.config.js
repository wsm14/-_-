export default {
  pages: [
    "pages/index/home/index", //周边打卡
    // "pages/index/perimeter/index", //视频详情
    "pages/index/lookAround/index", //逛逛
    "pages/index/goods/index",
    "pages/index/user/index", //首页个人
    "pages/auth/index", //登录
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
        pagePath: "pages/index/goods/index",
        iconPath: "./assets/image/tab-bar/goods_1.png",
        selectedIconPath: "./assets/image/tab-bar/goods.png",
        text: "订单",
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
      root: "pages/kol",
      pages: [
        "legal/index", //达人等级
        "report/index", //举报
        "follow/index", //关注列表,
        "fans/index", //粉丝列表,
      ],
    },
    {
      root: "pages/newUser",
      pages: [
        "circle/index", //协议规则
        "incomeDetails/index", //收益明细
        "rewardDetails/index", //奖励 明细
        "wallet/index", //钱包
        "merchantDetails/index", ///商家主页,
        "userDetails/index", //个人主页,
        "record/index", //打卡记录
        "beanRule/index", //卡豆权益
        "userConceal/index", //协议规则
      ],
    },
    {
      root: "pages/relay",
      pages: [
        "home/index", //tabbar页面
        "community/groupUser/index", //查看他人主页
        "community/goodInfo/index", //商品详情
        "community/delivery/index", //收货地址
        "community/order/index", //跟团购买
        "community/cabinet/index", // 团员自提点选择
        "groupCreate/Create/index", // 一键开团
        "groupCreate/GoodsDepict/index", // 一键开团 商品描述设置
        "groupCreate/LogisticsWay/index", // 一键开团 物流方式设置
        "groupCreate/SelfCommission/index", // 一键开团 自提点佣金设置（暂时没有用 无业务）
        "order/DetailPages/index", // 订单详情
        "order/GroupOrderManage/index", // 订单管理 - 团长
        "order/GroupVerification/index", // 订单管理 - 核销
        "personal/Wallet/Purse/index", // 个人中心 - 钱包 - 我的钱包
        "personal/Wallet/PurseWithdraw/index", // 个人中心 - 钱包 - 钱包提现
        "personal/Wallet/PurseDetail/index", // 个人中心 - 钱包 - 账单明细
        "personal/Wallet/BankForm/index", // 绑定银行卡
        "personal/Teamplayer/index", // 个人中心 - 我的团员
        "personal/DicPlayer/index", // 个人中心 - 钱包 - 账单明细
        "personal/SelfLiftingPoint/List/index", // 个人中心自提点管理 & 一键开团选择自提点页面
        "personal/SelfLiftingPoint/Edit/index", // 设置自提点 编辑 新增
        "personal/GoodsManage/List/index", // 个人中心 商品库管理 & 一键开团 导入商品库页面
        "personal/GoodsManage/Edit/index", // 商品库 编辑 新增
        "personal/GoodsManage/Import/index", // 商品库 导入
        "nearVideo/index", // 看视频领豆
      ],
    },
    {
      root: "pages/share",
      pages: [
        "hotActive/index", //8.8前面活动
        "mainScene/index", //8_8主会场
        "shopScene/index", //8_8帶貨
        "friendScene/index", //8_8邀请好友
        "invitation/index", //邀请函
        "download/index", //下载,
        "shareFriend/index", //分享好友,
        "pay_wx_lite/index", //微信支付
        "webView/index", //webView页面
        "mPay_wx_lite/index", //商家端支付页面
        "userNewArtist/index", //新人福利頁面
        "userNewGift/index", //新人红包頁面
        "Grab/index", //领取他人发送红包页
      ],
    },
    {
      root: "pages/perimeter",
      pages: [
        "kaMerchantDetails/index", //集团详情
        "gradeGood/index", //带搜索的公用商品列表
        "perimeterList/index", //逛逛商品列表
        "publicTypeGoods/index", //逛逛公用功能区页面
        "rankInfo/index", //排行榜
        "perimeterShops/index", //周边好店
        "videoDetails/index", //视频详情
        "couponList/index", //有价券列表
        "payCouponDetails/index", //有价券详情
        "benchmark/index", //逛逛风向标列表
        "specialOffer/index", //逛逛限时秒杀内层列表
        "speciaMaterial/index", //逛逛爆品福利内层列表
        "groupChild/index", //集团子门店
        "groupList/index", //特惠集团搜索
        "merchantVideo/index", //商家主页视频
        "nearVideo/index", //附近主页视频
        "beanReward/index", //卡豆明细
        "commodity/index", //橱窗商品详情
        "willCity/index", //即将开通
        "businessSell/index", //商家信息
        "city/index", //城市定位
        "search_shop/index", //商家搜索
        "search_fav/index", //特价搜索
        "favourableDetails/index", //砍价详情
        "shopDetails/index", //商品详情
        "merchantDetails/index", //商家详情
        "special/index", //特价商品
        "perimeteRoducts/index",
        "tipView/index", //打卡状态： 超过距离
        "groupMerchant/index", //集团核销列表
        "bubble/index", //品类风向标
        "nearPerimeter/index", //附近特惠
        "prefecture/index", //卡豆专区
        "recharge/index", //话费充值
      ],
    },
    {
      root: "pages/goods",
      pages: [
        "payWeex/index", //支付
        "favourOrder/index", //特价下单
        "couponOrder/index", //有价券下单
        "kolShopGoods/index", //普通商品详情
        "getShopGoods/index", //扫码订单详情
        "paySuccess/index", //kol支付成功
        "codePay/index", //扫码订单生成订单页
        "code_wx_pay/index", //扫码订单支付页面
        "code_scanPay_Susccess/index", //扫码订单成功页面
        "codeCoupon/index", //设置优惠券
        "rechargeOrder/index", //话费支付
      ],
    },
    {
      root: "pages/coupon",
      pages: [
        "wraparound/index", //券包
        "couponDetails/index", //券包详情
        "voucherDetails/index", //抵扣券详情
      ],
    },
    {
      root: "pages/rules",
      pages: [
        "interests/index", //券包
        "makeError/index", //打卡失败
        "realName/index", //实名认证
      ],
    },
  ],
};
