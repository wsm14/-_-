import React, { useEffect, useState, useMemo } from "react";
import { View, Textarea, Text, Image, RichText } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import "./index.scss";
export default ({ show = false, close, data }) => {
  const [keyword, setWord] = useState(null);
  const [comment, setComment] = useState({});
  useEffect(() => {
    if (show) {
      Taro.hideTabBar();
    } else {
      Taro.showTabBar();
    }
  }, [show]);
  const setKeyWord = (val) => {
    const { value } = val.detail;
    setWord(value);
  };
  const temPlateComment = (item) => {
    const {} = item;
    return (
      <View className="temPlateComment_box">
        <View className="temPlateComment_profile"></View>
        <View className="temPlateComment_content">
          <View className="temPlateComment_username font_hide">用户昵称 </View>
          <RichText
            nodes={"adadasdasdasda[微笑]asdasdasddsf的点点滴滴多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多多asdd[吃瓜]".replace(
              /\[(.*?)]/g,
              `<img
               width=${Taro.pxTransform(24)}
              src="https://wechat-config.dakale.net/miniprogram/emijo/$1.png"
            ></img>`
            )}
            className="temPlateComment_desc"
          ></RichText>
          <View className="temPlateComment_time">2小时前</View>
        </View>
      </View>
    );
  };
  const memo = useMemo(() => {
    console.log(show);
    return (
      <View
        className="comment_box"
        onClick={(e) => {
          e.stopPropagation();
          close();
        }}
        style={{ display: show ? "flex" : "none" }}
      >
        <View
          className="comment_content_box"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View className="comment_content_top">3条评论</View>
          {temPlateComment({})}
          <View className="comment_bottom_box">
            <View className="comment_input_text">
              <Text className="comment_text_info">{keyword}</Text>
              <Textarea
                maxlength={100}
                onInput={setKeyWord}
                className="Textarea_box"
              ></Textarea>
            </View>
            <View className="comment_bottom_btn public_center">发表</View>
          </View>
        </View>
      </View>
    );
  }, [keyword, comment, show]);
  return memo;
};
