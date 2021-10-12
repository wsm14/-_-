import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * 订单信息
 */
export default ({ data = {} }) => {
  const dataArr = [
    {
      name: "中奖编号",
      key: "rewardCode",
      onCopy: true,
    },
    {
      name: "获奖时间",
      key: "createTime",
    },
    {
      name: "发货时间",
      key: "deliveryTime",
    },
    {
      name: "物流公司",
      key: "ogisticsCompany",
    },
    {
      name: "物流单号",
      key: "logisticsCode",
      onCopy: true,
    },
  ];

  // 复制数据
  const handleCopyData = (data) => {
    Taro.setClipboardData({
      data: data,
      success: function () {
        Taro.getClipboardData({
          success: function (res) {
            console.log(res.data); // data
          },
        });
      },
    });
  };

  return (
    <View className="prize_OrderInfo">
      <View className="prize_title">订单信息</View>
      <View className="prize_order_group">
        {dataArr.map(
          (item) =>
            data[item.key] && (
              <View className="prize_order_cell">
                <View className="prize_orderCell_name">{item.name}</View>
                <View className="prize_orderCellData_box">
                  <View className="prize_orderCell_data">{data[item.key]}</View>
                  {item.onCopy && (
                    <View
                      className="prize_orderCell_copy"
                      onClick={() => handleCopyData(data[item.key])}
                    >
                      复制
                    </View>
                  )}
                </View>
              </View>
            )
        )}
      </View>
    </View>
  );
};
