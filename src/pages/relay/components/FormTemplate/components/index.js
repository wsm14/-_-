import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
export default (props) => {
  const { type, data } = props;
  const TextInfo = () => {
    return <View className="textInfo_interface"></View>;
  };
  const bigImg = () => {
    return (
      <View className="imageInfo_interface">
        <Image
          src={
            "https://wechat-config.dakale.net/miniprogram/active/8.8/active8_8_42.png"
          }
          mode="widthFix"
          className="mainScene_pp_box"
          lazyLoad
        ></Image>
      </View>
    );
  };
  const simImg = () => {
    return (
      <View className="simImgInfo_interface">
        {data.map((item) => {
          return (
            <View className="simImgInfo_interface_box">
              <Image
                className="user_card_image user_card_radius"
                lazyLoad
                mode={"aspectFill"}
                src={
                  "https://wechat-config.dakale.net/miniprogram/relay/icon_1.png"
                }
              ></Image>
            </View>
          );
        })}
      </View>
    );
  };
  const template = {
    text: TextInfo,
    smImage: simImg,
    bigImg: bigImg,
  }[type];
  if (template) {
    template();
  } else {
    return null;
  }
};
