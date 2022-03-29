import React, { useMemo } from "react";
import { View } from "@tarojs/components";
import Waterfall from "@/components/waterfall";
import Taro from "@tarojs/taro";
import { template } from "@/components/public_ui/newGoodsObj";
import Empty from "@/components/Empty";
import "./../index.scss";
export default ({ data = [], linkTo, type, listObj }) => {
  const { payBeanCommission, identification } = listObj;
  const memo = useMemo(() => {
    return (
      <View>
        <View className="lookAround_selectSpecal_box lookAround_selectSpecal_fPadding">
          {data.length > 0 ? (
            <Waterfall
              list={data}
              createDom={(item) =>
                template(item, { payBeanCommission }, identification)
              }
              style={{ width: Taro.pxTransform(335) }}
            ></Waterfall>
          ) : (
            <Empty
              show={data.length === 0}
              type={"shop"}
              toast={type === "follow" ? "还没有任何关注哦" : "暂无商品"}
            ></Empty>
          )}
        </View>
      </View>
    );
  }, [data, listObj]);
  return memo;
};
