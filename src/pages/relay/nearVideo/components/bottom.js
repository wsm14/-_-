import React, { useEffect, useMemo, useState } from "react";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import { useReady } from "@tarojs/taro";
import classNames from "classnames";
import { getDom, GetDistance, getLat, getLnt } from "@/common/utils";

import { mapGo } from "@/common/utils";

import "./../index.scss";
export default (props) => {
  const { server = {}, children, index, userInfo, current } = props;
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const [flag, setFlag] = useState({
    flagType: false,
    boolean: false,
  });
  const [showFlag, setShowFlag] = useState(false);

  useEffect(() => {
    let time = setTimeout(() => {
      computedFont();
      clearTimeout(time);
    }, 1);
  }, []);

  useEffect(() => {
    const { promotionIdString } = server;
    setShowFlag(false);
    if (promotionIdString && current === index) {
      let time = setTimeout(() => {
        clearTimeout(time);
        setShowFlag(true);
      }, 3000);
    }
  }, [current]);
  const { flagType, boolean } = flag;
  const {
    message,
    cityName,
    categoryName,
    lat,
    lnt,
    merchantAddress,
    merchantLnt,
    merchantLat,
    username,
  } = server;
  const descView = () => {
    if (flagType && boolean) {
      return (
        <ScrollView
          scrollY
          className={classNames(
            `home_bottom_decBox`,
            `home_bottom_decBox${index}
            home_bottom_auto`
          )}
        >
          {message}
        </ScrollView>
      );
    } else {
      return (
        <View
          onClick={() => {
            updateDec();
          }}
          className={classNames(
            `home_bottom_decBox`,
            `home_bottom_decBox${index}`,
            flagType && !boolean && "font_noHide"
          )}
        >
          {message}
        </View>
      );
    }
  };
  const computedFont = () => {
    getDom(`.home_bottom_decBox${index}`, (res) => {
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
      <View className="home_username font_hide">@{username}</View>
      {descView()}
      <View className="home_desc_coll public_auto">
        <View
          className="color6 home_desc_city"
          onClick={() =>
            mapGo({
              lat: lat,
              lnt: lnt,
              address: merchantAddress,
              merchantName: username,
            })
          }
        >
          <View className="home_city_icon"></View>
          <View className="home_desc_text font_hide">
            {cityName}·{categoryName}｜
            {GetDistance(
              getLat(),
              getLnt(),
              merchantLat || lat,
              merchantLnt || lnt
            )}
            ｜{merchantAddress}
          </View>
        </View>
      </View>
    </View>
  );
};
