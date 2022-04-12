import React, { useEffect, useState, useRef } from "react";
import Taro, { useReachBottom } from "@tarojs/taro";
import { Image, Text, View } from "@tarojs/components";
import Rule from "./../../../collageDetails/components/payToast";
export default ({ visible, type = 0, close }) => {
  const font = {
    0: {
      title: "预计返佣",
      content: "当前正在开团中，等待成团的返佣金额之和",
    },
    1: {
      title: "拼中次数",
      content: "开团成功，且拼中商品的次数之和",
    },
  }[type];
  if (visible) {
    return (
      <Rule
        visible={visible}
        close={() => close()}
        hasBtn={true}
        btnFlag={false}
        title={font.title}
        content={font.content}
        canfirmText={"知道了"}
        canfirm={() => {
          close();
        }}
        style={{ textAlign: "center" }}
      ></Rule>
    );
  } else {
    return null;
  }
};
