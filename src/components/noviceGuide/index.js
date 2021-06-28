import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getShareInfo } from "@/server/user";
import { getUserMomentcheckNew } from "@/server/share";
import Router from "@/common/router";
import "./index.scss";
export default ({ data, auth, type, stopVideo, initVideo }) => {
  const [animate, setAnimated] = useState(null);
  const [visible, setVisible] = useState(true);
  const [userInfo, setUserInfo] = useState({});
  const [beanInfo, setBeanInfo] = useState({
    newUserFlag: "0",
    newUserBean: "300",
  });
  const { newUserFlag, newUserBean } = beanInfo;
  useEffect(() => {
    const { shareUserId } = data;
    if (shareUserId && !Object.keys(userInfo).length) {
      getShareInfo({ userId: shareUserId }, (res) => {
        const { userInfo } = res;
        setUserInfo(userInfo);
      });
    }
  }, [data]);
  useEffect(() => {
    if (auth !== 0) {
      getUserMomentcheckNew({
        newDeviceFlag: Taro.getStorageSync("newDeviceFlag") || "1",
      }).then((val) => {
        const { newUserFlag = "0", newUserBean = "300" } = val;
        setBeanInfo({
          newUserFlag: newUserFlag,
          newUserBean,
        });
      });
    }
  }, [auth]);

  useEffect(() => {
    if (newUserFlag === "1" && visible) {
      animated();
    }
  }, [beanInfo]);
  const { username } = userInfo;
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
      setVisible(false);
      initVideo && initVideo();
    }, 300);
  };
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
      stopVideo && stopVideo();
    }, 300);
  };
  const login = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      setVisible(false);
      Router({
        routerName: "userNewArtist",
        args: {
          ...data,
          username,
          type,
        },
      });
      initVideo && initVideo();
    }, 300);
  };

  /* 显示隐藏动画  */

  const template = () => {
    return (
      <View
        animation={animate}
        className="noviceGuide_Box_father"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <View className="noviceGuide_Box">
          <View className="noviceGuide_image">
            <View className="noviceGuide_user font_hide">
              @{username + " "}送你
            </View>
            <View className="noviceGuide_font1"></View>
            <View className="noviceGuide_font2 public_center">
              <View className="noviceGuide_bean_icon"></View>
              <View className="noviceGuide_num_icon"></View>
              <View className="noviceGuide_num">{newUserBean}</View>
            </View>
            <View className="noviceGuide_font3">等你领取</View>
            <View
              className="noviceGuide_font4 public_center"
              onClick={() => {
                login();
              }}
            >
              立即领取
            </View>
          </View>
          <View className="noviceGuide_Box_close"></View>
        </View>
      </View>
    );
  };
  if (newUserFlag === "1" && visible) {
    return template();
  } else {
    return null;
  }
};
