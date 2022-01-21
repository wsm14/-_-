import React, { useState } from "react";
import { View } from "@tarojs/components";
import { useDidShow } from "@tarojs/taro";
import { loginStatus, computedTime } from "@/utils/utils";
import "./index.scss";
import Router from "@/utils/router";
import { useEffect } from "react";
export default () => {
  let env = process.env.NODE_ENV === "development" ? "dev" : "product";
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (loginStatus() && computedTime(loginStatus().createTime) < 3) {
      if (visible) {
        return;
      }
      setVisible(true);
    } else {
      if (!visible) {
        return;
      }
      setVisible(false);
    }
  }, []);
  useDidShow(() => {
    if (loginStatus() && computedTime(loginStatus().createTime) < 3) {
      if (visible) {
        return;
      }
      setVisible(true);
    } else {
      if (!visible) {
        return;
      }
      setVisible(false);
    }
  });
  if (visible) {
    return (
      <View
        className="newUserToast_box"
        onClick={() =>
          Router({
            routerName: "webView",
            args: {
              link: `https://web-new.dakale.net/${env}/game/sign/index.html#/coupon`,
            },
          })
        }
      ></View>
    );
  } else {
    return null;
  }
};
