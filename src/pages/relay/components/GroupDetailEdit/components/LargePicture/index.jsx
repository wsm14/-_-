import React from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import TitleItem from "../TitleItem";
import "./index.scss";

/**
 * 编辑模块 - 大图展示
 */
export default ({ url }) => {
  // 点击查看图片
  const handleShowImg = (e) => {
    e.stopPropagation();
    Taro.previewImage({
      current: url, // 当前显示图片的http链接
      urls: [url], // 需要预览的图片http链接列表
    });
  };

  return (
    <View className="gd_largePicture_box">
      <TitleItem title="大图"></TitleItem>
      <Image mode={"widthFix"} src={url} onClick={handleShowImg}></Image>
    </View>
  );
};
