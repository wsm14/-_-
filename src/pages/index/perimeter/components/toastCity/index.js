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
const link1 =
  "https://web-new.dakale.net/product/page/policy/cooperation.html?shareUserId=12312311&shareUserType=1231232";
const toastCity = (props) => {
  const { data, store } = props;
  const [visible, setVisible] = useState(false);
  const [citys, setCity] = useState({});
  const [result, setResult] = useState({
    ad_info: {},
    address: {},
    address_component: {},
  });
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
      // city_code = 3302;
      checkLocations({ cityCode: city_code,city});
    }
  }, [result]);
  const checkLocations = (obj) => {
    checkLocation(obj, (res) => {
      const { cityStatus, cityName } = res;
      if (cityStatus === "0") {
        let cityData = Taro.getStorageSync("city");
        if (!cityData || cityData.cityCode !== obj.cityCode) {
          setVisible(true);
        }
      }
    });
  };
  if (visible) {
    const {
      address_component: { city = "" },
    } = result;
    return (
      <View catchMove className="toastCity_layer">
        <View className="toastCity_box">
          <View className="toastCity_box_content">
            <View className="toastCity_font1 color1  font28  bold">
              您当前定位城市为
            </View>
            <View className="toastCity_font2 font32">{city}</View>
            <View className="toastCity_font3 font28 color1 bold">
              暂未开通，可前往切换城市
            </View>
            <View className="toastCity_font4 font32">切换城市</View>
            <View className="toastCity_font5 color2 font28">
              加盟哒卡乐开通当前城市
            </View>
            <View
              className="toastCity_font6 font28"
              onClick={() =>{
                setVisible(false)
                navigateTo(
                  `/pages/share/webView/index?link=${link1}&title=${"我要合作"}`
                )
              } 
              }
            >
              我要合作{" >"}
            </View>
          </View>
        </View>
      </View>
    );
  } else return null;
};
export default toastCity;
