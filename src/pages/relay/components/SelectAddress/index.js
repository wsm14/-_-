import React, { useEffect } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { getLat, getLnt } from "@/common/utils";
import { checkLocation } from "@/server/common";
import "./index.scss";
export default (props) => {
  const { show = false, onClose } = props;
  const [data, setData] = useState([]);
  useEffect(() => {}, [show]);
  //   if (Object.keys(result).length > 3) {
  //     const { city, adcode } = result;
  //     const city_code = adcode.slice(0, 4);
  //     checkLocations({ cityCode: city_code, city });
  //   }
  // }, [result]);
};
