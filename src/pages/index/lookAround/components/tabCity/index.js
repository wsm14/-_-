import React, { useState, useRef, useEffect, useMemo } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import {
  toast,
  backgroundObj,
  getLat,
  getLnt,
  GetDistance,
  navigateTo,
} from "@/common/utils";
import "./index.scss";
const tabCity = (props) => {
  const { data, store, reload } = props;
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState({});
  const [citys, setCity] = useState({});
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setResult(data);
    }
  }, [data]);
  useEffect(() => {
    console.log(result);
    if (Object.keys(result).length > 3) {
      const { city, adcode } = result;
      const city_code = adcode.slice(0, 4);
      checkLocations({ cityCode: city_code, city });
    }
  }, [result]);
  const checkLocations = (obj) => {
    const { city } = obj;
    let relData = Taro.getStorageSync("relCity");
    let cityData = Taro.getStorageSync("cityData") || {};
    if (!relData) {
      store.locationStore.setCity(city, obj.cityCode, 1);
      Taro.setStorageSync("relCity", {
        cityCode: obj.cityCode,
        cityName: city,
      });
      reload();
    } else if (
      relData.cityCode !== obj.cityCode &&
      relData.cityCode !== cityData.cityCode
    ) {
      Taro.setStorageSync("relCity", {
        cityCode: obj.cityCode,
        cityName: city,
      });
      setCity({
        cityName: city,
        cityCode: obj.cityCode,
      });
      setVisible(true);
    } else {
    }
  };
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        if (visible) {
          Taro.setStorageSync("relCity", {
            ...Taro.getStorageSync("relCity"),
            type: 1,
          });
          setVisible(false);
        }
      }, 15000);
    }
  }, [visible]);
  if (visible) {
    const { city } = result;
    return (
      <View catchMove className="tabCity_layer">
        <View className="tabCity_layer_font">定位显示你在{city}</View>
        <View
          className="tabCity_layer_btn public_center"
          onClick={() => {
            store.locationStore.setCity(
              citys.cityName,
              citys.cityCode,
              citys.type
            );
            Taro.setStorageSync("relCity", {
              cityCode: citys.cityCode,
              cityName: city,
            });
            setVisible(false);
            reload();
          }}
        >
          切换{city}
        </View>
        <View
          className="tabCity_layer_close"
          onClick={() => {
            Taro.setStorageSync("relCity", {
              ...Taro.getStorageSync("relCity"),
              type: 1,
            });
            setVisible(false);
          }}
        ></View>
      </View>
    );
  } else return null;
};
export default tabCity;
