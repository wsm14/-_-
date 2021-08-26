/**
 * 统一参数配置
 */

// 商品 - 可购数量
export const GOODS_BUY_NUMBER = { fixed: "不限", gain: "每人限购" };
// 商品 - 送货状态
export const GOODS_BY_TYPE = {
  self: "自提",
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
