import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj } from "@/utils/utils";
import Taro from "@tarojs/taro";
import Waterfall from "@/components/waterfall";
import { templateNewShop } from "@/components/public_ui/newGoodsObj";
import "./index.scss";
export default ({ data, identification, configUserLevelInfo, list }) => {
  const { contentInfo } = data;
  const { topImg } = contentInfo;
  return (
    <View className="listTemplate_box">
      <View
        className="listTemplate_banner"
        style={backgroundObj(topImg)}
      ></View>
      <View className="listTemplate_body">
        {list.map((item) => {
          const { activityGoodsList = [], brandImg } = item;
          return (
            <View>
              <View
                style={backgroundObj(brandImg)}
                className="brandImg_box"
              ></View>
              <Waterfall
                noMargin={{ margin: 0 }}
                list={activityGoodsList}
                createDom={(item) =>
                  templateNewShop(item, configUserLevelInfo, identification)
                }
                setWidth={335}
                style={{ width: Taro.pxTransform(335) }}
              ></Waterfall>
            </View>
          );
        })}
      </View>
      <View className="dakale_logo">
        <View className="dakale_logo_image"></View>
      </View>
    </View>
  );
};
