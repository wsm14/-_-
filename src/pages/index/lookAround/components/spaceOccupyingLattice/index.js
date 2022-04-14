import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { backgroundObj } from "@/utils/utils";
import { computedClient } from "@/utils/utils";
import Router from "@/utils/router";
//逛逛顶部导航栏
export default (props) => {
  const { data = {} } = props;
  const { height } = data;
  const onChange = (item) => {
    let {
      param = "",
      jumpUrlType = "",
      jumpUrl = "",
      identification,
      payBeanCommission,
      resourceTemplateContentId,
    } = item;
    jumpUrl = (jumpUrl && JSON.parse(jumpUrl)) || {};
    const { weChatUrl = "" } = jumpUrl;
    console.log(weChatUrl, jumpUrl);
    if (jumpUrlType === "template") {
      Router({
        routerName: "wanderAround",
        args: {
          ...param,
          resourceTemplateContentId,
          payBeanCommission,
          identification,
        },
      });
    } else if (jumpUrlType === "native" && weChatUrl) {
      Router({
        routerName: weChatUrl,
        args: {
          payBeanCommission,
          identification,
          categoryId: param.categoryId || param.topCategoryId,
          ...param,
        },
      });
    } else if (jumpUrlType === "h5" && jumpUrl) {
      Router({
        routerName: "webView",
        args: {
          link: jumpUrl.split("?")[0],
          url: jumpUrl.split("?")[1] || "",
        },
      });
    } else return toast("该风向标无跳转路径");
  };
  return (
    <View
      onClick={() => onChange(data)}
      style={{
        height: Taro.pxTransform(height),
        position: "relative",
        zIndex: 10,
      }}
    ></View>
  );
};
