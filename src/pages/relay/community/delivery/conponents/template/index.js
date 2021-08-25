import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classnames";
export default (props) => {
  const { index, selectIndex, changeSelect, updateInfo, data } = props;
  const { address, mobile, addressName } = data;
  return (
    <View className="delivery_template_box" onClick={() => changeSelect(index)}>
      <View
        className={classNames(
          "delivery_template_iconBox",
          index == selectIndex
            ? "delivery_template_style2"
            : "delivery_template_style1"
        )}
      ></View>
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
