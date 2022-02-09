import Taro from "@tarojs/taro";

const navigateTo = (url, events) => {
  Taro.navigateTo({
    url: url,
    events: events || {},
  });
  //跳转
};
//页面跳转
const redirectTo = (url) => {
  Taro.redirectTo({
    url: url,
  });
};
//页面重定向
const switchTab = (url) => {
  Taro.switchTab({
    url: url,
  });
};
//跳转tab页面
const reLaunch = (url) => {
  Taro.reLaunch({
    url: url,
  });
};
//关闭所有页面打开这个页面

export default ({ routerName, type = "navigateTo", args = {} }) => {
  const routerObj = {
    goods: "/pages/index/goods/index", //订单中心
    perimeter: "/pages/index/lookAround/index", //周边打卡,
    home: "/pages/index/home/index", //首页
    takeCard: "/pages/index/takeCard/index", //打卡地图
    user: "/pages/index/user/index", //首页个人
    sign: "/pages/index/sign/index", //游戏

    //tab页面和分享
    couponDetails: "/pages/coupon/couponDetails/index", //券包详情
    wraparound: "/pages/coupon/wraparound/index", //券包
    selectCoupon: "/pages/coupon/selectCoupon/index", //选择支付关联券
    //券包
    bubble: "/pages/perimeter/bubble/index", //跳转风向标
    groupDetails: "/pages/perimeter/kaMerchantDetails/index", //集团详情
    gradeGood: "/pages/perimeter/gradeGood/index", //店铺带搜索通用页面
    publicTypeGoods: "/pages/perimeter/publicTypeGoods/index", //店铺公用页面
    goodList: "/pages/perimeter/perimeterList/index", //店铺列表
    rankInfo: "/pages/perimeter/rankInfo/index", //排行榜
    payCouponDetails: "/pages/perimeter/payCouponDetails/index", //优惠券详情
    nearPerimeter: "/pages/perimeter/nearPerimeter/index", //附近特惠
    benchmark: "/pages/perimeter/benchmark/index", //逛逛风向标列表
    perimeterShops: "/pages/perimeter/perimeterShops/index", //周边好店
    businessSell: "/pages/perimeter/businessSell/index", //商家简单信息
    groupChild: "/pages/perimeter/groupChild/index", //集团子门店列表
    groupList: "/pages/perimeter/groupList/index", //集团列表
    specialOffer: "/pages/perimeter/specialOffer/index", //逛逛内层列表
    speciaMaterial: "/pages/perimeter/speciaMaterial/index", //逛逛内层爆品列表
    beanReward: "/pages/perimeter/beanReward/index", //卡豆明细
    merchantVideo: "/pages/perimeter/merchantVideo/index", //商家视频
    nearVideo: "/pages/perimeter/nearVideo/index", //附近视频
    willCity: "/pages/perimeter/willCity/index", //即将开通
    city: "/pages/perimeter/city/index", //城市定位
    search_shop: "/pages/perimeter/search_shop/index", //商家搜索
    search_fav: "/pages/perimeter/search_fav/index", //特价搜索
    favourableDetails: "/pages/perimeter/favourableDetails/index", //砍价详情
    shopDetails: "/pages/perimeter/shopDetails/index", //商品详情
    merchantDetails: "/pages/perimeter/merchantDetails/index", //周边详情
    merchantCommodity: "/pages/perimeter/commodity/index",
    special: "/pages/perimeter/special/index", //特价商品
    perimeteRoducts: "/pages/perimeter/perimeteRoducts/index", //特价商品选择项
    perimeterIndex: "/pages/perimeter/index", //打卡一条街
    repeatStatus: "/pages/perimeter/repeatStatus/index", //打卡状态： 重复打卡
    abnormalStatus: "/pages/perimeter/abnormalStatus/index", //打卡状态： 超过距离
    tipView: "/pages/perimeter/tipView/index",
    recharge: "/pages/perimeter/recharge/index", // 话费充值
    rechargeMemberList: "/pages/perimeter/rechargeMemberList/index", // 会员充值列表
    rechargeMember: "/pages/perimeter/rechargeMember/index", // 会员充值
    enterGroup: "/pages/perimeter/enterGroup/index", // 加入社群
    advertisingVideo: "/pages/perimeter/AdvertisingVideo/index", // 视频广告
    beanWelfareZone: "/pages/perimeter/beanWelfareZone/index", // 卡豆福利专区
    payCouponList: "/pages/perimeter/couponList/index", //有价券列表
    commer: "/pages/perimeter/commer/index", //电商商品
    orderDetails: "/pages/goods/orderDetails/index", //订单详情
    codePay: "/pages/goods/codePay/index", //
    coupon: "/pages/goods/codeCoupon/index",
    couponOrder: "/pages/goods/couponOrder/index",
    favourableOrder: "/pages/goods/favourOrder/index", //商品下单
    commerOrder: "/pages/goods/commerOrder/index", //特惠商品下单
    pay: "/pages/goods/payWeex/index", //支付页
    paySuccess: "/pages/goods/paySuccess/index", //支付成功页
    recharge: "/pages/perimeter/recharge/index", //话费充值
    prefecture: "/pages/perimeter/prefecture/index", //卡豆专区
    preChildTure: "/pages/perimeter/preChildTure/index", //吃喝玩乐购
    preSelfour: "/pages/perimeter/preSelfour/index", //周边游路口
    //订单  goods
    legal: "/pages/kol/legal/index", //达人等级
    report: "/pages/kol/report/index", //举报
    shareKolVideo: "/pages/kol/shareVideo/index", //kol视频详情页,
    shareKolImage: "/pages/kol/shareImage/index", //kol图片详情页,
    follow: "/pages/kol/follow/index", //关注列表,
    fans: "/pages/kol/fans/index", //粉丝列表
    //kol
    wallet: "/pages/newUser/wallet/index", //我的钱包
    merchantHome: "/pages/newUser/merchantDetails/index",
    //newUser

    makeError: "/pages/rules/makeError/index", //打卡失败
    interests: "/pages/rules/interests/index",
    realName: "/pages/rules/realName/index", //实名认证
    hotActive: "/pages/share/hotActive/index", //88前活动
    shareActive: "/pages/share/invitation/index", //活动
    download: "/pages/share/download/index", //下载
    login: "/pages/auth/index", //登录
    authPrize: "/pages/auth/authPrize/index", //登录
    webView: "/pages/share/webView/index", //内嵌h5
    shareActive: "/pages/share/shareActive/index", //活动页
    shareUser: "/pages/share/shareUser/index", //活动助力页面
    shareFriend: "/pages/share/shareFriend/index", //分享赚豆
    userNewArtist: "/pages/share/userNewArtist/index", //新人红包
    Grab: "/pages/share/Grab/index", //领取他人红包
    imper: "/pages/share/ImperVideo/index",

    //规则类

    delivery: "/pages/perimeter/delivery/index",

    //社团
    blindIndex: "/pages/blindBox/home/index", //盲盒 首页
    blindShare: "/pages/blindBox/shareBox/index", //盲盒邀请
    blindPrize: "/pages/blindBox/prize/index", //我的奖品
    blindPrizeDetail: "/pages/blindBox/prizeDetail/index", // 我的奖品详情
    rewardDetails: "/pages/newUser/rewardDetails/index", //卡豆明细
  }[routerName];
  const types = type;

  if (typeof args === "object") {
    args = Object.keys(args)
      .map((item) => {
        return `${item}=${args[item]}`;
      })
      .join("&");
  }
  switch (types) {
    case "navigateTo":
      return navigateTo(routerObj + (args ? `?${args}` : ""));
    case "redirectTo":
      return redirectTo(routerObj + (args ? `?${args}` : ""));
    case "switchTab":
      return switchTab(routerObj + (args ? `?${args}` : ""));
    case "reLaunch":
      return reLaunch(routerObj + (args ? `?${args}` : ""));
  }
};
