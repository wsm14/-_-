import React, { useEffect, useState, useRef } from "react";
import Taro from "@tarojs/taro";
import { Button, Text, View, Canvas } from "@tarojs/components";
import classNames from "classnames";
import { computedClient } from "@/common/utils";
import User from "./components/userDetails";
import "./index.scss";
const scale = () => {
  return Taro.getSystemInfoSync().windowWidth / 375;
};
export default (props) => {
  const { data, current, beanLimitStatus, index, initBean = true } = props;
  const [toast, setToast] = useState(1);
  const [timeOut, setTimeOut] = useState(null);
  const {
    watchStatus,
    tippingBean,
    couponTitlesJson = [],
    beanFlag,
    guideMomentFlag,
  } = data;
  useEffect(() => {
    if (current === index) {
      setToast(1);
      if (beanLimitStatus === "0" || beanFlag === 0) {
        return;
      }
      if (!timeOut) {
        let val = setTimeout(() => setToast(0), 10000);
        setTimeOut(val);
      } else {
        clearTimeout(timeOut);
        let val = setTimeout(() => setToast(0), 10000);
        setTimeOut(val);
      }
    }
  }, [current]);

  const renderToast = () => {
    let str = "";
    if (couponTitlesJson.length > 0) {
      str = `+${couponTitlesJson[0].couponPrice}元优惠券`;
    }
    if (beanLimitStatus === "0") {
      return "今日卡豆领取已达上限";
    } else if (beanFlag === 0) {
      return "卡豆被领完啦！";
    } else if (watchStatus === "1") {
      return `已领取${tippingBean}卡豆`;
    } else {
      if (guideMomentFlag === "1") {
        return `新手福利 +${tippingBean}`;
      } else {
        return `看完可捡${tippingBean}卡豆${str}`;
      }
    }
  };
  return (
    <View className="video_layer_box">
      {toast === 1 && initBean ? (
        <View
          className={classNames(
            "video_layer_toast",
            toast === 0 && "animated fadeOut"
          )}
          style={{
            top: computedClient().top + computedClient().height + 20,
          }}
        >
          <View className="video_layer_toastBg"> {renderToast()}</View>
        </View>
      ) : null}
      <User initBean={initBean} {...props}></User>
    </View>
  );
};
