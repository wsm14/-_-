import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { useEffect } from "react";
import Router from "@/common/router";
export default (props) => {
  const { index, list, setInfoAddress } = props;
  const [data, setData] = useState({});
  useEffect(() => {
    if (list.length > 0 && !index) {
      setInfoAddress(list[0]);
    } else if (list.length > 0 && index) {
      setData({ ...index });
    }
  }, [index, list]);
  const { address, addressName, mobile } = data;
  const orderIndex = (item) => {
    let str = 0;
    list.forEach((val, index) => {
      if (item.userAddressId === val.userAddressId) {
        str = index;
      }
    });
    return str;
  };
  return (
    <View className="order_userAddressCard_box">
      <View className="order_userAddressCard_paddingBox">
        <View className="order_userAddressCard_title">
          <Text className="color1">团长还希望你完成以下信息</Text>
          <Text className="color3">（必填）</Text>
        </View>
        {list.length > 0 && (
          <View
            onClick={() =>
              Router({
                routerName: "delivery",
                args: {
                  selectIndex: orderIndex(index),
                },
              })
            }
            className="order_userAddressCard_userBox"
          >
            <View className="order_userAddressCard_user">
              <Text className="color1 font28 bold">{addressName + " "}</Text>
              <Text className="color2 font24 price_margin8">{mobile}</Text>
            </View>
            <View className="order_userAddressCard_address font_noHide">
              {address}
            </View>
            <View className="order_userAddressCard_link"></View>
          </View>
        )}
        {list.length === 0 && (
          <View
            onClick={() =>
              Router({
                routerName: "delivery",
                args: {},
              })
            }
            className="order_userAddressCard_userinfo"
          >
            请填写收货地址 <View className="order_userAddressCard_link"></View>
          </View>
        )}
        
      </View>
    </View>
  );
};
