import React from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  computedPrice,
} from "@/utils/utils";
import Router from "@/utils/router";
export default ({ list, userInfo, name, categoryIds }) => {
  const template = (item, userInfo, linkTo) => {
    const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
    const {
      goodsName,
      goodsImg,
      oriPrice,
      realPrice,
      lnt,
      lat,
      merchantName,
      merchantLogo,
      specialActivityIdString,
      merchantPrice,
      merchantIdString,
    } = item;
    return (
      <View
        className="bubble_selectSpecal animated fadeIn"
        onClick={() => linkTo(specialActivityIdString, merchantIdString)}
      >
        <View
          style={backgroundObj(goodsImg)}
          className="bubble_image_box"
        ></View>
        <View className="bubble_content">
          <View className="bubble_title  font_hide">{goodsName}</View>
          <View className="bubble_select_user">
            <View
              className="bubble_select_userProfile merchant_dakale_logo"
              style={backgroundObj(merchantLogo)}
            ></View>
            <View className="bubble_select_userHide font_hide">
              <View className="bubble_select_merchantName font_hide">
                {merchantName}
              </View>
              <View className="bubble_hot_limit price_margin8">
                {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
              </View>
            </View>
          </View>
          <View className="shopInit_hotOld_price color1 font_hide">
            <View className="font18">原价:</View>
            <View className="font20 bold price_margin4 text_through">
              ¥{oriPrice}
            </View>
          </View>
          <View className="shopInit_real_price font_hide">
            <View className="font18 color1">优惠价:</View>
            <View className="font24 color1 bold price_margin4  real_max font_hide">
              ¥{realPrice}
            </View>
          </View>
          <View className="shopInit_new_bean">
            <View className="bean_getInfo shopInit_new_img"></View>
            <View className="shopInit_new_pay font_hide">
              ¥{computedPrice(realPrice, payBeanCommission)}
            </View>
          </View>
        </View>
      </View>
    );
  };
  return (
    <View className="bubble_goods_box">
      <View className="bubble_goods_title">
        <View className="bubble_goods_titleFont">附近特惠</View>
        {list.length > 5 && (
          <View
            className="bubble_goods_ourFont"
            onClick={() => {
              Router({
                routerName: "nearPerimeter",
                args: {
                  name,
                  categoryIds,
                  type: "good",
                },
              });
            }}
          >
            更多
          </View>
        )}
      </View>

      <ScrollView scrollX className="bubble_goods_content">
        {list.map((item, index) => {
          if (index < 5) {
            return template(item, userInfo, (activityId, merchantId) => {
              Router({
                routerName: "favourableDetails",
                args: {
                  specialActivityId: activityId,
                  merchantId: merchantId,
                },
              });
            });
          }
        })}
        {list.length > 5 && (
          <View className="bubble_move_box bubble_move_margin1">
            <View
              className="bubble_move_flex"
              onClick={() => {
                Router({
                  routerName: "nearPerimeter",
                  args: {
                    name,
                    categoryIds,
                    type: "good",
                  },
                });
              }}
            >
              <View className="bubble_move_icon"></View>
              <View className="bubble_move_font">查 看 更 多</View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
