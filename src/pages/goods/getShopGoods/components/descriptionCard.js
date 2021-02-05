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
  } = data;
  orderDesc = JSON.parse(orderDesc);
  const { merchantImg, merchantName, merchantIdString, merchantId } = orderDesc;
  const goMerchant = (merchantId) => {
    navigateTo(
      `/pages/perimeter/merchantDetails/index?merchantId=${merchantId}`
    );
  };
  return (
    <View className="descriptionCard_title">
      <View className="descriptionCard_box">
        <View
          className="descriptionCard_merchant"
          onClick={() => goMerchant(merchantIdString || merchantId)}
        >
          <View
            className="descriptionCard_profile dakale_nullImage"
            style={merchantImg ? backgroundObj(merchantImg) : {}}
          ></View>
          <View className="descriptionCard_merchantTitle font_hide">
            {merchantName}
          </View>
          <View className="descriptionCard_goIcon"></View>
        </View>
        <View className="descriptionCard_dec">
          <View className="descriptionCard_discount">
            <View>订单金额</View>
            <View className="color1">¥ {totalFee}</View>
          </View>
          <View className="descriptionCard_discount discount_top">
            <View>卡豆抵扣</View>
            <View className="color1">
              -{beanFee}(¥ {' '+(beanFee / 100).toFixed(0)})
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
          <View className="color1">实付金额</View>
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
