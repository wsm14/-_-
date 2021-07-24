import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getShareInfo } from "@/server/common";
import { rssConfigData } from "./components/data";
import TaroShareDrawer from "./components/TaroShareDrawer";
import "./index.scss";
export default ({}) => {
  const [cavansObj, setCanvasObj] = useState({
    data: null,
    start: false,
  });
  const fetchShareInfo = () => {
    const { profile, username } = Taro.getStorageSync("userInfo") || {};
    getShareInfo(
      {
        shareType: "activityImage",
        subType: "88activity",
      },
      (res) => {
        const { backgroundIos, qcodeUrl } = res;
        setCanvasObj({
          start: true,
          data: rssConfigData({
            background: backgroundIos,
            qcodeUrl,
            username,
          }),
        });
      }
    );
  };
  return (
    <View className="shareView_box">
      <View className="shareView_share" onClick={() => fetchShareInfo()}></View>
      <TaroShareDrawer
        {...cavansObj}
        onSave={() => console.log("点击保存")}
        onClose={() =>
          setCanvasObj({ cavansObj: { start: false, data: null } })
        }
      ></TaroShareDrawer>
    </View>
  );
};
