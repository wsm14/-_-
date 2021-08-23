/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React ,{ useMemo }from "react";
import { View } from "@tarojs/components";
import FormComponents from "./../../../components/FormCondition";
export default (props) => {
  const { list = [] } = props;
  const useMemo= useMemo(() => {
    return (
      <View className=''></View>
    )
  },[list])
  return (
    
  );
};
