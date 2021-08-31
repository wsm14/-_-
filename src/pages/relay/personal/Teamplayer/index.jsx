import React, { useState, useEffect } from "react";
import Taro, { useReachBottom, usePullDownRefresh } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { fetchTeamPlayer } from "@/server/relay";
import "./index.scss";

/**
 * 我的团员
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

  // 下拉刷新
  usePullDownRefresh(() => {
    getNewData(pages);
  });

  // 下拉加载
  useReachBottom(() => {
    setPages({ ...pages, page: pages.page + 1 });
  });

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

  // 获取列表参数
  const fetchGetList = () => {
    fetchTeamPlayer(pages).then((res) => {
      const { teamList } = res;
      setDataList((old) => [...old, ...teamList]);
    });
    Taro.stopPullDownRefresh(); // 停止刷新
  };

  return (
    <View className="Teamplayer_content">
      <View className="teamPlayer_group">
        {dataList.map((item) => (
          <View className="teamPlayer_cell">
            <View
              className="teamPlayer_head"
              style={{
                backgroundImage: `url(${item.profile})`,
              }}
            ></View>
            <View
              className={`teamPlayer_name ${item.subsribe == 1 ? "take" : ""}`}
            >
              {item.username}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
