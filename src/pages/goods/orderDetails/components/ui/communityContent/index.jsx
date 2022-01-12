import React from "react";
import { Text, View } from "@tarojs/components";
import "./index.scss";
import { backgroundObj, filterPayfont, objStatus } from "@/utils/utils";
import Router from "@/utils/router";
export default (props) => {
  const { data = {}, hasMerchant = true } = props;
  let {
    payFee,
    beanFee,
    totalFee,
    status,
    communityOrganizationGoods = {},
  } = data;

  const { relateOwnerProfile, relateOwnerName, communityGoodsObjectList } =
    communityOrganizationGoods;
  const template = (item) => {
    const { goodsCount, goodsImg, goodsPrice, specificationData, goodsName } =
      item;
    const { specificationMap } = specificationData;
    return (
      <View className="community_box font_hide">
        <View
          className="community_img merchant_dakale_logo"
          style={backgroundObj(goodsImg)}
        ></View>
        <View className="community_content_box font_hide">
          <View className="community_content_text1  font_hide">
            {goodsName}
          </View>
          {Object.keys(specificationMap)[0] !== "" && (
            <View className="community_content_text2 font_hide">
              {Object.keys(specificationMap).join(",")}
            </View>
          )}
          <View className="community_content_text3 font_hide">
            数量：{goodsCount}
          </View>
        </View>
        <View className="community_content_price">
          <View className="font20">
            ¥ <Text className="font32 bold">{goodsPrice.split(".")[0]}</Text>
            <Text className="font24">
              {goodsPrice.split(".")[1] && `.${goodsPrice.split(".")[1]}`}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  return (
    <>
      <View className="descriptionCard_title">
        <View className="descriptionCard_box">
          <View className="descriptionCard_merchant">
            <View
              className="descriptionCard_profile merchant_dakale_logo"
              style={relateOwnerProfile}
            ></View>
            <View className="descriptionCard_merchantTitle font_hide">
              {relateOwnerName}
            </View>
          </View>
        </View>
        {communityGoodsObjectList.map((item) => {
          return template(item);
        })}
      </View>
      <View className="descriptionCard_community_box">
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
    </>
  );
};
