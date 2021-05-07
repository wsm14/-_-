import { httpGet, httpPost, httpOtherGet } from "@/api/newRequest";
import Taro from "@tarojs/taro";
/*
 * params
 *
 * 用户奖励卡豆支出：root：userTrade，parent：expenses
 * 用户奖励卡豆收入：root：userTrade，parent：earn
 * 用户收益卡豆支出：root：userIncomeTrade，parent：expenses
 * 用户收益卡豆收入：root：userIncomeTrade，parent：earn
 * 现金 root：userCashTrade
 * */
import { objStatus } from "@/common/utils";
export const getRootAndParent = (data, fn) => {
  httpGet(
    {
      url: "/common/dictionary/listDictionaryByRootAndParent",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//我的页面数据
export const getAddress = (data, fn) => {
  httpOtherGet(
    {
      data: data,
      url: "https://apis.map.qq.com/ws/geocoder/v1/",
    },
    (res) => {
      return fn(res);
    }
  );
};
//获取城市定位信息

export const getRestapiAddress = (data, fn) => {
  httpOtherGet(
    {
      data: data,
      url: "https://restapi.amap.com/v3/geocode/regeo/",
    },
    (res) => {
      return fn(res);
    }
  );
};
//获取高德城市定位信息


location=109.739735,28.314296

export const getCategory = (data, fn) => {
  httpGet(
    {
      url: "/common/category/listCategory",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取品类

export const getLimit = (data, fn) => {
  httpGet(
    {
      data: data,
      url: "/common/property/getLastProperty",
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//获取距离

export const getBanner = (data, fn) => {
  httpGet(
    {
      data: data,
      url: "/common/banner/listBanner",
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//获取轮播图

/*
*
*

parent：activity
child：hideStatus*/
export const getDictionary = (data, fn) => {
  httpGet(
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
export const getListTopic = (data, fn) => {
  httpGet(
    {
      data: data,
      url: "/common/topic/listTopicBySearchContent",
    },
    (res) => {
      fn && fn(res);
    }
  );
};
/*
 * page: 页数
 * limit: 行数，
 * keyword 话题名称
 * */
//通过名字搜索话题

export const getTopicDetail = (data, fn) => {
  httpGet(
    {
      data: data,
      url: "/common/topic/getTopicDetail",
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//話題詳情

export const checkLocation = (data, fn) => {
  httpGet(
    {
      data: data,
      url: "/common/locationCity/checkLocationCityStatus",
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//查询城市开通状态

export const listAllLocationCity = (data, fn) => {
  httpGet(
    {
      data: data,
      url: "/common/locationCity/listAllLocationCity",
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//查询所有的开通城市

export const getLocationCity = (data, fn) => {
  httpGet(
    {
      data: data,
      url: "/common/locationCity/getLocationCity",
    },
    (res) => {
      fn && fn(res);
    }
  );
};
//城市码查询开通城市

export const getMomentBarrage = (data = {}, fn) => {
  httpGet(
    {
      url: "/common/dictionary/listMomentBarrage",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取连刷视频弹幕动态

export const listParentCategory = (data = {}, fn) => {
  httpGet(
    {
      url: "/common/category/listParentCategory",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取品类

export const getShareParamInfo = (data = {}, fn) => {
  httpGet(
    {
      url: "/common/shareParam/getShareParam",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取解密分享码

export const getConfigWindVaneBySize = (data = {}, fn) => {
  httpGet(
    {
      url: "/common/category/scenes/listConfigWindVaneBySize",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取风向标

export const getSpecialGoodsCategory = (data = {}, fn) => {
  httpGet(
    {
      url: "/common/category/listSpecialGoodsCategory",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取解密分享码

export const getShareInfo = (data = {}, fn) => {
  httpGet(
    {
      url: "/common/share/getShareInfo",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取解密分享码

export const getBusinessHub = (data = {}, fn) => {
  httpGet(
    {
      url: "/common/businessHub/lisBusinessHubByCityCode",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取解密分享码

