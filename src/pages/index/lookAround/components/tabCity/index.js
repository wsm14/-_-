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
  const [result, setResult] = useState({
    ad_info: {},
    address: {},
    address_component: {},
  });
  const [citys, setCity] = useState({});
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setResult(data);
    }
  }, [data]);
  useEffect(() => {
    if (Object.keys(result).length > 3) {
      let {
        ad_info: { city_code, nation_code },
        address_component: { city },
      } = result;
      city_code = city_code.slice(3, 7);
      checkLocations({ cityCode: city_code, city });
    }
  }, [result]);
  const checkLocations = (obj) => {
    checkLocation(obj, (res) => {
      const { cityStatus, cityName } = res;
      if (cityStatus === "1") {
        let cityData = Taro.getStorageSync("city");
        if (
          ((!cityData && obj.cityCode !== "3301") ||
            (cityData.cityCode !== obj.cityCode && cityData)) &&
            cityData.type !== "1"
        ) {
          setCity({
            cityCode: obj.cityCode,
            cityName: obj.city.slice(0, obj.city.length - 1),
            type: "1",
          });

          // Taro.setStorageSync("city", {
          //   cityCode: obj.cityCode,
          //   cityName: obj.city,
          // });
          setVisible(true);
        }
      }
    });
  };
  if (visible) {
    const {
      address_component: { city },
    } = result;
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
