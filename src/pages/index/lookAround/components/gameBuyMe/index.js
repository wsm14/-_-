import React, { useState, useEffect, useMemo } from "react";
import { View } from "@tarojs/components";
import Waterfall from "@/components/waterfall";
import Taro from "@tarojs/taro";
import { templateGame } from "@/components/public_ui/newGoodsObj";
import Empty from "@/components/Empty";
export default ({ data = [], linkTo, list }) => {
  const [listObj, setListObj] = useState({});
  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "selfTour") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);
  const { payBeanCommission, identification } = listObj;
  const memo = useMemo(() => {
    const template = (item) => {
      return templateGame(item, { payBeanCommission }, identification);
    };
    return (
      <React.Fragment>
        <View className="lookAround_selectSpecal_Fliner"></View>
        <View
          style={{ paddingTop: Taro.pxTransform(24) }}
          className="lookAround_selectSpecal_box"
        >
          {list.length > 0 ? (
            <Waterfall
              list={list}
              createDom={template}
              style={{ width: Taro.pxTransform(335) }}
            ></Waterfall>
          ) : (
            <Empty
              show={list.length === 0}
              type={"shop"}
              toast={"暂无商品"}
            ></Empty>
          )}
        </View>
      </React.Fragment>
    );
  }, [data, list, listObj]);
  return memo;
};
