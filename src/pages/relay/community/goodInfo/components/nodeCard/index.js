import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classNames";
export default (props) => {
  const { data = [] } = props;
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (data.length > 10) {
      setVisible(true);
    }
  }, [data]);
  return (
    <View className="community_nodeCard_box">
      <View className="community_nodeCard_title">跟团记录</View>
      {data.map((item, index) => {
        const { userName, profile, payTime, goodsInfo, goodsCount } = item;
        if (!show && index >= 10) {
          return null;
        }
        return (
          <View className="community_nodeCard_list">
            <View className="community_nodeCard_listBox">
              <View className="community_nodeCard_listcount">90</View>
              <View className="community_nodeCard_listprofile">
                <Image
                  className="community_nodeCard_imgScale"
                  lazyLoad
                  mode={"aspectFill"}
                  src={profile}
                ></Image>
              </View>
              <View className="user_card_content">
                <View className="user_card_contentTop font_hide">
                  <View className="user_card_top1 font_hide">{userName}</View>
                  <View className="user_card_top2">{payTime}</View>
                </View>
                <View className="user_card_contentBottom font_hide">
                  <View className="user_card_bottom1 font_hide">
                    {goodsInfo}
                  </View>
                  <View className="user_card_bottom2">+{goodsCount}</View>
                </View>
              </View>
            </View>
          </View>
        );
      })}

      {visible && (
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
      )}
    </View>
  );
};
