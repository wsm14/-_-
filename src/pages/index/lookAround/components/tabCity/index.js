import React, { useState, useRef, useEffect, useMemo } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
//逛逛 定位陌生城市自动切换
const tabCity = (props) => {
  const { data, store, reload } = props;
  const [visible, setVisible] = useState(false);
  //是否显示提示框
  const [result, setResult] = useState({});
  //请求的高德数据
  const [citys, setCity] = useState({});
  //设置城市
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
