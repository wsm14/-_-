import React, { useState } from "react";
import { View } from "@tarojs/components";
import classNames from "classnames";
import "./index.scss";
export default ({ list, val, onChange }) => {
  console.log(val);
  return (
    <View className="couponSelect_top">
      <View className="couponSelect_tag">
        {list.map((item) => {
          return (
            <>
              <View
                onClick={() => {
                  if (val === item.value) {
                    return;
                  } else {
                    onChange(item.value);
                  }
                }}
                className={classNames(
                  "couponSelect_flex",
                  item.value === val
                    ? "couponSelect_select_flex"
                    : "couponSelect_noSelect_flex"
                )}
              >
                {item.label}
              </View>
            </>
          );
        })}
      </View>
    </View>
  );
};
