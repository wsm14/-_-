import React, { useEffect, useState } from "react";
import { View, Image, Text } from "@tarojs/components";
import { useReady } from "@tarojs/taro";
import classNames from "classnames";
import { getDom, GetDistance, getLat, getLnt } from "@/common/utils";
import Taro from "@tarojs/taro";
import "./../index.scss";
export default (props) => {
  const { server = {}, list = [], children } = props;
  const [flag, setFlag] = useState({
    flagType: false,
    boolean: false,
  });
  const [data, setData] = useState({});

  useEffect(() => {
    setData(server);
  }, [server]);

  useEffect(() => {
    setTimeout(() => computedFont(), 1);
  }, [data]);
  const { flagType, boolean } = flag;
  const { message, cityName, categoryName, lat, lnt, address } = data;
  // console.log(data);
  const activeView = (data, type = "coupon") => {
    const couponType = {
      coupon:
        "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/image/coupon_sm.png",
    }[type];
    return (
      <View className="home_active_box">
        <View className="home_active_image">
          <Image
            style={{
              width: "100%",
              height: "100%",
              borderRadius: Taro.pxTransform(4),
            }}
            mode={"aspectFit"}
            src={couponType}
          />
        </View>
        <View className="home_active_details">
          <View className="home_active_font1  font_hide">A级砂糖橘1斤</View>
          <View className="home_active_font2 font_hide">
            专享特价 <Text className={"font20 color3"}>¥ </Text>{" "}
            <Text className={"font28 color3 bold"}>3.99 </Text>
          </View>
        </View>
        <View className="home_active_btn">立即抢购</View>
      </View>
    );
  };
  const descView = () => {
    return (
      <View
        className={classNames(
          "home_bottom_decBox",
          flagType && !boolean && "font_noHide",
          boolean && "home_bottom_auto"
        )}
      >
        {message}
      </View>
    );
  };
  const computedFont = () => {
    getDom(".home_bottom_decBox", (res) => {
      if (res[0]) {
        const { height } = res[0];
        if (height > 46) {
          setFlag({
            flagType: true,
            boolean: false,
          });
        } else {
          setFlag({
            flagType: false,
            boolean: false,
          });
        }
      }
    });
  };
  const updateDec = () => {
    setFlag({
      ...flag,
      boolean: !boolean,
    });
  };

  return (
    <View className="home_bottom">
      {children}
      {activeView()}
      {descView()}
      <View className="home_desc_coll public_auto">
        <View className="color6 home_desc_city font_hide">
          {cityName}·{categoryName}｜{" "}
          {GetDistance(getLat(), getLnt(), lat, lnt)}｜{address}
        </View>
        {flagType && (
          <View className="" onClick={() => updateDec()}>
            {!boolean ? "展开" : "收起"}
          </View>
        )}
      </View>
    </View>
  );
};
