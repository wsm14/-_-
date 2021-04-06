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
} from "@/common/utils";

import "./../index.scss";
export default ({ data = [], userInfo = {}, linkTo }) => {
  const memo = useMemo(() => {
    const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
    const template = (item) => {
      const {
        goodsId,
        goodsName,
        goodsImg,
        oriPrice,
        realPrice,
        lnt,
        lat,
        status,
        goodsType,
        merchantAddress,
        merchantName,
        merchantLogo,
        merchantId,
        specialActivityIdString,
        merchantPrice,
        discount,
        merchantIdString,
      } = item;
      return (
        <View
          className="lookAround_selectSpecal animated  fadeIn"
          onClick={() => linkTo(specialActivityIdString, merchantIdString)}
        >
          <View
            style={backgroundObj(goodsImg)}
            className="lookAround_image_box"
          ></View>
          <View className="lookAround_content">
            <View className="lookAround_title  font_noHide">{goodsName}</View>
            <View className="lookAround_bean_relbox">
              <View className="lookAround_bean_left">
                卡豆可抵 ¥{(realPrice * (payBeanCommission / 100)).toFixed(2)}
              </View>
              {shareCommission !== 0 && (
                <View className="lookAround_bean_right">
                  赚¥ {((realPrice-merchantPrice) * (shareCommission / 100)).toFixed(2)}
                </View>
              )}
            </View>
            <View className="lookAround_pay_price bold">
              <Text className="lookAround_price_text">¥ </Text>
              {realPrice}
            </View>

            <View className="lookAround_pay_bottom">
              <View className="lookAround_bottom_left">¥ {oriPrice}</View>
              <View className="lookAround_bottom_right">热卖中</View>
            </View>
          </View>
        </View>
      );
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
