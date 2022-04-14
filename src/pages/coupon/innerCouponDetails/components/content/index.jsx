/*券的为你推荐*/
import React, { useState, useRef, useEffect } from "react";
import { ScrollView, View } from "@tarojs/components";
import Router from "@/utils/router";
import Coupon from "@/components/public_ui/innerCoupon";
import "./index.scss";
export default ({ data }) => {
  const { platformGiftPackRelateList = [] } = data;
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    if (platformGiftPackRelateList.length > 3 && visible) {
      setVisible(false);
    }
  }, [platformGiftPackRelateList.length]);
  return (
    <View className="innerCouponDetails_content_box">
      <View className="innerCouponDetails_content_title">
        <View className="innerCouponDetails_content_titleLeft">礼包详情</View>
        <View
          className="innerCouponDetails_content_titleRight"
          onClick={() =>
            Router({
              routerName: "wraparound",
              args: { tabStatus: "platform" },
            })
          }
        >
          购买后可在「我的券包」中查看{" >"}
        </View>
      </View>
      <View className="innerCouponDetails_content_couponBox">
        {platformGiftPackRelateList.map((item, index) => {
          if (index < 3) {
            return <Coupon type={4} data={item}></Coupon>;
          } else {
            if (visible) {
              return <Coupon type={4} data={item}></Coupon>;
            } else {
              return null;
            }
          }
        })}
        {!visible && (
          <View
            onClick={() => setVisible(true)}
            className="innerCouponDetails_content_btn"
          ></View>
        )}
      </View>
    </View>
  );
};
