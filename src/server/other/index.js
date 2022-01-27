import { httpOtherGet } from "@/utils/request";
export const getRestapiAddress = (data, fn) => {
  httpOtherGet(
    {
      data: data,
      url: "https://restapi.amap.com/v3/geocode/regeo/",
    },
    (res) => {
      return fn(res);
    }
  );
};
//获取高德城市定位信息
export const getRestapiCode = (data, fn) => {
  httpOtherGet(
    {
      data: data,
      url: "https://restapi.amap.com/v3/geocode/geo",
    },
    (res) => {
      return fn(res);
    }
  );
};
//获取高德城市定位信息
