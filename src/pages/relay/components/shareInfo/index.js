/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React, { useMemo } from "react";
import { View, Text, Image } from "@tarojs/components";
import FormComponents from "../FormCondition";
import "./index.scss";
export default (props) => {
  const { data } = props;
  const memo = useMemo(() => {
    return (
      <View className="share_layer_info">
        <View className="share_layer_infoBox"></View>
        <View className="share_layer_content">
          <View className="share_layer_shareInfo">
            <View className="share_layer_shareWechat">
              <View className="share_layer_shareWechatIcon"></View>
              <View className="share_layer_shareWechatText">分享到微信</View>
            </View>
            <View className="share_layer_shareWechat">
              <View className="share_layer_shareWechatIcon"></View>
              <View className="share_layer_shareWechatText">发朋友圈海报</View>
            </View>
            <View className="share_layer_shareWechat">
              <View className="share_layer_shareWechatIcon"></View>
              <View className="share_layer_shareWechatText">复制链接</View>
            </View>
          </View>
        </View>
      </View>
    );
  }, [data]);
  return memo;
};
