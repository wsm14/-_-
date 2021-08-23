import React, { useMemo, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { usePageScroll } from "@tarojs/taro";
import classNames from "classnames";
import { goBack, computedClient, computedSize } from "@/common/utils";
import "./index.scss";
export default (props) => {
  const { children, backFlag = false, select = false } = props;
  const [scroll, onscroll] = useState(false);
  usePageScroll((e) => {
    if (select) {
      const { scrollTop } = e;
      if (computedSize(scrollTop) >= 128) {
        onscroll(true);
      } else {
        onscroll(false);
      }
    }
  });
  return (
    <View>
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
                select && scroll ? "go_back_iconGreen" : "go_back_icon"
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
