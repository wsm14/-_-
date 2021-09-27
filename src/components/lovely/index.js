import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import Taro, { useReachBottom } from "@tarojs/taro";
import { shopDetails } from "@/components/publicShopStyle";
import { getGoodsByMerchantId } from "@/server/perimeter";
import Waterfall from "@/components/waterfall";
import { toast } from "@/common/utils";
import classNames from "classnames";
import "./index.scss";
export default (props) => {
  const { title } = props;
  const [data, setData] = useState([]);
  const [httpData, setHttpData] = useState({
    page: 1,
    limit: 10,
  });
  const [count, countType] = useState(true);
  useEffect(() => {
    if (count) {
      getLovely();
    } else {
    }
  }, [httpData]);
  useReachBottom(() => {
    getDown();
  });
  const getLovely = () => {
    getGoodsByMerchantId(httpData, (res) => {
      const { specialGoodsList } = res;
      if (specialGoodsList && specialGoodsList.length > 0) {
        setData([...data, ...specialGoodsList]);
      } else {
        countType(false);
      }
    });
  };
  const getDown = () => {
    if (count) {
      setHttpData({
        ...httpData,
        page: httpData.page + 1,
      });
    } else return ;
  };
  if (data.length > 0) {
    return (
      <View className="lovely_box">
        <View className="color1 font28 lovely_title">
          - {title || "小伙伴们还喜欢"} -
        </View>
        <View className="love_shop">
          <Waterfall
            list={data}
            createDom={shopDetails}
            setWidth={335}
            style={{ width: Taro.pxTransform(335) }}
          ></Waterfall>
        </View>
      </View>
    );
  }
  return null;
};
