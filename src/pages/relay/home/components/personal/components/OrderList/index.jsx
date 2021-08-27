import React, { useState } from "react";
import { View, Text, Button } from "@tarojs/components";
import { handleOrdertools } from "@/relay/common/hooks";
import ImageShow from "@/relay/components/ImageShow";
import TabPane from "@/relay/components/TabPane";
import "./index.scss";

export default ({ list }) => {
  const toolsArr = [
    {
      name: "置顶",
      disabled: true,
      onClick: () => {},
    },
    {
      name: "修改",
      onClick: () => {},
    },
    {
      name: "删除",
      onClick: () => {
        Taro.showModal({
          confirmText: "确定",
          confirmColor: "#07c0c2",
          content: "确认删除该模块内容？",
          success: function (res) {
            if (res.confirm) {
              // setDataArr(update(dataArr, { $splice: [[index, 1]] }));
            }
          },
        });
      },
    },
  ];

  const MEMBERSHIP_STATUS = [
    { label: "所有店铺", value: "" },
    { label: "公海", value: 1 },
    { label: "私海", value: 0 },
  ];

  return (
    <View className="pu_order">
      <View className="pu_order_tab">
        <TabPane
          list={MEMBERSHIP_STATUS}
          className="tabBarMargin"
          onClick={(key) => {}}
        ></TabPane>
      </View>
      <View className="pu_order_group">
        <View className="pu_order_cell">
          <View className="pu_order_heard">
            <View className="pu_heard_date">8月19日</View>
            <View className="pu_heard_footer">
              {toolsArr.map((i) => (
                <View
                  className={`pu_heard_tools ${
                    i.disabled ? "pu_tools_disabled" : ""
                  }`}
                  onClick={!i.disabled ? i.onClick : () => {}}
                >
                  {i.name}
                </View>
              ))}
            </View>
          </View>
          <View className="pu_order_info">
            <View className="pu_order_content">
              <View className="pu_order_name">
                <View className="puon_name">优质生鲜搬运工</View>
                <View className="puon_price">892</View>
              </View>
              <View className="pu_order_img">
                <ImageShow width={194} src={""}></ImageShow>
              </View>
              <View className="pu_content_footer">
                <View className="pu_order_status end">未发布</View>
                <View className="pu_order_share"></View>
              </View>
            </View>
            <View className="pu_order_footer">
              <View className="pu_order_income">
                <View>
                  <Text>实际收入 ¥19.88</Text>
                  <Text>退款金额 ¥0</Text>
                </View>
                <View>
                  <Text>已跟团1人次</Text>
                  <Text>取消跟团0人次</Text>
                  <Text>查看0人</Text>
                </View>
              </View>
              <Button className="pu_order_tools" onClick={handleOrdertools}>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
              </Button>
            </View>
          </View>
        </View>
        <View className="pu_order_cell">
          <View className="pu_order_heard">
            <View className="pu_heard_date">8月19日</View>
            <View className="pu_heard_footer">
              {toolsArr.map((i) => (
                <View
                  className={`pu_heard_tools ${
                    i.disabled ? "pu_tools_disabled" : ""
                  }`}
                  onClick={!i.disabled ? i.onClick : () => {}}
                >
                  {i.name}
                </View>
              ))}
            </View>
          </View>
          <View className="pu_order_info">
            <View className="pu_order_content">
              <View className="pu_order_name">
                <View className="puon_name">优质生鲜搬运工</View>
                <View className="puon_price">892</View>
              </View>
              <View className="pu_order_img">
                <ImageShow width={194} src={""}></ImageShow>
              </View>
              <View className="pu_content_footer">
                <View className="pu_order_status end">未发布</View>
                <View className="pu_order_share"></View>
              </View>
            </View>
            <View className="pu_order_footer">
              <View className="pu_order_income">
                <View>
                  <Text>实际收入 ¥19.88</Text>
                  <Text>退款金额 ¥0</Text>
                </View>
                <View>
                  <Text>已跟团1人次</Text>
                  <Text>取消跟团0人次</Text>
                  <Text>查看0人</Text>
                </View>
              </View>
              <Button className="pu_order_tools" onClick={handleOrdertools}>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
              </Button>
            </View>
          </View>
        </View>
        <View className="pu_order_cell">
          <View className="pu_order_heard">
            <View className="pu_heard_date">8月19日</View>
            <View className="pu_heard_footer">
              {toolsArr.map((i) => (
                <View
                  className={`pu_heard_tools ${
                    i.disabled ? "pu_tools_disabled" : ""
                  }`}
                  onClick={!i.disabled ? i.onClick : () => {}}
                >
                  {i.name}
                </View>
              ))}
            </View>
          </View>
          <View className="pu_order_info">
            <View className="pu_order_content">
              <View className="pu_order_name">
                <View className="puon_name">优质生鲜搬运工</View>
                <View className="puon_price">892</View>
              </View>
              <View className="pu_order_img">
                <ImageShow width={194} src={""}></ImageShow>
              </View>
              <View className="pu_content_footer">
                <View className="pu_order_status end">未发布</View>
                <View className="pu_order_share"></View>
              </View>
            </View>
            <View className="pu_order_footer">
              <View className="pu_order_income">
                <View>
                  <Text>实际收入 ¥19.88</Text>
                  <Text>退款金额 ¥0</Text>
                </View>
                <View>
                  <Text>已跟团1人次</Text>
                  <Text>取消跟团0人次</Text>
                  <Text>查看0人</Text>
                </View>
              </View>
              <Button className="pu_order_tools" onClick={handleOrdertools}>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
              </Button>
            </View>
          </View>
        </View>
        <View className="pu_order_cell">
          <View className="pu_order_heard">
            <View className="pu_heard_date">8月19日</View>
            <View className="pu_heard_footer">
              {toolsArr.map((i) => (
                <View
                  className={`pu_heard_tools ${
                    i.disabled ? "pu_tools_disabled" : ""
                  }`}
                  onClick={!i.disabled ? i.onClick : () => {}}
                >
                  {i.name}
                </View>
              ))}
            </View>
          </View>
          <View className="pu_order_info">
            <View className="pu_order_content">
              <View className="pu_order_name">
                <View className="puon_name">优质生鲜搬运工</View>
                <View className="puon_price">892</View>
              </View>
              <View className="pu_order_img">
                <ImageShow width={194} src={""}></ImageShow>
              </View>
              <View className="pu_content_footer">
                <View className="pu_order_status end">未发布</View>
                <View className="pu_order_share"></View>
              </View>
            </View>
            <View className="pu_order_footer">
              <View className="pu_order_income">
                <View>
                  <Text>实际收入 ¥19.88</Text>
                  <Text>退款金额 ¥0</Text>
                </View>
                <View>
                  <Text>已跟团1人次</Text>
                  <Text>取消跟团0人次</Text>
                  <Text>查看0人</Text>
                </View>
              </View>
              <Button className="pu_order_tools" onClick={handleOrdertools}>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
              </Button>
            </View>
          </View>
        </View>
        <View className="pu_order_cell">
          <View className="pu_order_heard">
            <View className="pu_heard_date">8月19日</View>
            <View className="pu_heard_footer">
              {toolsArr.map((i) => (
                <View
                  className={`pu_heard_tools ${
                    i.disabled ? "pu_tools_disabled" : ""
                  }`}
                  onClick={!i.disabled ? i.onClick : () => {}}
                >
                  {i.name}
                </View>
              ))}
            </View>
          </View>
          <View className="pu_order_info">
            <View className="pu_order_content">
              <View className="pu_order_name">
                <View className="puon_name">优质生鲜搬运工</View>
                <View className="puon_price">892</View>
              </View>
              <View className="pu_order_img">
                <ImageShow width={194} src={""}></ImageShow>
              </View>
              <View className="pu_content_footer">
                <View className="pu_order_status end">未发布</View>
                <View className="pu_order_share"></View>
              </View>
            </View>
            <View className="pu_order_footer">
              <View className="pu_order_income">
                <View>
                  <Text>实际收入 ¥19.88</Text>
                  <Text>退款金额 ¥0</Text>
                </View>
                <View>
                  <Text>已跟团1人次</Text>
                  <Text>取消跟团0人次</Text>
                  <Text>查看0人</Text>
                </View>
              </View>
              <Button className="pu_order_tools" onClick={handleOrdertools}>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
              </Button>
            </View>
          </View>
        </View>
        <View className="pu_order_cell">
          <View className="pu_order_heard">
            <View className="pu_heard_date">8月19日</View>
            <View className="pu_heard_footer">
              {toolsArr.map((i) => (
                <View
                  className={`pu_heard_tools ${
                    i.disabled ? "pu_tools_disabled" : ""
                  }`}
                  onClick={!i.disabled ? i.onClick : () => {}}
                >
                  {i.name}
                </View>
              ))}
            </View>
          </View>
          <View className="pu_order_info">
            <View className="pu_order_content">
              <View className="pu_order_name">
                <View className="puon_name">优质生鲜搬运工</View>
                <View className="puon_price">892</View>
              </View>
              <View className="pu_order_img">
                <ImageShow width={194} src={""}></ImageShow>
              </View>
              <View className="pu_content_footer">
                <View className="pu_order_status end">未发布</View>
                <View className="pu_order_share"></View>
              </View>
            </View>
            <View className="pu_order_footer">
              <View className="pu_order_income">
                <View>
                  <Text>实际收入 ¥19.88</Text>
                  <Text>退款金额 ¥0</Text>
                </View>
                <View>
                  <Text>已跟团1人次</Text>
                  <Text>取消跟团0人次</Text>
                  <Text>查看0人</Text>
                </View>
              </View>
              <Button className="pu_order_tools" onClick={handleOrdertools}>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
                <View className="pu_tools_radio"></View>
              </Button>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
