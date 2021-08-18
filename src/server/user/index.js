import { httpGet, httpPost } from "@/api/newRequest";
/*
 * params token
 * */
import { objStatus } from "@/common/utils";

export const getMainPage = (data, fn) => {
  httpGet(
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
