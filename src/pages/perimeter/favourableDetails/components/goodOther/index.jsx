import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { filterStrList } from "@/utils/utils";
import Router from "@/utils/router";
import "./index.scss";

export default (props) => {
  const { data } = props;
  const {
    goodsDesc,

    goodsDescImg,

    goodsType = "single",

    packageGroupObjects = [],

    richText,
  } = data;

  return (
    <>
      {/* 套餐 */}
      {goodsType === "package" && (
        <View className="shopdetails_shop_packageGroup">
          <View className="shopdetails_shop_groupTitle">套餐详情</View>
          {packageGroupObjects.map((item) => {
            const { packageGoodsObjects = [], groupName } = item;
            return (
              <View className="shopdetails_shop_package">
                <View className="shopdetails_package_title font_hide">
                  ·{groupName}（{packageGoodsObjects.length}）
                </View>
                {packageGoodsObjects.map((val) => {
                  const { goodsName, goodsNum, goodsPrice } = val;
                  return (
                    <View className="shopdetails_package_goods public_auto">
                      <View>
                        <Text className="shopdetails_package_width font_hide">
                          {goodsName}
                        </Text>
                        <Text>（{goodsNum}份）</Text>
                      </View>
                      <View>¥{goodsPrice}</View>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>
      )}

      {/* 商品详情 */}
      {(goodsDesc || goodsDescImg) && (
        <View className="shopdetails_shop_details">
          <View className="shopdetails_shop_merchantDetails">商品描述</View>
          {goodsDesc && (
            <View className="shopdetails_dec">
              <Text>{goodsDesc.replace(/\\n/g, "\n")}</Text>
            </View>
          )}
          <View className="shopdetails_Image">
            {goodsDescImg &&
              filterStrList(goodsDescImg).map((item) => {
                return (
                  <Image
                    mode="widthFix"
                    src={item}
                    onClick={() => {
                      Taro.previewImage({
                        urls: [item],
                      });
                    }}
                    style={{ width: "100%" }}
                  ></Image>
                );
              })}
          </View>
        </View>
      )}
      {richText && (
        <View className="shopdetails_shop_details">
          <View className="shopdetails_shop_merchantDetails">商品描述</View>
          <RichText
            nodes={richText}
            className="temPlateComment_desc"
          ></RichText>
        </View>
      )}
    </>
  );
};
