import Taro from "@tarojs/taro";
import { observable } from "mobx";
const locationStore = observable({
  lat: 30.229271,
  lnt: 120.255384,
  cityName: Taro.getStorageSync("city").cityName || "杭州",
  cityCode: Taro.getStorageSync("city").cityCode || "3301",
  setLocation(latitude, longitude) {
    this.lat = latitude;
    this.lnt = longitude;
  },
  setCity(cityName, cityCode, type) {
    this.cityName = cityName;
    this.cityCode = cityCode;
    Taro.setStorageSync("city", {
      cityCode: cityCode,
      cityName: cityName,
      type: type||'0',
    });
  },
});
export default locationStore;
