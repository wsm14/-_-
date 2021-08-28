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
  const { index, navHeight } = props;

  // 请求参数
  const [pages, setPages] = useState({
    tabKey: "", // "" 所有店铺 1 公海 0 私海
    page: 1,
    limit: 10,
  });
  const [dataList, setDataList] = useState([]); // 列表数据

  useEffect(() => {
    fetchGetList();
  }, [pages]);

  // 上拉加载
  useReachBottom(() => {
    if (index == 0) {
      setPages({ ...pages, page: pages.page + 1 });
    }
  });

  // 获取数据
  const fetchGetList = () => {
    fetchGroupList(pages).then((res) => {
      const { communityOrganizationList: list = [] } = res;
      setDataList((old) => [...old, ...list]);
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
        <UserInfo></UserInfo>
        <DataCenter></DataCenter>
        <Tools></Tools>
      </View>
      <OrderList
        list={dataList}
        navHeight={navHeight}
        getNewData={getNewData}
      ></OrderList>
    </View>
  );
};
