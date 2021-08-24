import React from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import TitleItem from "../TitleItem";
import "./index.scss";

/**
 * 编辑模块 - 大图展示
 */
export default ({ value, index }) => {
  // 点击查看图片
  const handleShowImg = (e) => {
    e.stopPropagation();
    Taro.previewImage({
      current: value, // 当前显示图片的http链接
      urls: [value], // 需要预览的图片http链接列表
    });
  };

  return (
    <View className="gd_largePicture_box">
      <TitleItem title="大图" index={index}></TitleItem>
      <Image mode={"widthFix"} src={value} onClick={handleShowImg}></Image>
    </View>
  );
};
