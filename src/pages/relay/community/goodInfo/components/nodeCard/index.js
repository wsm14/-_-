import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classNames";
export default (props) => {
  const { list } = props;
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  return (
    <View className="community_nodeCard_box">
      <View className="community_nodeCard_title">跟团记录</View>
      <View className="community_nodeCard_list">
        <View className="community_nodeCard_listBox">
          <View className="community_nodeCard_listcount">90</View>
          <View className="community_nodeCard_listprofile">
            <Image
              className="community_nodeCard_imgScale"
              lazyLoad
              mode={"aspectFill"}
              src={
                "https://wechat-config.dakale.net/miniprogram/relay/icon_1.png"
              }
            ></Image>
          </View>
          <View className="user_card_content">
            <View className="user_card_contentTop font_hide">
              <View className="user_card_top1 font_hide">庄严</View>
              <View className="user_card_top2">3个月前</View>
            </View>
            <View className="user_card_contentBottom font_hide">
              <View className="user_card_bottom1 font_hide">
                现烤手撕鱿鱼片现烤手撕鱿鱼片现烤手撕鱿鱼片烤鱼片30…
              </View>
              <View className="user_card_bottom2">+1</View>
            </View>
          </View>
        </View>
      </View>
      <View
        className="community_nodeCard_select"
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? "收起全部" : "查看更多"}
        <View
          className={classNames(
            "community_nodeCard_selectBox",
            show
              ? "community_nodeCard_selectIcon2"
              : "community_nodeCard_selectIcon1"
          )}
        ></View>
      </View>
    </View>
  );
};
