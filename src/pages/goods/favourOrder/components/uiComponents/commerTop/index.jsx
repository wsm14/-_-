import React from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default (props) => {
  const { userAddress = {}, userAddressIndex } = props;
  const { userAddressId, address, addressName, mobile } = userAddress;
  const templateAddress = () => {
    if (!userAddressId) {
      return (
        <View className="commerOrder_address">
          <View className="commerOrder_address_icon"></View>
          <View className="commerOrder_address_content ">
            <View className="commerOrder_address_sh">
              完善收货信息才可以发货哦{" "}
            </View>
          </View>
          <View
            className="commerOrder_address_link"
            onClick={() =>
              Router({
                routerName: "delivery",
                args: {
                  selectIndex: userAddressIndex,
                  mode: "select",
                },
              })
            }
          >
            去完善
          </View>
        </View>
      );
    } else {
      return (
        <View className="commerOrder_address">
          <View className="commerOrder_address_icon"></View>
          <View className="commerOrder_address_content">
            <View className="commerOrder_address_user font_hide">
              <Text className="color1 font32 font_hide">{addressName}</Text>
              <Text className="color2 font24 commerOrder_address_mobile">
                {mobile}
              </Text>
            </View>
            <View className="commerOrder_address_details liner_info">
              {address}
            </View>
          </View>
          <View
            className="commerOrder_address_link"
            onClick={() =>
              Router({
                routerName: "delivery",
                args: {
                  selectIndex: userAddressIndex,
                  mode: "select",
                },
              })
            }
          >
            修改
          </View>
        </View>
      );
    }
  };
  return templateAddress();
};
