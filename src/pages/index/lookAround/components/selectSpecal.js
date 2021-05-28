import React, { useMemo } from "react";
import { View, Text, Image, ScrollView } from "@tarojs/components";
import NallStatus from "@/components/nullStatus";
import Waterfall from "@/components/waterfall";
import Taro from "@tarojs/taro";
import {
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  setPeople,
  format,
} from "@/common/utils";
import { selectShop } from "@/components/componentView/selectShop";
import "./../index.scss";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const memo = useMemo(() => {
    const template = (item) => {
      return selectShop(item, userInfo, linkTo);
    };
    return (
      <View className="lookAround_selectSpecal_box">
        {data.length > 0 ? (
          <Waterfall
            list={data}
            createDom={template}
            style={{ width: Taro.pxTransform(335) }}
          ></Waterfall>
        ) : (
          <NallStatus type={0} title={"暂无商品"}></NallStatus>
        )}
      </View>
    );
  }, [data, userInfo]);
  return memo;
};
