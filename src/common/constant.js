/**
 * 统一参数配置
 */

export const resiApiKey = "f390f1e2b0faa95710d00a0801384c41";
//高德key
export const renterCouponDesc = (data) => {
  const { classType = "universal", useScenesType } = data;
  if (classType === "universal" && useScenesType === "goodsBuy") {
    return "商品通用券";
  } else if (classType === "category" && useScenesType === "goodsBuy") {
    return "行业商品券";
  } else if (classType === "merchant" && useScenesType === "goodsBuy") {
    return "店铺商品券";
  } else if (classType === "goods" && useScenesType === "goodsBuy") {
    return "指定商品券";
  } else if (classType === "universal" && useScenesType === "virtual") {
    return "虚拟通用券";
  } else if (classType === "goods" && useScenesType === "virtual") {
    return "指定虚拟券";
  } else if (classType === "universal" && useScenesType === "commerce") {
    return "电商通用券";
  } else if (classType === "goods" && useScenesType === "commerce") {
    return "指定电商券";
  }
};
