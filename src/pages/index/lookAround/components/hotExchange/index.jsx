import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj, computedBeanPrice } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  const [listObj, setListObj] = useState({});

  useEffect(() => {
    setListObj(
      data.reduce((item, val) => {
        if (val.moduleName === "limitedTimeHotMixing") {
          return val;
        } else return item;
      }),
      {}
    );
  }, [data]);
  const {
    activityGoodsObjectList = [],
    identification,
    payBeanCommission,
    resourceTemplateContentId,
  } = listObj;

  const template = (item) => {
    const {
      activityGoodsId,
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      ownerId,
      paymentModeObject = {},
    } = item;
    const { bean = 0, cash = 0, type = "defaultMode" } = paymentModeObject;
    const templateOther = () => {
      if (type === "self") {
        return (
          <>
            <View className="hotExchange_price font_hide">
              <View className="hotExchange_rel font_hide">
                <Text className="font_24">¥</Text>¥{cash}{" "}
                {bean ? `+${bean}卡豆` : ""}
              </View>
            </View>
            <View className="hotExchange_bean">
              <View className="hotExchange_bean_info public_center">
                {oriPrice}
              </View>
            </View>
          </>
        );
      } else {
        return (
          <>
            <View className="hotExchange_price font_hide">
              <View className="hotExchange_rel font_hide">
                <Text className="font_24">¥</Text>
                {realPrice}
              </View>
              <View className="hotExchange_old price_margin4">
                ¥ {oriPrice}
              </View>
            </View>
            <View className="hotExchange_bean">
              <View className="hotExchange_bean_info public_center">
                {computedBeanPrice(realPrice, 100 - payBeanCommission)}
              </View>
            </View>
          </>
        );
      }
    };
    return (
      <View className="hotExchange_template">
        <View
          style={backgroundObj(goodsImg)}
          className="hotExchange_profile"
        ></View>
        <View className="hotExchange_content">
          <View className="hotExchange_name font_hide">{goodsName}</View>
          {templateOther()}
        </View>
        <View className="hotExchange_btn public_center">抢购</View>
      </View>
    );
  };
  return (
    <View
      className="hotExchange_box"
      onClick={() =>
        Router({
          routerName: "wanderAround",
          args: {
            type: "hotExchange",
            identification: identification,
            resourceTemplateContentId,
            payBeanCommission,
          },
        })
      }
    >
      <View className="hotExchange_title">
        <View className="hotExchange_link">领取更多</View>
      </View>
      {activityGoodsObjectList.map((item, index) => {
        if (index < 2) {
          return template(item);
        } else {
          return null;
        }
      })}
    </View>
  );
};
