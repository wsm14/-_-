import { httpGet, httpPost } from "@/utils/request";
import store from "./../../model";

export const fetchBanner = (data = {}) => {
  return httpGet({
    data: data,
    url: "/common/banner/listBanner",
  });
};
//获取轮播图

export const fetchShareParamInfo = (data = {}, fn) => {
  httpGet(
    {
      url: "/common/shareParam/getShareParam",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取解密分享码
export const fetchDictionary = (data, fn) => {
  return httpGet(
    {
      data: data,
      url: "/common/dictionary/getDictionaryByParentAndChild",
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//通过父节点和子节点获取字典
export const fetchShareInfo = (data = {}, fn) => {
  const { authStore } = store;
  const { shareType = {} } = authStore;
  const { sourceKey, sourceType } = shareType;
  return httpGet(
    {
      url: "/common/share/getShareInfo",
      data: {
        ...data,
        sourceKey,
        sourceType,
      },
    },
    (res) => fn && fn(res)
  );
};
//用户分享通用接口
export const fetchConfigWindVaneBySizeNew = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/category/scenes/listConfigWindVaneBySizeNew",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//逛逛风向标
export const getSpecialGoodsCategory = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/category/listSpecialGoodsCategory",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//逛逛特惠商品筛选项
export const fetchAroundModule = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/configModule/getWanderAroundModule",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//逛逛配置项;
export const fetchUserShareCommission = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userInfo/getUserShareCommission",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取卡豆抵扣详情

export const fetchShareConfig = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/share/getShareConfig",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取分享配置
export const fetchCategory = (data, fn) => {
  return httpGet(
    {
      url: "/common/category/listCategoryByParentId",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取品类
export const fetchBusinessHub = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/businessHub/lisBusinessHubByCityCode",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取商圈
export const fetchGoodsTag = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/config/goods/tag/listGoodsTag",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//通过行业id & 端类型获取商品标签;
export const fetchConfigWindVaneBySize = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/category/scenes/listConfigWindVaneBySize",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取风向标
export const fetchGetAdderssInfo = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/third/aliyun/address/getAliyunAddressInfo",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 粘贴获取地址识别接口;
export const fetchNewShareInfo = (data, fn) => {
  return httpGet(
    {
      data: data,
      url: "/common/share/getNewShareInfo",
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取新分享配置
export const fetchTabTag = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/indexTab/listIndexTabTag",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//视频配置项
export const fetchUgcMomentRule = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/dictionary/getUgcMomentRule",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//ugc配置项

export const fetchPhoneBill = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/third/virtualProduct/listPhoneBill",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 话费充值列表

export const fetchRechargeMemberList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/third/virtualProduct/listNewAllLsxdProduct",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 会员充值列表
export const getRootAndParent = (data, fn) => {
  return httpGet(
    {
      url: "/common/dictionary/listDictionaryByRootAndParent",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//用户奖励

export const fetchRechargeMemberLsxdList = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/third/virtualProduct/listLsxdProduct",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 会员充值项目列表

export const fetchRechargeMemberLsxdDetail = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/third/virtualProduct/getLsxdVirtualProductOrderPrice",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 会员充值项目详情

export const fetchMemberOrderSumbit = (data, fn) => {
  return httpPost(
    {
      url: "/user/order/saveVirtualProductOrder",
      data: data,
    },
    (res) => {
      fn && fn(res);
    }
  );
};
// 会员充值确认下单

export const fetchPhoneBillDetail = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/third/virtualProduct/getPhoneBillVirtualProductOrderPrice",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 话费充值项目详情;

export const fetchVirtualProductCheckBuyLimit = (data) => {
  return httpGet({
    url: "/common/third/virtualProduct/checkBuyLimit",
    data: data,
  });
};
// 虚拟商品充值限制查询

export const fetchSpecialBarrage = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/dictionary/getPhoneBillBarrage",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 活动卡豆弹幕;

export const fetchCollection = (data = {}, fn) => {
  return httpGet(
    {
      url: "/common/config/collection/page/listConfigCollectionByAreaType",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
// 获取收集页配置卡豆规则;

export const fakeOperatingLog = (data = {}, fn) => {
  return httpPost(
    {
      url: "/common/operatingLog/saveOperatingSystemLog",
      data: data,
      falg: false,
    },
    (res) => fn && fn(res)
  );
};
// 获取收集页配置卡豆规则;
export const fetchAllGlobalConfig = (data) => {
  return httpGet({
    url: "/common/configGlobalPopUp/getAllGlobalConfig",
    data: data,
  });
}; //微信广告视频-领豆
export const fetchPreferential = (data) => {
  return httpGet({
    url: "/common/preferential/listPreferentialGlobalDefault",
    data: data,
  });
}; //支付抵扣比例默认配置：

export const fetchFestivalConfigs = (data) => {
  return httpGet({
    url: "/common/festival/getFestivalConfigs",
    data: data,
  });
}; //微信小程序主站顶部背景：

export const fetchResourceTemplate = (data) => {
  return httpGet({
    url: "/common/resourceTemplateContent/getResourceTemplateContentNewById",
    data: data,
  });
}; //逛逛根据模板 Id查找数据：
export const fetchSecondKillBarrage = (data) => {
  return httpGet({
    url: "/common/dictionary/listSecondKillBarrage",
    data: data,
  });
}; //卡豆超值弹幕
