import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import ButtonView from "@/components/Button";
import "./index.scss";
export default (props) => {
  const { data, visible, show = false } = props;
  const [animate, setAnimated] = useState(null);
  const animated = () => {
    let animateTem = Taro.createAnimation({
      duration: 10,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    let animateTem1 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem.scale(0, 0).step();
    setAnimated(animateTem.export());
    setTimeout(() => {
      animateTem1.scale(1, 1).step();
      setAnimated(animateTem1);
    }, 300);
  };
  const onClose = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      visible();
    }, 300);
  };
  useEffect(() => {
    if (show) {
      animated();
    }
  }, [show]);
  return (
    <View
      style={show ? { display: "flex" } : { display: "none" }}
      className="kol_bean public_center"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <View
        className="kol_bean_box happyBean"
        animation={animate}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <View className="kol_details_padding">
          <View className="color1 bold font32">恭喜您获得</View>
          <View className="font40 bold color3 bean_padding">
            {data.beanAmount}卡豆
          </View>
          <ButtonView>
            <View
              className="getBean_btn font32 color6"
              onClick={() => onClose()}
            >
              立即领取
            </View>
          </ButtonView>
        </View>
      </View>
    </View>
  );
};
