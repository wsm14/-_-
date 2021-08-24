import React from "react";
import { View } from "@tarojs/components";
import { uploadImg } from "../utils";
import "./index.scss";

/**
 * 商品详情编辑 - 底部工具栏
 * setData 储存数据
 */
export default ({ checkDefaultText, setData }) => {
  const toolsArr = [
    {
      name: "大图",
      type: "largePicture",
      imgClass: "tools_img",
      onClick: () => uploadImg("largePicture", setData),
    },
    {
      name: "小图",
      type: "smallPicture",
      imgClass: "tools_sImg",
      onClick: () => uploadImg("smallPicture", setData),
    },
    {
      name: "文字",
      type: "textarea",
      imgClass: "tools_text",
      onClick: () => {
        checkDefaultText();
        setData({ type: "textarea" });
      },
    },
  ];

  return (
    <View className="gd_edit_tools">
      {toolsArr.map((i) => (
        <View
          className={`gd_edit_tools_item ${i.imgClass}`}
          onClick={i.onClick}
        >
          {i.name}
        </View>
      ))}
    </View>
  );
};
