import React, { useState } from "react";
import { useRouter, useDidShow } from "@tarojs/taro";
import Router from "@/common/router";
import { navigatePostBack } from "@/relay/common/hooks";
import { View, Button, Text } from "@tarojs/components";
import { fetchLiftingCabinetList } from "@/server/relay";
import ImageShow from "@/relay/components/ImageShow";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 商品库
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;
  /**
   * mode select 选择模式 list 展示管理列表
   */
  const { mode = "list", liftingCabinets } = routeParams;

  const [list, setList] = useState([]);
  const [selectId, setSelectId] = useState([]);

  useDidShow(() => {
    fetchGetList();
    setSelectId(liftingCabinets ? liftingCabinets.split(",") : []);
  });

  // 保存事件
  const handleSaveData = () => {
    navigatePostBack({ liftingCabinets: selectId });
  };

  // 获取选择列表
  const fetchGetList = () => {
    fetchLiftingCabinetList().then((res) => {
      const { communityLiftingCabinetList: lists } = res;
      setList(lists);
    });
  };

  return <View className="GoodsManageList_content"></View>;
};
