import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { getDom } from "@/common/utils";
import "./../index.scss";
export default (props) => {
  const { data, current } = props;
  const [showStatus, setShowStatus] = useState(0);
  const [style, setStyle] = useState(0);
  const { promotionIdString } = data;
  const step1 = () => {
    if (promotionIdString) {
      setShowStatus(1);
      couputedBox();
    } else {
      setShowStatus(2);
    }
  };
  const couputedBox = () => {
    getDom(`.home_active_box${current}`, (res) => {
      console.log(res);
      const { top } = res[0];
      setStyle(top - 10);
    });
  };
  const template = {
    0: (
      <View className="guide_Box_father">
        <View className="guide_Box"></View>
        <View className="guide_boxToast"></View>
        <View
          className="guide_boxNextTip"
          onClick={() => step1()}
        ></View>
      </View>
    ),
    1: (
      <View className="guide_Box_father">
        <View style={{ top: style }} className="guide_step2"></View>
        <View
          style={{ top: style - 40 }}
          className="guide_toast2"
        ></View>
        <View onClick={() => {setShowStatus(2)}} style={{ top: style }} className="guide_btn3"></View>
      </View>
    ),
    2: (
      <View className="guide_Box_father">
        <View className="guide_touch">
          <View>
            <View className="guide_touch_img"></View>
            <View
              className="guide_touch_btn"
              onClick={() => {
                Taro.setStorageSync("login", "1");
                setShowStatus(null);
              }}
            ></View>
          </View>
        </View>
      </View>
    ),
  }[showStatus];
  if (Taro.getStorageSync("login") || showStatus === null) {
    return null;
  } else {
    return template;
  }
};
