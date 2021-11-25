import React from "react";
import { Text, View } from "@tarojs/components";
import "./../index.scss";
import { backgroundObj, navigateTo } from "@/common/utils";
export default (props) => {
  const { data = {} } = props;
  let {
    orderDesc = {},
    payFee,
    beanFee,
    totalFee,
    deductFeeObject = [],
    orderType,
    status,
  } = data;
  orderDesc = JSON.parse(orderDesc);
  return (
    <View className="descriptionCard_title">
      <View className="descriptionCard_box">
        <View className="descriptionCard_dec">
          <View className="descriptionCard_discount">
            <View>订单金额</View>
            <View className="color1">¥ {totalFee}</View>
          </View>
          <View className="descriptionCard_discount discount_top">
            <View className="color3">卡豆帮省</View>
            <View className="color3">
              -{beanFee}(¥ {" " + (beanFee / 100).toFixed(2)})
            </View>
          </View>
          {deductFeeObject.length > 0 && (
            <View className="descriptionCard_discount discount_top">
              <View>优惠券</View>
              <View className="color1">¥{deductFeeObject[0].reduceFee}</View>
            </View>
          )}
        </View>
        <View className="descriptionCard_liner"></View>
        <View className="descriptionCard_payPrice">
          <View className="color1">
            {status === "1" || status === "3" || status === "6"
              ? "实付金额"
              : "待付金额"}
          </View>
          <View className="color3 font20">
            ¥ <Text className="font40 bold">{payFee.split(".")[0]}</Text>
            <Text className="font28">
              {payFee.split(".")[1] && `.${payFee.split(".")[1]}`}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
