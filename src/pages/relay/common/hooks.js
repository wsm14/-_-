import Taro, { useDidShow } from "@tarojs/taro";
import Router from "@/common/router";
import {
  fetchGroupClose,
  fetchGroupOpen,
  fetchGroupDelete,
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

// 跳转修改团
const goGroupEdit = (params) => {
  Router({
    routerName: "groupCreate",
    args: {
      mode: "edit",
      ...params,
    },
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
          goGroupEdit(params);
          break;
        case 1:
          if (communityStatus === "start") {
            fetchGroupClose(params, callback); // 结束团
          } else fetchGroupOpen(params, callback); // 展示团
          break;
        default:
          fetchGroupDelete(params, callback); // 删除
          break;
      }
    },
  });
}
