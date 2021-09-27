import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getShareInfo } from "@/server/common";
import { rssConfigData } from "./components/data";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { useEffect } from "react";
import "./index.scss";
export default ({ visible = false, close }) => {
  const [cavansObj, setCanvasObj] = useState({
    data: null,
    start: false,
  });
  useEffect(() => {
    if (visible) {
      fetchShareInfo();
    }
  }, [visible]);
  const fetchShareInfo = () => {
    const { profile, username } = Taro.getStorageSync("userInfo") || {};
    getShareInfo(
      {
        shareType: "activityImage",
        subType: "88activity",
      },
      (res) => {
        const { shareInfo } = res;
        const { background, qcodeUrl } = shareInfo;
        setCanvasObj({
          start: true,
          data: rssConfigData({
            background: background,
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
        onClose={() => {
          setCanvasObj({ cavansObj: { start: false, data: null } });
          close && close();
        }}
      ></TaroShareDrawer>
    </View>
  );
};
