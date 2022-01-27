import React, { useState, useEffect } from "react";
import Taro from "@tarojs/taro";
import { backgroundObj } from "@/utils/utils";
import { View } from "@tarojs/components";

export default ({ data = {}, onChange, animate }) => {
  const { sendUser = {} } = data;
  const { username, profile } = sendUser;
  const [animated, setAnimated] = useState(null);
  useEffect(() => {
    if (animate) {
      setAnimated(templateAnimated());
    }
  }, [animate]);
  const templateAnimated = () => {
    const template = Taro.createAnimation({
      duration: 800,
      timingFunction: "ease-out",
      delay: 0,
      transformOrigin: "50% 50% 0",
    });
    template.translateZ(50).scale(0.8).step().rotateY(720).step();
    return template.export();
  };
  return (
    <View animation={animated} className="Grab_getbean_box" onClick={onChange}>
      <View className="Grab_getbean_image">
        <View className="Grab_getbean_height"></View>
        <View
          className="Grab_getbean_profile"
          style={backgroundObj(profile)}
        ></View>
        <View className="Grab_getbean_name font_hide">
          {username}发的卡豆红包
        </View>
      </View>
    </View>
  );
};
