import React, { useState } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getShareInfo } from "@/server/common";
import { rssConfigData } from "./components/data";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { useEffect } from "react";
import "./index.scss";
export default ({ close, cavansObj }) => {
  return (
    <TaroShareDrawer
      {...cavansObj}
      onSave={() => console.log("点击保存")}
      onClose={() => {
        close && close();
      }}
    ></TaroShareDrawer>
  );
};
