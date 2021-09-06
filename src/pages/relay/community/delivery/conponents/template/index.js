import React, { useMemo, useState } from "react";
import { useRouter } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classnames";

export default (props) => {
  // 路由获取参数 mode select 选择模式 list 列表管理
  const routeParams = useRouter().params;
  const { mode = "select" } = routeParams;

  const { index, selectIndex, changeSelect, updateInfo, data } = props;
  const { address, mobile, addressName } = data;

  return (
    <View className="delivery_template_box" onClick={() => changeSelect(index)}>
      {mode !== "list" && (
        <View
          className={classNames(
            "delivery_template_iconBox",
            index == selectIndex
              ? "delivery_template_style2"
              : "delivery_template_style1"
          )}
        ></View>
      )}
      <View className="delivery_template_content">
        <View className="delivery_template_userInfo font_hide">
          <Text className="font28 color1">{addressName}</Text>
          <Text className="font24 color2">{mobile}</Text>
        </View>
        <View className="delivery_template_address font_noHide">{address}</View>
      </View>
      <View
        className="delivery_template_edit"
        onClick={(e) => {
          e.stopPropagation();
          updateInfo(data);
        }}
      ></View>
    </View>
  );
};
