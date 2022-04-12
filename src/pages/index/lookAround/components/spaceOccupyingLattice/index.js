import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { backgroundObj } from "@/utils/utils";
import { computedClient } from "@/utils/utils";
import Router from "@/utils/router";
//逛逛顶部导航栏
export default (props) => {
  const { data = {}, onChange } = props;
  const { height } = data;
  return (
    <View
      onClick={() => onChange(data)}
      style={{ height: Taro.pxTransform(height) }}
    ></View>
  );
};
