import Taro, { useDidShow } from "@tarojs/taro";

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
export function navigatePostBack(data) {
  const pages = Taro.getCurrentPages(); // 获取当前页面栈
  if (pages.length > 1) {
    const beforePage = pages[pages.length - 2]; // 获取上一个页面实例对象
    beforePage.setData({ data: data }); // 返回参数
  }
  Taro.navigateBack({ delta: 1 }); //返回上一个页面
}
