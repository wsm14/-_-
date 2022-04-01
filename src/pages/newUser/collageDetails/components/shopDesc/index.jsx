import React, { useEffect, useState } from "react";
import { View, Text, Image } from "@tarojs/components";
import { backgroundObj, filterStrList } from "@/utils/utils";
import Taro from "@tarojs/taro";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data }) => {
  const { goodsDescImg, goodsDesc } = data;
  if (goodsDesc || goodsDescImg) {
    return (
      <View className="collageTime_shopDesc_box">
        <View className="collageTime_shopDesc_title">
          <View className="collageTime_desc_linerLeft"></View>
          <View className="collageTime_desc_titleDont">商品详情</View>
          <View className="collageTime_desc_linerRight"></View>
        </View>
        {(goodsDesc || goodsDescImg) && (
          <View className="collageTime_shop_details">
            {goodsDesc && (
              <View className="collageTime_dec">
                <Text>{goodsDesc.replace(/\\n/g, "\n")}</Text>
              </View>
            )}
            <View className="collageTime_Image">
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
      </View>
    );
  } else {
    return null;
  }
};
