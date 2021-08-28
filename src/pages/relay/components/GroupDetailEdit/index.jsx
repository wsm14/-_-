import React, { useState, useEffect, useImperativeHandle } from "react";
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
export default ({ cRef, value }) => {
  const [dataArr, setDataArr] = useState([]); // 可编辑数据暂存处理 { contentType 类型, content 数据 }
  const [defaultText, setDefaultText] = useState(""); // 默认文本数据 用做校验
  const [textEditStatus, setTextEditStatus] = useState(false); // 文本框编辑状态 编辑中不可移动数据

  useEffect(() => {
    if (value) {
      setDataArr(dataArr);
    }
  }, [value]);

  // 向父组件暴露方法
  useImperativeHandle(cRef, () => ({
    getData: () => dataArr,
  }));

  // 储存数据
  const saveData = (data) => setDataArr((old) => old.concat(data));

  // 判断默认输入框是否输入文字 输入则渲染一个 text
  const checkTextareaContent = (content) => {
    if (content.length) {
      setDefaultText("");
      saveData({ contentType: "text", content });
    }
  };

  /**
   * 检查渲染的dom结构
   * @param {Object} data { content 数据, index 当前数据下标 }
   */
  const checkEditDom = ({ data, index }) => {
    const { contentType } = data;
    const props = { ...data, index };
    switch (contentType) {
      case "text": // 文字
        return (
          <TextareaEdit
            {...props}
            setEditStatus={setTextEditStatus}
          ></TextareaEdit>
        );
      case "smallImage": // 小图
        return <SmallPicture {...props}></SmallPicture>;
      case "image": // 大图
        return <LargePicture {...props}></LargePicture>;
      default:
        break;
    }
  };

  return (
    <EditContext.Provider value={{ textEditStatus, dataArr, setDataArr }}>
      <View className="groupdetail_edit">
        {/* 默认渲染一个文本框 否则渲染dom编辑组件*/}
        {!dataArr.length ? (
          <Textarea
            placeholder="请输入团购活动内容"
            autoHeight
            disableDefaultPadding
            placeholderClass="gc_edit_default_text"
            maxlength={-1}
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
