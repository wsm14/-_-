import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { useEffect } from "react";
export default (props) => {
  const { list = [], index } = props;
  const [data, setData] = useState({});
  useEffect(() => {
    setData(
      list.filter((item) => {
        item.communityLiftingCabinetId = index;
      })[0] || {}
    );
  }, [index]);
  const { address = "", contactPerson = "", mobile = "", liftingName } = data;
  return (
    <View className="order_selectAddressCard_box">
      <View className="order_selectAddressCard_paddingBox">
        <View className="order_selectAddressCard_select">
          <View className="order_selectAddressCard_left"></View>
          <View className="order_selectAddressCard_center font_Hide">
            <Text>已选自提点：</Text>
            <Text className="bold">{liftingName}</Text>
          </View>
          <View className="order_selectAddressCard_right"></View>
        </View>
        <View className="order_selectAddressCard_address font_noHide">
          {address}
        </View>
        <View className="order_selectAddressCard_telephone">
          联系人：{contactPerson + " "}
          {mobile}
        </View>
      </View>
    </View>
  );
};
