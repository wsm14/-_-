import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { usePageScroll } from "@tarojs/taro";
import classNames from "classnames";
import { goBack, computedClient, computedSize } from "@/common/utils";
import "./index.scss";
export default (props) => {
  /*
   backFlag 是否开始导航
   select 是否开启导航切换
  */
  const { children, backFlag = false, select = false } = props;
  const [scroll, onscroll] = useState(true);
  usePageScroll((e) => {
    if (select) {
      const { scrollTop } = e;
      if (computedSize(scrollTop) >= 128) {
        onscroll(false);
      } else {
        onscroll(true);
      }
    }
  });
  return (
    <View className="naviton_info">
      <View className="naviton_box">
        <View className="naviton_title"></View>
        <View
          className={classNames(
            "naviton_title_fixed",
            select && scroll && "naviton_title_green"
          )}
        >
          {backFlag && (
            <View
              style={{ top: computedSize(computedClient().top + 8) }}
              className={classNames(
                "naviton_title_backStyle",
                select && scroll ? "go_back_iconWhite" : "go_back_iconGreen"
              )}
              onClick={() => goBack()}
            ></View>
          )}
        </View>
      </View>
      {children}
    </View>
  );
};
