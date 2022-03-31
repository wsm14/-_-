import React, { useEffect, useState } from "react";
import { View, Text } from "@tarojs/components";
import { backgroundObj, computedPrice } from "@/utils/utils";
import Taro from "@tarojs/taro";
import Waterfall from "@/components/waterfall";
import { templateNewShop } from "@/components/public_ui/newGoodsObj";
import classNames from "classnames";
import Router from "@/utils/router";
import "./index.scss";
export default ({ data, identification, configUserLevelInfo, list }) => {
  const { contentInfo } = data;
  const { topImg, image } = contentInfo;
  const tempalte = (item) => {
    const { payBeanCommission = 50 } = configUserLevelInfo;
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
      ownerIdString,
      commission,
    } = item;
    return (
      <View
        className={classNames("travel_shop", "animated fadeIn")}
        onClick={() =>
          Router({
            routerName: "favourableDetails",
            args: {
              specialActivityId: specialActivityIdString,
              merchantId: ownerIdString,
              identification,
            },
          })
        }
      >
        <View style={backgroundObj(goodsImg)} className="travel_shopImg"></View>
        <View className="travel_desc">
          <View className="travel_title  font_hide">{goodsName}</View>
          <View className="travel_userDetails font_hide"></View>
          <View className="travel_hotOld_price color1 font_hide">
            <View className="font20">原价:</View>
            <View className="font24 bold price_margin4 text_through">
              ¥{oriPrice}
            </View>
          </View>
          <View className="travel_real_price font_hide">
            <View className="font20 color1">优惠价:</View>
            <View className="font28 color1 bold price_margin4  real_max font_hide">
              ¥{realPrice}
            </View>
          </View>
          <View className="bottom_kol_info">
            <View className="bottom_kol_s">
              <View className="bottom_kol_bean">
                ¥{computedPrice(realPrice, payBeanCommission)}
              </View>
            </View>
          </View>
        </View>
        <View className="travel_new_btn">抢购</View>
      </View>
    );
  };
  return (
    <View className="listTemplate_box">
      <View
        className="listTemplate_banner"
        style={backgroundObj(topImg)}
      ></View>
      <View className="listTemplate_body">
        <View className="listTemplate_index_body"></View>
        <Waterfall
          noMargin={{ margin: 0 }}
          list={list.slice(0, 2)}
          createDom={(item) =>
            templateNewShop(item, configUserLevelInfo, identification)
          }
          setWidth={335}
          style={{ width: Taro.pxTransform(335) }}
        ></Waterfall>
        {image && (
          <View style={backgroundObj(image)} className="brandImg_box"></View>
        )}
        <View className="listTemplate_body_content">
          {list.map((item, index) => {
            if (index > 1) {
              return tempalte(item);
            }
            return null;
          })}
        </View>
      </View>
      <View className="dakale_logo">
        <View className="dakale_logo_image"></View>
      </View>
    </View>
  );
};
