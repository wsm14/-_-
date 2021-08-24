import React, { useState } from "react";
import { View, Textarea } from "@tarojs/components";
import { EditContext } from "./editStore";
import Tools from "./components/Tools";
import TextareaEdit from "./components/Textarea";
import LargePicture from "./components/LargePicture";
import SmallPicture from "./components/SmallPicture";
import "./index.scss";

/**
 * 商品详情编辑模块
 */
export default ({}) => {
  const [dataArr, setDataArr] = useState([]); // 可编辑数据暂存处理 { type 类型, value 数据 }
  const [defaultText, setDefaultText] = useState(""); // 默认文本数据 用做校验
  const [textEditStatus, setTextEditStatus] = useState(false); // 文本框编辑状态 编辑中不可移动数据

  // 储存数据
  const saveData = (data) => setDataArr((old) => old.concat(data));

  // 判断默认输入框是否输入文字 输入则渲染一个 textarea
  const checkTextareaContent = (value) => {
    if (value.length) {
      setDefaultText("");
      saveData({ type: "textarea", value });
    }
  };

  /**
   * 检查渲染的dom结构
   * @param {Object} data { value 数据, index 当前数据下标 }
   */
  const checkEditDom = ({ data, index }) => {
    const { type } = data;
    const props = { ...data, index };
    switch (type) {
      case "textarea": // 文字
        return (
          <TextareaEdit
            {...props}
            setEditStatus={setTextEditStatus}
          ></TextareaEdit>
        );
      case "smallPicture": // 小图
        return <SmallPicture {...props}></SmallPicture>;
      case "largePicture": // 大图
        return <LargePicture {...props}></LargePicture>;
      default:
        break;
    }
  };

  return (
    <EditContext.Provider value={{ textEditStatus, dataArr, setDataArr }}>
      <View className="groupdetail_edit">
        {/* 默认渲染一个文本框 */}
        {!dataArr.length ? (
          <Textarea
            placeholder="请输入团购活动内容"
            autoHeight
            disableDefaultPadding
            placeholderClass="gc_edit_default_text"
            className="gc_edit_textarea"
            onInput={(e) => setDefaultText(e.detail.value)}
            onBlur={(e) => checkTextareaContent(e.detail.value)}
          ></Textarea>
        ) : (
          dataArr.map((data, index) => (
            <View className="groupdetail_edit_item">
              {checkEditDom({ data, index })}
            </View>
          ))
        )}
        <Tools
          checkDefaultText={() => checkTextareaContent(defaultText)}
          setData={(data) => saveData(data)}
        ></Tools>
      </View>
    </EditContext.Provider>
  );
};
