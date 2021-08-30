import React, { useState, useEffect } from "react";
import Taro, { useReachBottom, usePullDownRefresh } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { fetchCommunityOrder } from "@/server/relay";
import TabPane from "@/relay/components/TabPane";
import OrderFooterTools from "./components/OrderFooterTools";
import "./index.scss";

/**
 * 团长订单管理
 */
export default ({}) => {
  // 请求参数
  const [pages, setPages] = useState({
    tabKey: "",
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
    fetchCommunityOrder(pages).then((res) => {
      const { orderList } = res;
      setDataList((old) => [...old, ...orderList]);
    });
    Taro.stopPullDownRefresh(); // 停止刷新
  };

  const tab_select_arr = [
    { label: "全部", value: "" },
    { label: "发货", value: 1 },
    { label: "核销", value: 3 },
  ];

  return (
    <View className="group_order_manage">
      {/* tab 选择 */}
      <TabPane
        list={tab_select_arr}
        className="group_order_tab"
        onClick={(key) => console.log({ communityStatus: key })}
      ></TabPane>
      <View className="order_manage_group">
        <View className="order_manage_cell">
          <View className="order_manage_head">
            <View className="order_manage_number">
              跟团号：<Text>1</Text>
            </View>
            <Text className="order_manage_status">已取消</Text>
          </View>
          <View className="order_manage_info">
            <View className="order_info_head">
              <View className="order_info_shop">
                <View
                  className="order_info_img"
                  style={{
                    backgroundImage: `url(https://wechat-config.dakale.net/miniprogram/relay/icon_13.png)`,
                  }}
                ></View>
                <View className="order_info_shopName">
                  二狗烘焙（国泰科技)二狗烘焙（国泰科技)二狗烘焙（国泰科技)二狗烘焙（国泰科技)二狗烘焙（国泰科技)二狗烘焙（国泰科技)二狗烘焙（国泰科技)
                </View>
              </View>
              <View className="order_info_title">
                <View className="order_title">
                  商品标题标题标题标题标题标题商品标题标题标题标题标题标题
                </View>
                <View className="order_title_footer">查看</View>
              </View>
            </View>
            <View className="order_info_goods">
              <View className="order_goods_cell">
                <View className="order_goods_name">
                  商品名称商品名称商品名称商品
                </View>
                <View className="order_goods_number">x1</View>
                <View className="order_goods_price">¥ 69</View>
              </View>
            </View>
            <View className="order_info_pay">
              <View className="order_pay_time">2021/8/29 11:08</View>
              <View className="order_pay_footer">
                <Text className="order_pay_total">共1件</Text>
                <View className="order_pay_price">
                  实收<Text className="order_price_num">66.12</Text>
                </View>
              </View>
            </View>
            <View className="order_info_user">
              <View className="order_user_head">顾客自提订单</View>
              <View className="order_user_content">
                <View className="order_user_cell">
                  <View className="order_user_title">
                    <View className="order_ui_user"></View>
                    <View className="order_user_name">用户昵称昵称昵…</View>
                    <View className="order_user_phone">18679068769</View>
                  </View>
                  <View className="order_user_info">
                    <View className="order_user_cont">
                      浙江省杭州市萧山区宁卫街道萧山区宁卫街道区宁卫街道
                    </View>
                  </View>
                </View>
                <View className="order_user_cell">
                  <View className="order_user_title">
                    <View className="order_ui_shop"></View>
                    <View className="order_address_name">
                      国泰科技大厦国泰科技大厦国泰科技大厦国泰科技大厦国泰科技大厦
                    </View>
                  </View>
                  <View className="order_user_info">
                    <View className="order_user_cont">
                      浙江省杭州市萧山区宁卫街道萧山区宁卫街道区宁卫街道
                    </View>
                    <View className="order_user_pop">
                      联系人：刘 187****6767
                    </View>
                  </View>
                </View>
                <View className="order_user_cell">
                  <View className="order_user_title">
                    <View className="order_ui_order"></View>
                    <View className="order_user_remark">
                      团长备注:<Text>空间规划法规</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
            {/* 底部工具栏 */}
            <OrderFooterTools></OrderFooterTools>
          </View>
        </View>
      </View>
    </View>
  );
};
