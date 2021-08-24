import React from "react";
import { View } from "@tarojs/components";
import TitleItem from "../TitleItem";
import Upload from "./Upload";
import "./index.scss";

/**
 * 编辑模块 - 小图上传展示
 */
export default ({ url }) => {
  return (
    <View className="gd_smallPicture_box">
      <TitleItem title="小图"></TitleItem>
      <Upload></Upload>
    </View>
  );
};
