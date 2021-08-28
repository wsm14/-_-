/*
 到点打卡,商户暂不支持到店打卡，请联系商户开通设置
*/
import React, { useMemo } from "react";
import Taro, { useShareAppMessage } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import "./index.scss";
export default (props) => {
  const { data = {}, show = false, onClose } = props;
  const { title = "", frontImage = "", miniProgramUrl } = data;
  useShareAppMessage((res) => {
    if (res.from === "button") {
      return {
        title: title,
        path: miniProgramUrl,
        imageUrl: frontImage,
      };
    }
    return {
      title: title,
      imageUrl: frontImage,
      path: miniProgramUrl,
    };
  });
  if (show) {
    return (
      <View className="share_layer_info animated fadeIn" catchMove>
        <View
          className="share_layer_infoBox"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        ></View>
        <View className="share_layer_content">
          <View className="share_layer_shareInfo">
            <View
              className="share_layer_shareWechat"
              onClick={() => {
                onClose();
              }}
            >
              <Button
                style={{
                  width: "100%",
                  height: "100%",
                  background: "none",
                  position: "absolute",
                }}
                openType={"share"}
              ></Button>
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
          <View className="share_layer_liner"></View>
          <View className="share_layer_close public_center" onClick={onClose}>
            取消
          </View>
        </View>
      </View>
    );
  }
  return null;
};
