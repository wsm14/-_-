import React from "react";
import { View, Text } from "@tarojs/components";
import {
  GetDistance,
  getLnt,
  getLat,
  backgroundObj,
  computedPrice,
} from "@/utils/utils";
export default ({
  data = {},
  userInfo = {},
  show = true,
  type = "fl",
  title = "秒杀价",
  gameFlag = false,
}) => {
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const template = () => {
    const {
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      lnt,
      lat,
      merchantPrice,
      commission,
    } = data;
    return (
      <View className="lookAround_template_specal animated  fadeIn">
        <View
          className="lookAround_template_img"
          style={backgroundObj(goodsImg)}
        >
          <View className="lookAround_template_limit">
            {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="lookAround_template_name font_hide">{goodsName}</View>
        {show && (
          <View className="lookAround_template_oldPrice color2 font_hide">
            <View className="font18">原价:</View>
            <View className="lookAround_template_priceMax font_hide font20 price_margin4 bold text_through">
              ¥{oriPrice}
            </View>
          </View>
        )}

        <View className="lookAround_template_price color1 font_hide">
          <View className="font18">
            {type === "fl" ? "福利价:" : "秒杀价:"}{" "}
          </View>
          <View className="lookAround_template_priceMax font_hide font20 price_margin4 bold">
            ¥{realPrice}
          </View>
        </View>

        <View className="lookAround_new_bean ">
          <View className="bean_getInfo lookAround_new_img"></View>
          <View className="lookAround_new_pay font_hide">
            ¥{computedPrice(realPrice, payBeanCommission)}
          </View>
        </View>
      </View>
    );
  };
  const template1 = () => {
    const {
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      lnt,
      lat,
      merchantPrice,
      commission,
    } = data;
    return (
      <View className="lookAround_template_specal1 animated  fadeIn">
        <View
          className="lookAround_template_img1"
          style={backgroundObj(goodsImg)}
        >
          <View className="lookAround_template_limit">
            {GetDistance(getLat(), getLnt(), lat, lnt)}
          </View>
        </View>
        <View className="lookAround_template_name1 font_hide">{goodsName}</View>
        {show && (
          <View className="lookAround_template_oldPrice color2 font_hide">
            <View className="font18">原价:</View>
            <View className="lookAround_template_priceMax font_hide font20 price_margin4 bold text_through">
              ¥{oriPrice}
            </View>
          </View>
        )}
        <View className="lookAround_template_price color1 font_hide">
          <View className="font18">{title} </View>
          <View className="lookAround_template_priceMax font_hide font20 price_margin4 bold">
            ¥{realPrice}
          </View>
        </View>

        <View className="lookAround_new_bean">
          <View className="bean_getInfo lookAround_new_img"></View>
          <View className="lookAround_new_pay font_hide">
            ¥{computedPrice(realPrice, payBeanCommission)}
          </View>
        </View>
        {shareCommission > 0 && (
          <View className="lookAround_bean_show font_hide  font18 color3">
            赚
            <Text className="bold">
              ¥{computedPrice(commission, shareCommission)}
            </Text>
          </View>
        )}
      </View>
    );
  };
  const template2 = () => {
    const {
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      merchantPrice,
      commission,
    } = data;
    return (
      <View className="lookAround_template_specal2 animated  fadeIn">
        <View
          className="lookAround_template_img2"
          style={backgroundObj(goodsImg)}
        ></View>
        <View className="lookAround_template_name2 font_hide">{goodsName}</View>
        {show && (
          <View className="lookAround_template_oldPrice color2 font_hide">
            <View className="font18">原价:</View>
            <View className="lookAround_template_priceMax font_hide font20 price_margin4 bold text_through">
              ¥{oriPrice}
            </View>
          </View>
        )}
        <View className="lookAround_template_price1 color1 font_hide">
          <View className="font18">{title} </View>
          <View className="lookAround_template_priceMax font_hide font20 price_margin4 bold">
            ¥{realPrice}
          </View>
        </View>

        <View className="lookAround_new_bean">
          <View className="bean_getInfo lookAround_new_img"></View>
          <View className="lookAround_new_pay font_hide">
            ¥{computedPrice(realPrice, payBeanCommission)}
          </View>
        </View>
      </View>
    );
  };
  if (gameFlag) {
    return template2();
  } else {
    if (title === "秒杀价") {
      return template();
    } else {
      return template1();
    }
  }
};
