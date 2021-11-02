import React, { useMemo } from "react";
import { View } from "@tarojs/components";
import NallStatus from "@/components/nullStatus";
import Waterfall from "@/components/waterfall";
import Taro from "@tarojs/taro";
import { selectShop } from "@/components/componentView/selectShop";
import "./../index.scss";
export default ({ data = [], userInfo = {}, linkTo, type }) => {
  const memo = useMemo(() => {
    const template = (item) => {
      return selectShop(item, userInfo, linkTo);
    };
    return (
      <View>
        <View className="lookAround_selectSpecal_box lookAround_selectSpecal_fPadding">
          {data.length > 0 ? (
            <Waterfall
              list={data}
              createDom={template}
              style={{ width: Taro.pxTransform(335) }}
            ></Waterfall>
          ) : (
            <NallStatus
              type={0}
              title={type === "follow" ? "还没有任何关注哦" : "暂无商品"}
            ></NallStatus>
          )}
        </View>
      </View>
    );
  }, [data, userInfo]);
  return memo;
};
