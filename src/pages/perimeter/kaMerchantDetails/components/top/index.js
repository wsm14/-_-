import React from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  mapGo,
} from "@/common/utils";
export default ({ data }) => {
  const { mainImages, logoImg, merchantName, groupName, lat, lnt, address } =
    data;
  console.log(data);
  return (
    <View class="kaMerchantDetails_bg">
      <View className="kaMerchantDetails_bg_gs">
        <Image src={mainImages} className="kaMerchantDetails_bg_gsImge"></Image>
        <View className="kaMerchantDetails_gs"></View>
      </View>
      <View className="kaMerchantDetails_top_box">
        <View className="kaMerchantDetails_top_content">
          <View
            className="kaMerchantDetails_top_profile merchant_dakale_logo"
            style={backgroundObj(logoImg)}
          ></View>
          <View className="kaMerchantDetails_top_body">
            <View className="kaMerchantDetails_top_nameBox">
              <View className="kaMerchantDetails_top_name font_hide">
                {groupName}
              </View>
              <View className="kaMerchantDetails_top_icon"></View>
            </View>

            {lat && lnt ? (
              <View
                onClick={() => {
                  mapGo({
                    lat,
                    lnt,
                    address,
                    merchantName,
                  });
                }}
                className="kaMerchantDetails_top_addressBox"
              >
                <View className="kaMerchantDetails_top_address">
                  <Text className="kaMerchantDetails_top_addressMax font_hide">
                    {"附近 " + merchantName}
                  </Text>
                </View>
                <View className="font_hide">
                  {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
                </View>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
