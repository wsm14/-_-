import React, { useMemo } from "react";
import { View } from "@tarojs/components";
import Waterfall from "@/components/waterfall";
import Taro from "@tarojs/taro";
import { gameShop } from "@/components/public_ui/selectSpecal";
import Empty from "@/components/Empty";
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
            <Empty
              show={data.length === 0}
              type={"shop"}
              toast={"暂无商品"}
            ></Empty>
          )}
        </View>
      </React.Fragment>
    );
  }, [data, userInfo]);
  return memo;
};
