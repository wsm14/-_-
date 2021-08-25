import React, { useState } from "react";
import { useRouter } from "@tarojs/taro";
import { View, Button, Text } from "@tarojs/components";
import FooterFixed from "@/relay/components/FooterFixed";
import "./index.scss";

/**
 * 设置自提点
 */
export default () => {
  // 路由获取参数
  const routeParams = useRouter().params;

  return (
    <View className="SelfLiftingPointEdit_Form">
      <FooterFixed>
        <View className="slp_footer">
          <View className="slp_footer_left">全选</View>
          <View className="slp_footer_right">
            <View className="slp_submit_total">
              已选<Text>2</Text>项
            </View>
            <Button className="slp_submit_btn">确定</Button>
          </View>
        </View>
      </FooterFixed>
    </View>
  );
};
