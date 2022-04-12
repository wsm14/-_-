/*券的为你推荐*/
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View, Button } from "@tarojs/components";
import Taro, { useDidShow, useShareAppMessage, useRouter } from "@tarojs/taro";
import { fetchNewShareInfo } from "@/server/common";
import "./index.scss";
export default ({ data }) => {
  const [shareData, setShareData] = useState({});
  const routeParams = useRouter().params;
  const { platformGiftId } = routeParams;
  useDidShow(() => {
    fetchNewShareInfo({
      shareType: "platformGift",
      giftId: platformGiftId,
    }).then((val) => {
      const { shareInfo = {} } = val;
      setShareData(shareInfo);
    });
  });
  useShareAppMessage((res) => {
    const { miniProgramUrl, miniProgramImage, contentBody } = shareData;
    const data = {
      title: contentBody,
      imageUrl: miniProgramImage,
      path: `/${miniProgramUrl}`,
    };
    if (res.from === "button") {
      return data;
    } else {
      return data;
    }
  });
  const { giftName, buyPrice } = data;
  return (
    <View className="innerCouponDetails_top">
      <View className="innerCouponDetails_share">
        <Button
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            border: "none",
            background: "none",
          }}
          openType={"share"}
        ></Button>
      </View>
      <View className="innerCouponDetails_banner_height">
        <View className="innerCouponDetails_banner_box">
          <View className="innerCouponDetails_banner_desc">
            <View className="innerCouponDetails_banner_title1 font_hide">
              {giftName}
            </View>
            <View className="innerCouponDetails_banner_title2 font_hide">
              仅需{buyPrice}元
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
