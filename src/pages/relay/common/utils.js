import { toast } from "@/common/utils";
import cityJson from "./cityJson";
const getCityName = (code) => {
  const cityIndex = cityJson.findIndex((item) => item.id === code);
  return cityJson[cityIndex].name;
};

// 根据城市code获取城市名称
export const checkCityName = (code) => {
  if (!code) return null;
  const codeStr = `${code}`;
  if (codeStr.length === 2) {
    return getCityName(codeStr);
  } else if (codeStr.length === 4) {
    return [getCityName(codeStr.slice(0, 2)), getCityName(codeStr)];
  } else if (codeStr.length === 6) {
    return [
      getCityName(codeStr.slice(0, 2)),
      getCityName(codeStr.slice(0, 4)),
      getCityName(codeStr),
    ];
  }
};
export const filterFrom = (rule, data) => {
  let falg = false;
  Object.keys(rule).forEach((item) => {
    if (!falg) {
      if (data[item] === null || !data[item]) {
        toast(rule[item]);
        falg = true;
      }
    } else {
      return;
    }
  });
};
