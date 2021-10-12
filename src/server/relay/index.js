import { httpGet, httpPost } from "@/api/newRequest";

export const fetchPcUserInfo = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/mainPage",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 个人中心 - 用户信息

export const fetchPcDataCenter = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/todayStatistic",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 个人中心 - 数据中心今日订单数据

export const fetchTeamPlayer = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/teamList",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 个人中心 - 我的团员

export const fetchDicPlayer = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/communityUserList",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 个人中心 - 我的社区

export const fetchGoodsManageList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/goods/listCommunityCommonGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 商品库 - 商品列表

export const fetchGoodsManageNotCount = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/goods/countCommunityOrganizationGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 商品库 - 未导入商品库统计

export const fetchGoodsManageNotList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/goods/listCommunityOrganizationGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 商品库 - 未导入商品库列表

export const fetchGoodsManageStoreDel = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/community/goods/deleteCommunityCommonGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 商品库 - 商品删除

export const fetchGoodsManageStoreImport = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/community/goods/introductionGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 商品库 - 未导入商品导入商品库

export const fetchPurseDetail = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/listIncomeBeanDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 个人中心 - 钱包 - 资产明细

export const fetchLiftingCabinetCreate = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/lifting/createCommunityLiftingCabinet",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长自提点 - 创建

export const fetchLiftingCabinetEdit = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/community/lifting/updateCommunityLiftingCabinet",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长自提点 - 编辑

export const fetchLiftingCabinetDetail = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/lifting/communityLiftingCabinetDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长自提点 - 详情

export const fetchLiftingCabinetList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/lifting/listCommunityLiftingCabinet",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长自提点 - 列表

export const fetchGroupDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/communityOrganizationDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 详情

export const fetchGroupList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/listCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 列表

export const fetchGroupEdit = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/updateCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 修改

export const fetchGroupCreate = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/createCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 创建

export const fetchGroupClose = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/closeCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 关闭

export const fetchGroupOpen = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/openCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 开启

export const fetchGroupDoTop = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/doTop",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 置顶/取消置顶

export const fetchGroupDelete = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/deleteCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团购 - 删除

export const fetchCommunityUser = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/user/listCommunityOrganization",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-社团首页

export const fetchOrganizationUserDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/user/communityOrganizationUserDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-商家详情

export const fetchOrganizationRecord = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/user/listCommunityOrganizationRecord",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-团购商品详情-团购商品购买记录列表

export const fakeCreateUserAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/createUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-新增地址

export const fetchAddressList = (data, fn) => {
  return httpGet(
    {
      url: "/user/user/address/listUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-获取地址列表

export const fakeRemoveAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/deleteUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-删除地址

export const fakeUpdateAddress = (data, fn) => {
  return httpPost(
    {
      url: "/user/user/address/updateUserAddress",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-修改地址

export const fetchGoodsOrderPrice = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/user/getCommunityOrganizationGoodsOrderPrice",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-团购商品下单确认页

export const fakeOrganizationGoods = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/saveCommunityOrganizationGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-下单

export const fetchOrderClose = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/updateOrderStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 订单管理 关闭订单

export const fetchUserPay = (data, fn) => {
  return httpPost(
    {
      url: "/user/pay/adapay/payDelayOrder",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-下单

export const fakeSubscribe = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/user/doSubscribe",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员-订阅/取消订阅

export const fetchOrderStatus = (data, fn) => {
  return httpGet(
    {
      url: "/user/order/listOrderOrderStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取 订单列表

export const fetchOrderDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/order/getOrderDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员- 订单详情

export const fetchLiftingCabinet = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/lifting/listCommunityOrganizationLiftingCabinet",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团员- 获取团自提点

export const fetchCommunityOrder = (data, fn) => {
  return httpGet(
    {
      url: "/user/order/listRelateOwnerCommunityOrder",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团长订单列表

export const fetchVerificationGoods = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/organization/unVerificationGoodsCount",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团长-订单商品核销数

export const fetchCommunityGoods = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/verificationUserCouponCommunityGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团长-核销订单

export const fetchOrganizationShare = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/organization/share",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//添加观看人数
export const fetchUserCenter = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/userCenter",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//查看他人主页
export const fetchCommunityOrderQcode = (data, fn) => {
  return httpGet(
    {
      url: "/user/order/getCommunityOrderQcode",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//查询核销码

export const fetchCommonGoods = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/goods/createCommunityCommonGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团长商品-创建商品

export const fetchUpdateCommunityGoods = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/goods/updateCommunityCommonGoods",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团长商品-修改商品
export const fetchCommonGoodsDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/community/goods/communityCommonGoodsDetail",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//团长商品-修改商品

export const fetchBankList = (data, fn) => {
  return httpGet(
    {
      url: "/common/bankBranch/listBankBranch",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//我的-绑定银行卡-查询银行支行列表

export const fetchbankCard = (data, fn) => {
  return httpGet(
    {
      url: "/common/ocr/bankCard",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//我的-绑定银行卡-银行卡扫描识别

export const fetchCardFront = (data, fn) => {
  return httpGet(
    {
      url: "/common/ocr/idCardFront",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//我的-绑定银行卡-身份证认证 正面

export const fetchCardBack = (data, fn) => {
  return httpGet(
    {
      url: "/common/ocr/idCardBack",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//我的-绑定银行卡-身份证认证 反面
export const fetchPersonAccount = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/bank/user/createAdapayPersonAccount",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户创建汇付个人账号
export const fetchBankInfo = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/community/userBankInfo",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户錢包信息

export const fakeUserWithdraw = (data, fn) => {
  return httpPost(
    {
      url: "/user/community/saveUserWithdraw",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 团长提现

export const fetchUserBankStatus = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/bank/user/getUserBankStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//绑卡状态
export const getRelayMomentList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMoment/listMomentDetailByType",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取连刷视频动态
export const saveRelayWatchBean = (data, fn) => {
  return httpPost(
    {
      url: "/user/beanDetail/saveWatchBeanDetailByUserId",
      data: data,
    },
    (res) => fn(res)
  );
};
//看动态领取卡豆