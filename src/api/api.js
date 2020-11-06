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
  wechatPayDelayOrder: '/user/pay/adapay/payDelayOrder'// kol下单
}

export const user = {
  userDetails : {
     getDetails: '/user/userInfo/getOtherDetail',//获取主页信息  userId必填  token非必填
     getListOtherMomentByType: '/user/userMoment/listOtherMomentByType',//获取分享  userId用户Id page页数 limit每页数量 contentType类型视频或图文
     saveUserFollow: '/user/userFollow/saveUserFollow', //添加关注
     deleteUserFollow: '/user/userFollow/deleteUserFollow',//取消关注
     saveCollection: '/user/userCollection/saveUserCollection',//添加收藏
     deleteCollection: '/user/userCollection/deleteUserCollection',//取消收藏
     updateKol: '/user/kolMoments/updateKolMomentsLikeAmount',
     deleteKolMoments:'/user/kolMoments/deleteKolMomentsLikeAmount',//取消点赞
     getOtherUser:'/user/userInfo/getOtherUserDetail',//获取他人详情
     getUserDetailInfo: '/user/userInfo/getUserDetailInfo',
     getOtherShare: '/user/kolMoments/listKolMomentByUserId',//获取他人分享
     getUserShare: '/user/userMoment/listMomentByUserId',//获取自己分享
     getUserCollection:'/user/userCollection/listOtherCollectionMomentByUserId',//获取收藏
     getFollowByUserId: '/user/userFollow/listOtherUserFollowByUserId', //关注
     listUserMark:  '/user/userMark/listUserMarkTrackMerchantInfo' // 获取足迹
  },
  shopFamily: {
    getMyMerchant: '/user/userInfo/getMyMerchantSum',//获取家店数据
    getMyMerchantList: '/user/userInfo/getMyMerchant',//获取家店列表
  },
  userFamily: {
    getFamilyUser: '/user/userInfo/getFamilyUserSimple',//获取家人数据
    getListUser: '/user/userInfo/listFamilyUser',//获取家人列表
  },
  merchantDetails:{
    getOtherMerchant: '/user/userMerchant/getOtherMerchantDetail',//获取其他商家详情
    getOtherMoment: '/user/userMoment/listOtherMomentByType',//获取他人分享
  }
}
export const kol = {
  fans : {
    getFans: '/user/userFollow/listUserFollowByFollowUserId'
  },
  follow : {
    getListUserFollow: '/user/userFollow/listUserFollowByUserId',//查询用户关注列表
    listOtherUserFollowByUserId: '/user/userFollow/listUserFollowByUserId'//获取其他用户关注列表
  },
  shareDetails : {
    getMomentDetail: '/user/kolMoments/getKolMomentDetailById', //查看kol动态详情
    saveWatch:'/user/beanDetail/saveWatchKolMomentsByUserId',//看视频获取卡豆
  },
}
export const index = {
  perimeter: {
    getUserSimpleInfo: '/user/userInfo/getUserSimpleInfo',//获取我的简单信息
    getDomain: '/common/domain/listDomainAndTopic',//获取 所有领域和对应话题
    getListKol: '/user/kolMoments/listKolMoments',//获取所有kol列表
  },
  goods: {
    'orderDetails': '/user/order/listOrderOrderStatus'//获取我的订单
  }
}
export const share = {
  shareFriend: {
    getShareInfo: '/common/share/getShareInfo',//获取用户分享信息
  }
}
export const perimeter = {
  shopDetails: {
    getGoodsById: '/user/kolMoments/listKolMomentByGoodsId',//获取kol达人带货商品动态
    getGoodsDetail: '/user/kolGoods/getKolGoodsDetail',//kol商品详情
  }
}
export const goods = {
   configOrder: {
     getKolGoodsOrderPrice: '/user/kolGoods/getKolGoodsOrderPrice',
     saveKolGoodsOrder: '/user/order/saveKolGoodsOrder',//确认达人订单
     /*
     * params
     * kolGoodsId 商品ID
     * merchantId 商家ID
     * */
   },
   payWeex: {
     getKolOrderPrepayment: '/user/order/getKolOrderPrepaymentResult',//获取支付详情
   },
   getKolOrderDetail: '/user/order/getKolOrderDetail',//获取带货订单详情
   listSpecialGoods: '/user/specialGoods/listSpecialGoods',//获取猜你喜欢
   getOrderResult: '/user/order/getOrderResult',//支付成功时跳转页面
}
