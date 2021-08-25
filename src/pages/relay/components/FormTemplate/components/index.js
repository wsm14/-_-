import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { filterStrList } from "@/common/utils";
export default (props) => {
  const { contentType, content } = props;
  const TextInfo = () => {
    return <View className="textInfo_interface"></View>;
  };
  const bigImg = () => {
    return (
      <View className="imageInfo_interface">
        <Image
          src={content}
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
        {filterStrList(content).map((item) => {
          return (
            <View className="simImgInfo_interface_box">
              <Image
                className="user_card_image user_card_radius"
                lazyLoad
                mode={"aspectFill"}
                src={item}
              ></Image>
            </View>
          );
        })}
      </View>
    );
  };
  const template = {
    text: TextInfo,
    smallImage: simImg,
    image: bigImg,
  }[contentType];
  if (template) {
    template();
  } else {
    return null;
  }
};
