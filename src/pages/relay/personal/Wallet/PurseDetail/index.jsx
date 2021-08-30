import React, { useState, useEffect } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { fetchPurseDetail } from "@/server/relay";
import "./index.scss";

/**
 * 账单明细
 */
export default () => {
  // 请求参数
  const [pages, setPages] = useState({
    page: 1,
    limit: 10,
  });
  const [dataList, setDataList] = useState([]); // 列表数据

  useEffect(() => {
    fetchGetList();
  }, [pages]);

  // 下拉加载
  useReachBottom(() => {
    setPages({ ...pages, page: pages.page + 1 });
  });

  // 获取列表参数
  const fetchGetList = () => {
    fetchPurseDetail(pages).then((res) => {
      const { beanDetailList = [] } = res;
      setDataList((old) => [...old, ...beanDetailList]);
    });
    Taro.stopPullDownRefresh(); // 停止刷新
  };

  return (
    <View className="PurseDetail_content">
      <View className="purseDetail_group">
        {dataList.map((i) => (
          <View className="purseDetail_cell">
            <View className="purseDetail_cell_img"></View>
            <View className="purseDetail_cell_info">
              <View className="purseDetail_cell_head">
                <View className="purseDetail_cell_title">{i.detailTitle}</View>
                <View className="purseDetail_cell_price">+{i.cash}</View>
              </View>
              <View className="purseDetail_cell_time">{i.beanTime}</View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
