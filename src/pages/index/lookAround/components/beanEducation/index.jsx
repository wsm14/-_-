import React, { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import Taro, { useDidShow } from "@tarojs/taro";
import { fetchConfigWindVaneBySizeNew } from "@/server/common";
import { backgroundObj } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default () => {
  const [list, setList] = useState([]);
  useEffect(() => {
    fetchConfigWindVaneBySizeNew({
      type: "beanEducation",
    }).then((val) => {
      const { configWindVaneList = [] } = val;
      setList(configWindVaneList);
    });
  }, []);
  const data = [
    {
      icon: "beanEducation_icon_box beanEducation_icon1",
      fn: () => {
        Router({
          routerName: "blindIndex",
        });
      },
    },
    {
      icon: "beanEducation_icon_box beanEducation_icon2",
      fn: () => {
        Router({
          routerName: "beanWelfareZone",
          args: {
            mode: "telephoneCharges",
          },
        });
      },
    },
    {
      icon: "beanEducation_icon_box beanEducation_icon3",
      fn: () => {
        Router({
          routerName: "beanWelfareZone",
          args: {
            mode: "commerceGoods",
          },
        });
      },
    },
    {
      icon: "beanEducation_icon_box beanEducation_icon4",
      fn: () => {
        Router({
          routerName: "beanWelfareZone",
          args: {
            mode: "beanWelfare",
          },
        });
      },
    },
  ];
  if (list.length > 0) {
    return (
      <View className="beanEducation_box">
        {list.map((item, index) => {
          const { image } = item;
          return (
            <View
              className={data[index].icon}
              style={backgroundObj(image)}
              onClick={() => {
                let {
                  param = "",
                  jumpUrlNew,
                  jumpUrlType = "",
                  jumpUrl = "",
                } = item;
                param = (param && JSON.parse(param)) || {};
                jumpUrlNew = (jumpUrlNew && JSON.parse(jumpUrlNew)) || {};
                const { weChatUrl = "" } = jumpUrlNew;
                if (jumpUrlType === "native" && weChatUrl) {
                  Router({
                    routerName: weChatUrl,
                    args: {
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
                } else return;
              }}
            ></View>
          );
        })}
      </View>
    );
  } else return null;
};
// 头部卡豆显示区域
