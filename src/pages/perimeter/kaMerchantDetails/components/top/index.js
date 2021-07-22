import React from "react";
import Taro from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
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
      </View>
      <View className="kaMerchantDetails_top_box">
        <View className="kaMerchantDetails_top_content">
          <View
            className="kaMerchantDetails_top_profile merchant_dakale_logo"
            style={backgroundObj(logoImg)}
          ></View>
          <View className="kaMerchantDetails_top_body">
            <View className="kaMerchantDetails_top_name font_hide">
              {groupName}
            </View>
            {lat && lnt ? (
              <View
                className="kaMerchantDetails_top_address font_hide"
                onClick={() => {
                  mapGo({
                    lat,
                    lnt,
                    address,
                    merchantName,
                  });
                }}
              >
                {"附近 " +
                  merchantName +
                  " | " +
                  GetDistance(getLat(), getLnt(), lat, lnt)}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};
