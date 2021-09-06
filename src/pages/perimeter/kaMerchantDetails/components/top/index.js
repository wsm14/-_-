import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import Banner from "@/components/banner";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  mapGo,
  filterStrList,
  getDom,
  computedSize,
} from "@/common/utils";
import classNames from "classnames";
import Router from "@/common/router";
export default ({ data }) => {
  const {
    mainImages,
    logoImg,
    merchantName,
    groupName,
    lat,
    lnt,
    address,
    brandPublicityImage = "",
    merchantGroupIdString,
    brandLogo,
    brandStory = "",
  } = data;
  const [visible, setVisible] = useState(false);
  const [visibleBtn, serVisibleBtn] = useState(null);
  useEffect(() => {
    Taro.nextTick(() => {
      getDom(".brand_details_childDesc", (res = []) => {
        console.log(res);
        if (res.length > 0) {
          if (res[0].height > computedSize(70)) {
            serVisibleBtn(true);
          } else {
            return;
          }
        }
      });
    });
  }, [data]);
  return (
    <View className="kaMerchantDetails_new_infoBox">
      <View class="kaMerchantDetails_bg">
        <Banner
          autoplay={
            filterStrList(brandPublicityImage).length > 1 ? true : false
          }
          imgStyle
          showNear
          data={filterStrList(brandPublicityImage) || []}
          style={{ width: "100%", height: "100%" }}
          boxStyle={{ width: "100%", height: "100%" }}
        ></Banner>
      </View>
      <View className="kaMerchantDetails_top_content">
        <View
          className="kaMerchantDetails_top_profile merchant_dakale_logo"
          style={backgroundObj(brandLogo)}
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
              <View className="price_margin8 font_hide">
                {" | " + GetDistance(getLat(), getLnt(), lat, lnt)}
              </View>
            </View>
          ) : null}
        </View>
        <View
          onClick={() =>
            Router({
              routerName: "groupChild",
              args: {
                merchantGroupId: merchantGroupIdString,
              },
            })
          }
          className="kaMerchantDetails_order_link"
        >
          全部门店 {">"}
        </View>
      </View>
      {brandStory.length > 0 && (
        <>
          <View className="brand_details"></View>
          <View
            className={classNames(
              "brand_details_desc",
              !visible && "brand_details_descMax"
            )}
          >
            <View className="brand_details_childDesc">{brandStory}</View>
          </View>
          {visibleBtn !== null && (
            <View
              onClick={() => {
                setVisible(!visible);
              }}
              className={classNames(
                "brand_details_btn",
                visible === false
                  ? "brand_details_btnStyle2"
                  : "brand_details_btnStyle1"
              )}
            ></View>
          )}
        </>
      )}
    </View>
  );
};
