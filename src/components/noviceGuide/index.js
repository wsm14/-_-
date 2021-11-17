import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { getShareInfo } from "@/server/user";
import { getUserMomentcheckNew } from "@/server/share";
import Router from "@/common/router";
import "./index.scss";
export default ({ data, auth, type, stopVideo, initVideo }) => {
  const [animate, setAnimated] = useState(null);
  const [visible, setVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [beanInfo, setBeanInfo] = useState({
    newUserFlag: "0",
    newUserBean: "300",
  });
  const { newUserFlag, newUserBean } = beanInfo;
  useEffect(() => {
    const { shareUserId } = data;
    if (shareUserId && !Object.keys(userInfo).length && type !== "index") {
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
        const { newUserFlag = "1", newUserBean = "300" } = val;
        if (newUserFlag === "1") {
          setVisible(() => {
            setBeanInfo({
              newUserFlag,
              newUserBean,
            });
            return true;
          });
        }
      });
    }
  }, [auth]);

  useEffect(() => {
    if (visible) {
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
  const linkInfo = (routerName) => {
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
        routerName: routerName,
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
        catchMove
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <View className="noviceGuide_Box">
          <View className="noviceGuide_title">
            <View className="noviceGuide_title_pad">恭喜获得新人奖励</View>
          </View>
          <View className="noviceGuide_hf">
            卡豆抵扣消费立减{(newUserBean / 100).toFixed(2)}元
          </View>
          <View className="noviceGuide_gifBean">
            <View className="gifBean_btn public_center">{newUserBean}卡豆</View>
          </View>
          <View
            className="noviceGuide_btn public_center"
            onClick={() => linkInfo("userNewArtist")}
          >
            立即领取
          </View>
          <View
            className="noviceGuide_Box_close"
            onClick={() => onClose()}
          ></View>
        </View>
      </View>
    );
  };
  if (visible) {
    return template();
  } else {
    return null;
  }
};
