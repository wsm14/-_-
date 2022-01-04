import React from "react";
import { ScrollView, View, Text } from "@tarojs/components";
import { backgroundObj, computedPrice } from "@/utils/utils";
import Router from "@/utils/router";
export default (props) => {
  const { list, userInfo } = props;
  const { payBeanCommission = 50, shareCommission = 0 } = userInfo;
  const linkTo = (specialActivityId, ownerId) => {
    Router({
      routerName: "favourableDetails",
      args: {
        specialActivityId: specialActivityId,
        merchantId: ownerId,
      },
    });
  };
  const templateOwn = () => {
    return list.map((item) => {
      const {
        goodsId,
        goodsName,
        goodsImg,
        oriPrice,
        realPrice,
        lnt,
        lat,
        status,
        goodsType,
        merchantAddress,
        merchantName,
        merchantLogo,
        merchantIdString,
        specialActivityIdString,
        merchantPrice,
        ownerIdString,
      } = item;
      return (
        <View
          onClick={(e) => {
            e.stopPropagation();
            linkTo(specialActivityIdString, ownerIdString);
          }}
          className="templateOwn_box"
        >
          <View
            style={backgroundObj(goodsImg)}
            className="templateOwn_coverImg"
          ></View>
          <View className="templateOwn_content">
            <View className="templateOwn_content_name  font22 font_hide">
              {goodsName}
            </View>
            <View className="templateOwn_template_oldPrice color2 font_hide">
              <View className="font18 ">原价:</View>
              <View className="templateOwn_template_priceMax font_hide font20 price_margin4 bold text_through">
                ¥{oriPrice}
              </View>
            </View>
            <View className="templateOwn_template_price color1 font_hide">
              <View className="font18">优惠价:</View>
              <View className="templateOther_template_priceMax font_hide font24 price_margin4 bold">
                ¥{realPrice}
              </View>
            </View>
            <View className="templateOwn_new_bean ">
              <View className="bean_getInfo templateOwn_new_img"></View>
              <View className="templateOwn_new_pay font_hide">
                ¥{computedPrice(realPrice, payBeanCommission)}
              </View>
            </View>
          </View>
        </View>
      );
    });
  };
  const templateOther = () => {
    return (
      <ScrollView className="templateOther_scroll" scrollX>
        {list.map((item) => {
          const {
            goodsId,
            goodsName,
            goodsImg,
            oriPrice,
            realPrice,
            lnt,
            lat,
            status,
            goodsType,
            merchantAddress,
            merchantName,
            merchantLogo,
            merchantIdString,
            specialActivityIdString,
            merchantPrice,
            ownerIdString,
          } = item;
          return (
            <View
              className="templateOther_template_specal"
              onClick={(e) => {
                e.stopPropagation();
                linkTo(specialActivityIdString, ownerIdString);
              }}
            >
              <View
                className="templateOther_template_img"
                style={backgroundObj(goodsImg)}
              ></View>
              <View className="templateOther_template_name font_hide">
                {goodsName}
              </View>
              <View className="templateOther_template_oldPrice color2 font_hide">
                <View className="font18">原价:</View>
                <View className="templateOther_template_priceMax font_hide font20 price_margin4 bold text_through">
                  ¥{oriPrice}
                </View>
              </View>

              <View className="templateOther_template_price color1 font_hide">
                <View className="font18">优惠价: </View>
                <View className="templateOther_template_priceMax font_hide font24 price_margin4 bold">
                  ¥{realPrice}
                </View>
              </View>
              <View className="templateOther_new_bean ">
                <View className="bean_getInfo templateOther_new_img"></View>
                <View className="templateOther_new_pay font_hide">
                  ¥{computedPrice(realPrice, payBeanCommission)}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  };
  if (list.length === 1) {
    return templateOwn();
  } else if (list.length > 1) {
    return templateOther();
  }
  return null;
};
