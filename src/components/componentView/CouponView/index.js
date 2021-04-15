/*
店铺详情优惠券公共样式

*/
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";
export const coupon = (data) => {
  const {} = data;
  const templateBtn = () => {
    
  }
  const template = () => {
  
    if ((a = 0)) {
      return (
        <View className="coupon_view_box coupon_view_checkColor">
          <View className="coupon_view_child">
            <View className="coupon_view_title font_hide color1">100元抵扣券</View>
            <View className="coupon_view_content color2">满60元可用｜每人限购3张</View>
            <View className="coupon_view_bottom">
              <Text className="coupon_view_priceIcon color3">¥ </Text>
              <Text className="coupon_view_price color3">25 </Text>
              <Text className="coupon_view_noFont color7">¥100</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View className="coupon_view_box coupon_view_nullCheckColor color7">
          <View className="coupon_view_child">
            <View className="coupon_view_title font_hide">100元抵扣券</View>
            <View className="coupon_view_content">满60元可用｜每人限购3张</View>
            <View className="coupon_view_bottom">
              <Text className="coupon_view_priceIcon">¥ </Text>
              <Text className="coupon_view_price">25 </Text>
              <Text className="">¥100</Text>
            </View>
          </View>
        </View>
      );
    }
  };
};
