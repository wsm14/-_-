import React, { useState, useEffect } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { View } from "@tarojs/components";
import UserInfo from "./components/UserInfo";
import DataCenter from "./components/DataCenter";
import Tools from "./components/Tools";
import OrderList from "./components/OrderList";
import { fetchGroupList } from "@/server/relay";
import "./index.scss";

export default (props) => {
  const { index, navHeight, tabbarChange } = props;

  // 请求参数
  const [pages, setPages] = useState({
    tabKey: "", // "" 所有店铺 1 公海 0 私海
    page: 1,
    limit: 10,
  });
  const [showList, setShowList] = useState(false); // 是否展示底部列表
  const [dataList, setDataList] = useState([]); // 列表数据

  useEffect(() => {
    fetchGetList();
  }, [pages]);

  // 上拉加载
  useReachBottom(() => {
    if (index == 3) {
      setPages({ ...pages, page: pages.page + 1 });
    }
  });

  // 获取数据
  const fetchGetList = () => {
    fetchGroupList(pages).then((res) => {
      const { communityOrganizationList: list = [] } = res;
      setDataList((old) => [...old, ...list]);
      !showList && setShowList(!!list.length);
    });
    Taro.stopPullDownRefresh(); // 停止刷新
  };

  // 获取新数据
  const getNewData = (newObj = {}) => {
    setPages(() => {
      setDataList([]);
      return {
        ...pages,
        ...newObj,
        page: 1,
      };
    });
  };

  return (
    <View style={{ display: index == 3 ? "block" : "none" }}>
      <View className="tabBar_personal">
        {/* 用户信息 */}
        <UserInfo></UserInfo>
        {/* 数据中心 */}
        <DataCenter></DataCenter>
        {/* 用户工具栏 */}
        <Tools tabbarChange={tabbarChange}></Tools>
      </View>
      {/* 订单列表 */}
      {showList && (
        <OrderList
          list={dataList}
          navHeight={navHeight}
          getNewData={getNewData}
        ></OrderList>
      )}
    </View>
  );
};
