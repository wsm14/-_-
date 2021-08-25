import React, { useContext } from "react";
import update from "immutability-helper";
import { View } from "@tarojs/components";
import { EditContext } from "../../editStore";
import TitleItem from "../TitleItem";
import Upload from "./Upload";
import "./index.scss";

/**
 * 编辑模块 - 小图上传展示
 * @param {Any} content 数据值
 * @param {String} contentType 当前模块类型
 * @param {Number} index 数据下标
 * @param {Function} setDataArr 数据储存方法
 */
export default ({ content = [], contentType, index }) => {
  const { setDataArr } = useContext(EditContext);

  // 储存数据
  const saveNewData = (val) => {
    setDataArr((old) =>
      update(old, { $splice: [[index, 1, { contentType, content: val }]] })
    );
  };

  return (
    <View className="gd_smallPicture_box">
      <TitleItem title="小图" index={index}></TitleItem>
      <Upload
        data={content && Array.isArray(content) ? content : content.split(",")}
        onChange={saveNewData}
      ></Upload>
    </View>
  );
};
