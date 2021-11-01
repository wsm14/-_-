import React, { useMemo } from "react";
import { View } from "@tarojs/components";
import NallStatus from "@/components/nullStatus";
import Waterfall from "@/components/waterfall";
import Taro from "@tarojs/taro";
import { gameShop } from "@/components/componentView/selectShop";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const memo = useMemo(() => {
    const template = (item) => {
      return gameShop(item, userInfo, linkTo);
    };
    return (
      <React.Fragment>
        <View className="lookAround_selectSpecal_Fliner"></View>
        <View
          style={{ paddingTop: Taro.pxTransform(24) }}
          className="lookAround_selectSpecal_box"
        >
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
      </React.Fragment>
    );
  }, [data, userInfo]);
  return memo;
};
