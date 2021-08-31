import React, { useState, useEffect } from "react";
import { useRouter, useDidShow, useReachBottom } from "@tarojs/taro";
import Router from "@/common/router";
import { navigatePostBack } from "@/relay/common/hooks";
import { View, Button, Text } from "@tarojs/components";
import { fetchLiftingCabinetList } from "@/server/relay";
import Head from "./components/Head";
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

  // 请求参数
  const [pages, setPages] = useState({
    page: 1,
    limit: 10,
  });
  const [list, setList] = useState([]); // 列表数据
  const [selectId, setSelectId] = useState([]);

  useDidShow(() => {
    fetchGetList();
    setSelectId(liftingCabinets ? liftingCabinets.split(",") : []);
  });

  useEffect(() => {
    fetchGetList();
  }, [pages]);

  // 上拉加载
  useReachBottom(() => {
    setPages({ ...pages, page: pages.page + 1 });
  });

  // 获取选择列表
  const fetchGetList = () => {
    fetchLiftingCabinetList().then((res) => {
      const { communityLiftingCabinetList: lists } = res;
      setList(lists);
    });
  };

  // 保存事件
  const handleSaveData = () => {
    navigatePostBack({ liftingCabinets: selectId });
  };

  return (
    <View className="GoodsManageList_content">
      <Head></Head>
      <View className="gm_group">
        <View className="gm_goods_cell">
          <View className="gm_goods_img"></View>
          <View className="gm_goods_info">
            <View className="gm_goods_head">
              <View className="gm_goods_name">
                商品名称商品商品名称商品名称名名称名商品名称商品名称名名称名商品名称商品名称名名称名
              </View>
              <View className="gm_goods_select select"></View>
            </View>
            <View className="gm_goods_num">库存 不限</View>
            <View className="gm_goods_footer">
              <View className="gm_goods_price">100</View>
              <View className="gm_goods_btn">
                <View className={`gm_goods_tools`} onClick={() => {}}>
                  编辑
                </View>
                <View className={`gm_goods_tools`} onClick={() => {}}>
                  删除
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="gm_goods_cell">
          <View className="gm_goods_img"></View>
          <View className="gm_goods_info">
            <View className="gm_goods_head">
              <View className="gm_goods_name">
                商品名称商品商品名称商品名称名名称名商品名称商品名称名名称名商品名称商品名称名名称名
              </View>
              <View className="gm_goods_select select"></View>
            </View>
            <View className="gm_goods_num">库存 不限</View>
            <View className="gm_goods_footer">
              <View className="gm_goods_price">100</View>
              <View className="gm_goods_btn">
                <View className={`gm_goods_tools`} onClick={() => {}}>
                  编辑
                </View>
                <View className={`gm_goods_tools`} onClick={() => {}}>
                  删除
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
      <View className="gm_goods_null">暂无商品，快去添加商品吧</View>
    </View>
  );
};
