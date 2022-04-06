import { httpGet, httpPost } from "@/utils/request";
import Taro from "@tarojs/taro";
import { loginStatus, objStatus } from "@/utils/utils";
/*
 * params token
 * */

export const getMainPage = (data, fn) => {
  return httpGet(
    {
      url: "/user/userInfo/mainPage",
      data: data,
    },
    (res) => {
      if (!objStatus(res)) {
        return fn(false);
      }
      return fn(res);
    }
  );
};
//我的页面数据

export const getBeanDetailByUserId = (data, fn) => {
  httpGet(
    {
      url: "/user/beanDetail/listBeanDetailByUserId",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//用户钱包明细列表
export const getBeanDetail = (data, fn) => {
  httpGet(
    {
      url: "/user/beanDetail/getBeanDetailByUserId",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//获取用户月收支总卡豆数
export const getTotalBean = (data, fn) => {
  httpGet(
    {
      url: "/user/incomeBean/getIncomeTotalBean",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//获取查询用户收益总卡豆数

export const getCashDetail = (data, fn) => {
  httpGet(
    {
      url: "/user/cashDetail/getCashDetailByUserId",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询用户收支总现金

export const getCashDetailList = (data, fn) => {
  httpGet(
    {
      url: "/user/cashDetail/listCashDetailByUserId",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询用户收支总现金明细

export const getListIncome = (data, fn) => {
  httpGet(
    {
      url: "/user/incomeBean/listIncomeBeanDetail",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询用户收益收支明细
export const getIncomeTotalBean = (data, fn) => {
  httpGet(
    {
      url: "/user/incomeBean/getIncomeTotalBean",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询用户收益收支明细

export const getUserBeanInfo = (data, fn) => {
  httpGet(
    {
      url: "/user/userInfo/getUserBeanInfo",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询用户收益收支明细

export const getUserMarkTrack = (data, fn) => {
  httpGet(
    {
      url: "/user/userMark/listUserMarkTrack",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
}; //打卡足迹

export const listOtherMomentByType = (data, fn) => {
  httpGet(
    {
      url: "/user/userMoment/listOtherMomentByType",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
}; //获取商家动态

export const listMomentByUserId = (data, fn) => {
  httpGet(
    {
      url: "/user/userMoment/listMomentByUserId",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
}; //获取他人动态

export const getShareInfo = (data, fn) => {
  httpGet(
    {
      url: "/user/userInfo/getShareUserInfo",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
}; //获取他人动态
export const getUserSub = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/order/subCommission/userSubCommissionInfo",
      data: data,
    },
    (res) => fn(res)
  );
};
//哒人/豆长主页团队相关
export const getLevel = (data = {}, fn) => {
  httpGet(
    {
      url: "/user/user/level/nextLevelTarget",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取达人等级相关

export const saveUpdateLoginUserInfo = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/userInfo/updateLoginUserInfo",
      data: data,
    },
    (res) => fn(res)
  );
};
//获取达人等级相关

export const saveLevelTarget = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/user/level/manualUpgrade",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//升级哒人等级
export const fetchActiveStatus = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/activity/getActivityStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取达人等级相关

export const fetchGroupSubMerchant = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/listGroupSubMerchant",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取达人等级相关

export const fetchRealNameInfo = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/realName/getRealNameInfo",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//获取用户实名认证状态

export const fakeSubmitRealName = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/realName/submitRealName",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//提交用户提名

export const fakeSubmitUserLocation = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/userLocation/saveUserLocation",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户每次打开小程序获取定位后提交定位信息

export const fetchPromotionStatus = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/userMerchant/getOwnerExistPromotionStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户每次打开小程序获取定位后提交定位信息

export const fakRewarde = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/moment/watch/antiReward",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户每次打开小程序获取定位后提交定位信息
export const fakeMomentReward = (data = {}, fn) => {
  return httpPost(
    {
      url: "/user/moment/watch/ugcWatchMomentReward",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户获取ugc卡豆
export const fakeWechatPayInfo = (data, fn) => {
  return httpPost(
    {
      url: "/user/pay/wechat/getWechatPayInfo",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取微信支付需要的参数接口

//微信支付
export const handlePayWechat = (data = {}, callback) => {
  const { xcxOpenId } = loginStatus();
  return fakeWechatPayInfo({ ...data, openId: xcxOpenId }).then((val) => {
    const { payParams } = val;
    Taro.requestPayment({
      ...payParams,
      success: (res) => {
        callback && callback({ result_status: "succeeded" });
      },
      fail: () => {
        callback && callback({ result_status: "fail" });
      },
    });
  });
};

export const fetchListTogether = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/together/group/listTogetherGroupConfig",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//查询拼团配置

export const fetchStartGroupByStatus = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/start/group/listUserStartGroupByStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户开团列表

export const fetchJoinGroupByStatus = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/join/group/listUserJoinGroupByStatus",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户参团列表

export const fetchStartGroupRebate = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/start/group/userStartGroupRebateStatistic",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户开团列表

export const fetchJoinGroupRebate = (data = {}, fn) => {
  return httpGet(
    {
      url: "/user/join/group/userJoinGroupRebateStatistic",
      data: data,
    },
    (res) => fn && fn(res)
  );
};
//用户参团列表

export const fakeStartGroup = (data, fn) => {
  return httpPost(
    {
      url: "/user/start/group/startGroup",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//开团

export const fetchGroupDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/start/group/groupDetail",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//开团详情

export const fetchMarketingCash = (data, fn) => {
  return httpGet(
    {
      url: "/user/userBean/getUserMarketingCash",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//现金 拼团钱包
