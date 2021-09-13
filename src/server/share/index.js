import { httpGet, httpPost } from "@/api/newRequest";

export const getShareNewYearSpecialActivity = (data, fn) => {
  httpGet(
    {
      url: "/user/specialGoods/getShareNewYearSpecialActivity",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询用户分享的新年特价狂欢活动

export const getWechatKefuAccount = (data, fn) => {
  httpGet(
    {
      url: "/user/wechat/getWechatKefuAccount",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//查询公众号

export const getWechatActivityData = (data, fn) => {
  return httpGet(
    {
      url: "/user/wechat/getWechatActivityData",
      data: data,
    },
    (res) => {
      return fn(res);
    }
  );
};
//动态活动页面模板接口

export const getUserMomentcheckNew = (data, fn) => {
  /*
    params  newDeviceFlag {{string}} 1 未观看   0已观看
  */
  return httpGet(
    {
      url: "/user/userMoment/checkNewGuildMomentUser",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//检查是否能看新手视频

export const getGuildMomentDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/userMoment/getGuildMomentDetail",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取新手视频详情

export const fetchInActivityChildUser = (data, fn) => {
  return httpGet(
    {
      url: "/user/activity/listInActivityChildUser",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取活动期间的家人列表

export const fetchInActivityAchievement = (data, fn) => {
  return httpGet(
    {
      url: "/user/activity/listInActivityAchievement",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取活动期间家人带货数量

export const fetchListActivityGoods = (data, fn) => {
  return httpGet(
    {
      url: "/user/activity/listActivityGoods",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//获取活动期间家人带货数量

export const saveNewUserBean = (data, fn) => {
  return httpPost(
    {
      url: "/user/activity/saveNewUserBean",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//领取卡豆

export const getRedEnvelopesDetail = (data, fn) => {
  return httpGet(
    {
      url: "/user/userRedEnvelopes/getRedEnvelopesDetail",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//领取卡豆

export const saveUserRedEnvelopes = (data, fn) => {
  return httpGet(
    {
      url: "/user/userRedEnvelopes/acquire",
      data: data,
    },
    (res) => {
      return fn && fn(res);
    }
  );
};
//领取卡豆
