export const wxapiGet = {
  wechatAuth: '/user/wechat/auth',//小程序授权
  wechatBindMobile: '/user/wechat/bindMobileByWechatXcx',//小程序绑定手机
  wechatBindData: '/user/wechat/getEncryptedData',// /小程序获取加密数据
  wechatBanner: '/common/banner/listBanner',  //轮播图
  wechatConditions: '/user/userMerchant/listAllBySearchConditions', //周边商家列表
  wechatMerchantList: '/user/userMerchant/recommendMerchantList',//首页猜你喜欢
  wechatMain: '/user/userInfo/mainPage',//首页个人资料
  wechatShare: '/user/userMoment/listMomentByType',//首页分享
  wechatByRoot: '/common/dictionary/listDictionaryByRoot',
  wechatStepAuth: '/user/wechat/stepAuth',//获取微信步数授权
  wechatStepEncryptedData: '/user/wechat/getStepEncryptedData',//获取微信步数
  wechatListCategory: '/user/category/listCategoryByParentId',//获取分类标签，
  wechatUserMomentDetail: '/user/userMoment/getUserMomentDetailById',//获取分类标签
  wechatListOrder: '/user/order/listOrderOrderStatus',//
  wechatlistCustomMarkInfo: '/user/userHabit/listCustomMarkInfo',//获取用户自定义习惯
  wechatGetUserHabit: '/user/userHabit/getUserHabit', //获取习惯打卡项目
  wechatGetSimpleInfo: '/user/match/getMatchSimpleInfo',//获取习惯打卡比赛简单信息
  wechatGetMarkDetail: '/user/userHabit/getUserHabitMarkDetail',
  wechatGetMatch: '/user/match/getMatch',//获取比赛信息
  wechatGetSimpleRecord: '/user/userMatch/getMyMatchSimpleRecord',//获取我的战绩简单信息
  wechatGetMatchRecordInfo: '/user/userMatch/listUserMatchRecordInfo',//查询我的战绩比赛信息
  wechatGetUserMerchant: '/user/userMerchant/getMerchantDetail', //获取商家信息
  wechatListRecommend: '/user/goods/listRecommendGoods',
  wechatUserBanner: '/user/bannerInfo/getBannerList',
  wechatPrepaymentResult: '/user/order/getOrderPrepaymentResult',
  wechatUserByUniqueId: '/user/userInfo/getOtherDetail',//获取分享信息
  wechatMarkTrack: '/user/userMark/listUserMarkTrack',//打卡足迹
  wechatSearchConditions: '/user/userMerchant/listMerchantBySearchConditions' //获取可打卡列表
}
export const wxapiPost = {
  userFeedback:'/user/feedback/saveUserFeedbackByUserId',
  wechatlistUserHabit: '/user/userHabit/saveUserHabit',//保存习惯打卡项目
  wechatUserTask: '/user/userTask/saveUserTask',
  wechatlistDeleteUserHabit: '/user/userHabit/deleteUserHabit',//删除习惯打卡项目
  wechatDrinkingMark: '/user/userTask/saveDrinkingMark',//喝水
  wechatBeanDetail: '/user/beanDetail/saveWatchBeanDetailByUserId',//看视频获取卡豆
  wechatBeanMark: '/user/beanDetail/saveMarkBeanDetailByUserId',//打卡获取卡豆
  wechatPayOrder: '/user/pay/adapay/payOrder',// 扫码支付
  wechatPayDelayOrder: '/user/pay/adapay/payDelayOrder'// 点餐下单
}

