/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React from "react";
import { View } from "@tarojs/components";
import UserCard from "@/relay/components/UserCard";

export default (props) => {
  return (
    <View className="relay_box_home">
      <UserCard list={[{}, {}]}></UserCard>
    </View>
  );
};
