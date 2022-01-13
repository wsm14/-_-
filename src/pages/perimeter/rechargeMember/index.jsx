import React, { useEffect, useState } from "react";
import { useDidShow } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { fetchRechargeMemberList } from "@/server/common";
import "./index.scss";

const rechargeMember = () => {
  const [data, setData] = useState({}); // 数据

  useEffect(() => {}, []);

  return <View className="rechargeMember_box">
    
  </View>;
};

export default rechargeMember;
