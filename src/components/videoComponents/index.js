import React, { useEffect, useState, useRef } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import { computedClient } from "@/utils/utils";
import User from "./components/userDetails";
import "./index.scss";
export default (props) => {
  const {
    data,
    current,
    beanLimitStatus,
    index,
    initBean = true,
    ugcBeanCount,
  } = props;
  const [toast, setToast] = useState(1);
  const [timeOut, setTimeOut] = useState(null);
  const {
    watchStatus,
    tippingBean,
    couponTitlesJson = [],
    beanFlag,
    guideMomentFlag,
    freeCouponFlag = "0",
  } = data;
  useEffect(() => {
    if (current === index) {
      setToast(1);
      if (beanLimitStatus === "0" || beanFlag != "1") {
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
    freeCouponFlag === "1" ? (str += "+免费券") : "";
    if (beanLimitStatus === "0") {
      return "今日卡豆领取已达上限";
    } else if (beanFlag === 0 || beanFlag === "0") {
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
      {toast === 1 && beanFlag == 1 && initBean ? (
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
