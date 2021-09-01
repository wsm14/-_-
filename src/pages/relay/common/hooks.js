import Taro, { useDidShow } from "@tarojs/taro";
import Router from "@/common/router";
import {
  fetchGroupClose,
  fetchGroupOpen,
  fetchGroupDelete,
  fetchGroupDoTop,
  fetchTest,
} from "@/server/relay";

/**
 * 数据回传监听
 * @param onEvnetChange 事件回调
 */
export function usePostBackData(onEvnetChange) {
  useDidShow(() => {
    const pages = Taro.getCurrentPages(); // 获取页面堆栈
    const currPage = pages[pages.length - 1]; // 获取上一页栈
    const { data } = currPage.data; // 获取上一页回传数据
    if (data) {
      onEvnetChange(data);
    }
  });
}

/**
 * 数据回传
 */
export function navigatePostBack(data, back = true) {
  const pages = Taro.getCurrentPages(); // 获取当前页面栈
  if (pages.length > 1) {
    const beforePage = pages[pages.length - 2]; // 获取上一个页面实例对象
    beforePage.setData({ data: data }); // 返回参数
  }
  back && Taro.navigateBack({ delta: 1 }); //返回上一个页面
}

// 跳转团详情管理 { communityOrganizationId, ownerId }
export const handleGoGroupDetail = (params) => {
  Router({
    routerName: "communityGoods",
    args: {
      mode: "manage",
      ...params,
    },
  });
};

// 跳转修改团 { communityOrganizationId, ownerId }
export const handleGoGroupEdit = (params) => {
  Router({
    routerName: "groupCreate",
    args: {
      mode: "edit",
      ...params,
    },
  });
};

const showModal = ({ content, callback }) => {
  Taro.showModal({
    confirmText: "确定",
    confirmColor: "#07c0c2",
    content,
    success: function (res) {
      if (res.confirm) {
        callback();
      }
    },
  });
};

// 置顶/取消 团  { communityOrganizationId, ownerId }
export const handleGroupDoTop = (params, callback) => {
  const { topFlag = 0, ...other } = params;
  showModal({
    content: `确认${["置顶", "取消置顶"][topFlag]}团购？`,
    callback: fetchGroupDoTop(other, callback),
  });
};

// 删除团  { communityOrganizationId, ownerId }
export const handleGroupDelete = (params, callback) => {
  showModal({
    content: "确认删除团购？",
    callback: fetchGroupDelete(params, callback),
  });
};

// 结束团  { communityOrganizationId, ownerId }
export const handleGroupEnd = (params, callback) => {
  showModal({
    content: "确认结束该团购活动吗？",
    callback: fetchGroupClose(params, callback),
  });
};

// 开始团  { communityOrganizationId, ownerId }
export const handleGroupStart = (params, callback) => {
  showModal({
    content: "确认开始该团购活动吗？",
    callback: fetchGroupOpen(params, callback),
  });
};

/**
 * 订单操作方法
 */
export function handleOrdertools(data = {}, callback) {
  const { communityStatus = "", communityOrganizationId, ownerId } = data;

  const item = {
    "": ["修改团信息"],
    notStarted: ["修改团信息", "展示团", "删除团"], // 未开始
    start: ["修改团信息", "结束团", "删除团"], // 开始
    end: ["修改团信息", "展示团", "删除团"], // 已结束
  }[communityStatus];

  Taro.showActionSheet({
    itemList: item,
    success(res) {
      const { tapIndex } = res;
      const params = { communityOrganizationId, ownerId };
      switch (tapIndex) {
        case 0:
          handleGoGroupEdit(params);
          break;
        case 1:
          if (communityStatus === "start") {
            handleGroupEnd(params, callback); // 结束团
          } else handleGroupStart(params, callback); // 展示团
          break;
        default:
          handleGroupDelete(params, callback); // 删除
          break;
      }
    },
  });
}
//微信支付
export function handlePayWechat(data = {}, callback) {
  fetchTest({ ...data }).then((val) => {
    callback && callback();
  });
}
