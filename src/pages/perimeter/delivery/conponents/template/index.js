import React from "react";
import { useRouter } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";

export default (props) => {
  // 路由获取参数 mode select 选择模式 list 列表管理
  const routeParams = useRouter().params;
  const { mode = "list" } = routeParams;

  const { index, selectIndex, changeSelect, updateInfo, data } = props;
  const { address, mobile, addressName } = data;

  return (
    <View className="delivery_template_box">
      <View
        className="delivery_template_cell"
        onClick={(e) => {
          e.stopPropagation();
          address && mobile && addressName && changeSelect(index);
        }}
      >
        {mode !== "list" && (
          <View
            className={`delivery_template_iconBox ${
              address && mobile && addressName
                ? index == selectIndex
                  ? "delivery_template_style2"
                  : "delivery_template_style1"
                : "delivery_template_no"
            }`}
          ></View>
        )}
        <View className="delivery_template_content">
          <View className="delivery_template_userInfo font_hide">
            <Text className="addressName font_hide">{addressName}</Text>
            <Text className="mobile">{mobile}</Text>
          </View>
          <View className="delivery_template_address font_noHide">
            {address}
          </View>
        </View>
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
