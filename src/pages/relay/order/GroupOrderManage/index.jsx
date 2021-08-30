import React, { useState, useEffect } from "react";
import Taro, {
  useRouter,
  useReachBottom,
  usePullDownRefresh,
} from "@tarojs/taro";
import Router from "@/common/router";
import { GROUP_ORDER_STATUS, GOODS_BY_TYPE } from "@/relay/common/constant";
import { View, Text } from "@tarojs/components";
import { fetchCommunityOrder } from "@/server/relay";
import TabPane from "@/relay/components/TabPane";
import OrderFooterTools from "./components/OrderFooterTools";
import "./index.scss";

/**
 * 团长订单管理
 */
export default ({}) => {
  // 路由获取参数
  const routeParams = useRouter().params;
  /**
   * communityOrganizationId 团购id
   */
  const { communityOrganizationId = "" } = routeParams;

  // 请求参数
  const [pages, setPages] = useState({
    status: "", // 状态 1-已支付 3-已完成
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
    fetchCommunityOrder({ ...pages, communityOrganizationId }).then((res) => {
      const { orderList } = res;
      setDataList((old) => [...old, ...orderList]);
    });
    Taro.stopPullDownRefresh(); // 停止刷新
  };

  // 拨打电话
  const handlePhone = (phoneNumber) => {
    Taro.makePhoneCall({ phoneNumber });
  };

  const tab_select_arr = [
    { label: "全部", value: "" },
    { label: "发货", value: 1 },
    { label: "核销", value: 3 },
  ];

  // 跳转页面
  const goPage = (routerName, args = {}) => {
    Router({
      routerName,
      args,
    });
  };

  return (
    <View className="group_order_manage">
      {/* tab 选择 */}
      <TabPane
        list={tab_select_arr}
        className="group_order_tab"
        onClick={(key) => getNewData({ status: key })}
      ></TabPane>
      <View className="order_manage_group">
        {dataList.map((item) => {
          const {
            organizationGoodsOrderDescObject: orginObj,
            payTime,
            status,
            totalFee,
          } = item;
          const { communityOrganizationId, ownerId } = orginObj;
          const params = { communityOrganizationId, ownerId };
          return (
            <View className="order_manage_cell">
              <View className="order_manage_head">
                <View className="order_manage_number">
                  跟团号：<Text>{orginObj.organizationNumber}</Text>
                </View>
                <Text
                  className={`order_manage_status ${status == 1 ? "pay" : ""}`}
                >
                  {GROUP_ORDER_STATUS[status]}
                </Text>
              </View>
              <View className="order_manage_info">
                <View className="order_info_head">
                  <View className="order_info_shop">
                    <View
                      className="order_info_img"
                      style={{
                        backgroundImage: `url(${orginObj.relateOwnerProfile})`,
                      }}
                    ></View>
                    <View className="order_info_shopName">
                      {orginObj.relateOwnerName}
                    </View>
                  </View>
                  <View className="order_info_title">
                    <View className="order_title">{orginObj.title}</View>
                    <View
                      className="order_title_footer"
                      onClick={() => goPage("communityGoods", params)}
                    >
                      查看
                    </View>
                  </View>
                </View>
                <View className="order_info_goods">
                  <View className="order_goods_cell">
                    <View className="order_goods_name">
                      {orginObj.goodsName}
                    </View>
                    <View className="order_goods_number">
                      x{orginObj.goodsCount}
                    </View>
                    <View className="order_goods_price">
                      ¥ {orginObj.goodsPrice}
                    </View>
                  </View>
                </View>
                <View className="order_info_pay">
                  <View className="order_pay_time">{payTime}</View>
                  <View className="order_pay_footer">
                    <Text className="order_pay_total">
                      共{orginObj.goodsCount}件
                    </Text>
                    <View className="order_pay_price">
                      实收<Text className="order_price_num">{totalFee}</Text>
                    </View>
                  </View>
                </View>
                <View className="order_info_user">
                  <View className="order_user_head">
                    {GOODS_BY_TYPE[orginObj.logisticsType]}订单
                  </View>
                  <View className="order_user_content">
                    <View className="order_user_cell">
                      <View className="order_user_title">
                        <View className="order_ui_user"></View>
                        <View className="order_user_name">
                          {orginObj.writeContactPerson}
                        </View>
                        <View
                          className="order_user_phone"
                          onClick={() => handlePhone(orginObj.writeMobile)}
                        >
                          {orginObj.writeMobile}
                        </View>
                      </View>
                      <View className="order_user_info">
                        <View className="order_user_cont">
                          {orginObj.writeAddress}
                        </View>
                      </View>
                    </View>
                    {orginObj.logisticsType === "self" && (
                      <View className="order_user_cell">
                        <View className="order_user_title">
                          <View className="order_ui_shop"></View>
                          <View className="order_address_name">
                            {orginObj.liftingName}
                          </View>
                        </View>
                        <View className="order_user_info">
                          <View className="order_user_cont">
                            {orginObj.liftingAddress}
                          </View>
                          <View
                            className="order_user_pop"
                            onClick={() => handlePhone(orginObj.liftingMobile)}
                          >
                            联系人： {orginObj.liftingContentPerson}{" "}
                            {orginObj.liftingMobile}
                          </View>
                        </View>
                      </View>
                    )}
                    {orginObj.remark && (
                      <View className="order_user_cell">
                        <View className="order_user_title">
                          <View className="order_ui_order"></View>
                          <View className="order_user_remark">
                            团员备注:<Text>{orginObj.remark}</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
                {/* 底部工具栏 */}
                <OrderFooterTools data={item}></OrderFooterTools>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
