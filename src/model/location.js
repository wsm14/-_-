import Taro from "@tarojs/taro";
import { observable } from "mobx";
import { getRestapiAddress } from "@/server/common";
import { resiApiKey, toast } from "@/common/utils";
const locationStore = observable({
  lat: 30.229271,
  lnt: 120.255384,
  cityName: Taro.getStorageSync("city").cityName || "杭州",
  cityCode: Taro.getStorageSync("city").cityCode || "3301",
  setLocation(latitude, longitude) {
    this.lat = latitude;
    this.lnt = longitude;
    if (!this.flag) {
      this.setDistrict(latitude, longitude);
    }
  },
  setDistrict(latitude, longitude) {
    this.flag = true;
    getRestapiAddress(
      {
        key: resiApiKey,
        location: `${longitude},${latitude}`,
      },
      (res) => {
        const { info, regeocode = {} } = res;
        if (info === "OK") {
          const { addressComponent = {} } = regeocode;
          const { adcode = "" } = addressComponent;
          Taro.setStorageSync("district-code", adcode.slice(0, 4));
        } else {
          this.flag = false;
          toast(info);
        }
      }
    );
  },
  setCity(cityName, cityCode, type) {
    this.cityName = cityName;
    this.cityCode = cityCode;
    Taro.setStorageSync("city", {
      cityCode: cityCode,
      cityName: cityName,
      type: type || "0",
    });
  },
});
export default locationStore;
