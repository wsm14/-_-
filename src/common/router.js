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
export default ({ routerName, type = "navigateTo", args = {} }) => {
  const routerObj = {
    goods: "/pages/index/goods/index", //订单中心
    perimeter: "/pages/index/lookAround/index", //周边打卡,
    home: "/pages/index/home/index", //首页
    takeCard: "/pages/index/takeCard/index", //打卡地图
    user: "/pages/index/user/index", //首页个人
    lookShare: "/pages/index/lookShare/index", //看视频图文
    shareImage: "/pages/index/lookShare/shareImage/index", //圖文详情
    shareVideo: "/pages/index/lookShare/shareVideo/index", //视频详情
    //tab页面和分享
    couponDetails: "/pages/coupon/couponDetails/index", //券包详情
    wraparound: "/pages/coupon/wraparound/index", //券包
    //券包
    rankInfo: "/pages/perimeter/rankInfo/index", //排行榜
    payCouponDetails: "/pages/perimeter/payCouponDetails/index", //优惠券详情
    benchmark: "/pages/perimeter/benchmark/index", //逛逛风向标列表
    perimeterShops: "/pages/perimeter/perimeterShops/index", //周边好店
    businessSell: "/pages/perimeter/businessSell/index", //商家简单信息
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
    special: "/pages/perimeter/special/index", //特价商品
    perimeteRoducts: "/pages/perimeter/perimeteRoducts/index", //特价商品选择项
    perimeterIndex: "/pages/perimeter/index", //打卡一条街
    repeatStatus: "/pages/perimeter/repeatStatus/index", //打卡状态： 重复打卡
    abnormalStatus: "/pages/perimeter/abnormalStatus/index", //打卡状态： 超过距离
    tipView: "/pages/perimeter/tipView/index",
    payCouponList: "/pages/perimeter/couponList/index", //有价券列表
    //周边
    kolShopGoods: "/pages/goods/kolShopGoods/index", //支付订单详情
    codePay: "/pages/goods/codePay/index", //
    coupon: "/pages/goods/codeCoupon/index",
    couponOrder: "/pages/goods/couponOrder/index",
    favourableOrder: "/pages/goods/favourOrder/index",
    pay: "/pages/goods/payWeex/index", //支付页

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
    makeError: "/pages/rules/makeError/index",//打卡失败
    interests: "/pages/rules/interests/index",
    shareActive: "/pages/share/invitation/index", //活动
    download: "/pages/share/download/index", //下载
    login: "/pages/auth/index", //登录
    webView: "/pages/share/webView/index", //内嵌h5
    userNewArtist: "/pages/share/userNewArtist/index",
    //规则类
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
  }
};
