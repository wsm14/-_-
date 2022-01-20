import React from "react";
import { Text, View } from "@tarojs/components";
import "./index.scss";
import { backgroundObj, filterPayfont } from "@/utils/utils";
import Router from "@/utils/router";
export default (props) => {
  const { data = {}, hasMerchant = true } = props;
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
  console.log(orderDesc);
  const { merchantImg, merchantName, merchantIdString, merchantId } = orderDesc;
  const goMerchant = (merchantId) => {
    Router({
      routerName: "merchantDetails",
      args: {
        merchantId: merchantId,
      },
    });
  };
  return (
    <View className="descriptionCard_title">
      <View className="descriptionCard_box">
        {hasMerchant && (
          <View
            className="descriptionCard_merchant"
            onClick={() => goMerchant(merchantIdString || merchantId)}
          >
            <View
              className="descriptionCard_profile merchant_dakale_logo"
              style={merchantImg ? backgroundObj(merchantImg) : {}}
            ></View>
            <View className="descriptionCard_merchantTitle font_hide">
              {orderType === "platformGift" ? "哒卡乐官方号" : merchantName}
            </View>
            <View className="descriptionCard_goIcon"></View>
          </View>
        )}

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
          <View className="color1">{filterPayfont(status)}金额</View>
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
