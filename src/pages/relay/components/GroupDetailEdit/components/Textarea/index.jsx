import React, { useContext } from "react";
import update from "immutability-helper";
import { View, Textarea } from "@tarojs/components";
import { EditContext } from "../../editStore";
import TitleItem from "../TitleItem";
import "./index.scss";

/**
 * 编辑模块 - 文字编辑
 * @param {Any} content 数据值
 * @param {Number} index 数据下标
 * @param {Function} setDataArr 数据储存方法
 * @param {Function} setEditStatus 设置文本框编辑状态
 */
export default ({ content, contentType, index, setEditStatus }) => {
  const { setDataArr } = useContext(EditContext);

  // 储存数据
  const saveNewData = (val) => {
    setEditStatus(false);
    setDataArr((old) =>
      update(old, { $splice: [[index, 1, { contentType, content: val }]] })
    );
  };

  return (
    <View className="gd_textarea_box">
      <TitleItem title="文字" index={index}></TitleItem>
      <Textarea
        value={content}
        placeholder="请输入团购活动内容"
        autoHeight
        disableDefaultPadding
        cursorSpacing={10}
        placeholderClass="gc_edit_default_text"
        className="gd_textarea"
        maxlength={-1}
        onFocus={() => setEditStatus(true)}
        onBlur={(e) => saveNewData(e.detail.value)}
      ></Textarea>
    </View>
  );
};
