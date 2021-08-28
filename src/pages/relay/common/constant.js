/**
 * 统一参数配置
 */

// 商品 - 可购数量
export const GOODS_BUY_NUMBER = { unlimited: "不限", personLimit: "每人限购" };

// 团购状态
export const GROUP_STATUS = {
  "": "全部",
  start: "跟团中",
  notStarted: "未开始",
  end: "已结束",
};

// 物流方式设置 - 需要用户填写信息
export const LOGISTICS_USER_INFO = {
  writeContentPerson: "联系人",
  writeMobile: "电话",
  writeAddress: "地址",
};

// 商品 - 送货状态
export const GOODS_BY_TYPE = {
  self: "顾客自提",
  send: "送货上门",
  noLogistics: "无需物流",
};

// 商品 - 活动时间
export const GOODS_STATUS_TYPE = {
  notStarted: "未开始",
  start: "进行中",
  end: "已结束",
};

export const ORDER_STATUS = {
  a: "待支付",
  b: "已支付",
  c: "发货",
  d: "售后",
};
