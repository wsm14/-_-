import React, { useState, useRef, useEffect, useMemo } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { ScrollView, Swiper, SwiperItem, Text, View } from "@tarojs/components";
import "./index.scss";
import {
  toast,
  backgroundObj,
  getLat,
  getLnt,
  GetDistance,
  navigateTo,
} from "@/common/utils";
import classNames from "classnames";
import { checkLocation } from "@/server/common";
const tabCity = (props) => {
  const { data, store } = props;
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState({});
  const [citys, setCity] = useState({});
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setResult(data);
    }
  }, [data]);
  useEffect(() => {
    if (Object.keys(result).length > 3) {
      const { city, adcode } = result;
      const city_code = adcode.slice(0, 4);
      checkLocations({ cityCode: city_code, city });
    }
  }, [result]);
  const checkLocations = (obj) => {
    checkLocation(obj, (res) => {
      const { cityStatus, cityName } = res;
      if (cityStatus === "1") {
        let cityData = Taro.getStorageSync("city");
        if (!cityData) {
          store.locationStore.setCity(cityName, obj.cityCode, 1);
          Taro.reLaunch({
            url: "/pages/index/lookAround/index",
          });
        } else if (
          cityData.cityCode !== obj.cityCode &&
          cityData.type !== "1"
        ) {
          console.log(3232131232);
          setCity({
            cityCode: obj.cityCode,
            cityName: cityName,
            type: 1,
          });
          setVisible(true);
        }
      }
    });
  };
  if (visible) {
    const { city } = result;
    return (
      <View catchMove className="tabCity_layer">
        <View className="tabCity_box">
          <View className="tabCity_box_content">
            <View className="tabCity_box_font1 color1 font28">
              您当前定位城市为
            </View>
            <View className="tabCity_box_font2 font32">{city}</View>
            <View className="tabCity_box_font3 font28  color1">
              是否确认切换？
            </View>
            <View className="tabCity_box_font4">
              <View
                className="tabCity_box_btn tabCity_box_btn1"
                onClick={() => {
                  Taro.setStorageSync("city", {
                    ...Taro.getStorageSync("city"),
                    type: "1",
                  });
                  setVisible(false);
                }}
              >
                暂时不
              </View>
              <View
                className="tabCity_box_btn tabCity_box_btn2"
                onClick={() => {
                  store.locationStore.setCity(
                    citys.cityName,
                    citys.cityCode,
                    citys.type
                  );
                  setVisible(false);
                  Taro.reLaunch({
                    url: "/pages/index/lookAround/index",
                  });
                }}
              >
                确定
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  } else return null;
};
export default tabCity;
