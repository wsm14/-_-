import React, { useState } from "react";
import Router from "@/common/router";
import { View, Button } from "@tarojs/components";
import "./index.scss";

export default ({ tabbarChange }) => {
  const [groupTools, setGroupTools] = useState(true); // 是否显示团员/团长工具栏

  // 跳转自提点佣金设置
  const goPage = (routerName, args = {}) => {
    Router({
      routerName,
      args,
    });
  };

  const toolsArr = [
    {
      leble: "商品库",
      icon: "tools_menu",
      show: !groupTools, // 团长
      onClick: () => goPage("goodsManageList"),
    },
    {
      leble: "订单管理",
      icon: "tools_ordermg",
      show: !groupTools, // 团长
      onClick: () => goPage("groupOrderManage"),
    },
    {
      leble: "商品核销",
      icon: "tools_code",
      show: !groupTools, // 团长
      onClick: () => goPage("groupOrderVerification"),
    },
    {
      leble: "自提点管理",
      icon: "tools_shop",
      show: !groupTools, // 团长
      onClick: () => goPage("selfLiftingPointList", { mode: "list" }),
    },
    {
      leble: "收货地址",
      icon: "tools_loact",
      show: groupTools, // 团员
      onClick: () => goPage("delivery", { mode: "list" }),
    },
    {
      leble: "我的订单",
      icon: "tools_order",
      show: groupTools, // 团员
      onClick: () => tabbarChange(2),
    },
    {
      leble: "官方客服",
      icon: "tools_server",
      show: true,
    },
    // {
    //   leble: "反馈与建议",
    //   icon: "tools_edit",
    //   show: true,
    // },
  ];

  return (
    <View className="personal_tools">
      <View className="pt_content">
        <View className="pt_heard">
          <View className="pt_heard_title">
            {groupTools ? "团员" : "团长"}功能
          </View>
          <Button
            className="pt_heard_btn"
            onClick={() => setGroupTools(!groupTools)}
          >
            切换{groupTools ? "团长" : "团员"}功能
          </Button>
        </View>
        <View className="pt_tools_group">
          {toolsArr.map(
            (i) =>
              i.show && (
                <View className="pt_tools_cell" onClick={i.onClick}>
                  {i.icon === "tools_server" && (
                    <Button
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        background: "none",
                        position: "absolute",
                        zIndex: 999,
                      }}
                      openType={"contact"}
                    ></Button>
                  )}
                  <View className={`${i.icon} tools_text`}>{i.leble}</View>
                </View>
              )
          )}
        </View>
      </View>
    </View>
  );
};