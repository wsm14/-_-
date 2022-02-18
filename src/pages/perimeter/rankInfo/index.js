import React, { Component, PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { ScrollView, View, Text, Button, Image } from "@tarojs/components";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  mapGo,
  computedClient,
  goBack,
} from "@/utils/utils";
import { fetchMerchantNearRank } from "@/server/perimeter";
import "./index.scss";
import Router from "@/utils/router";

class index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      userMerchantList: [],
      //附近商家列表
      cityName: "杭州",
    };
  }
  fetchList() {
    fetchMerchantNearRank(
      {
        cityCode: Taro.getStorageSync("district-code") || 3301,
      },
      (res) => {
        const { userMerchantList = [], cityName } = res;
        this.setState({
          userMerchantList,
          cityName,
        });
      }
    );
  }
  componentDidMount() {
    this.fetchList();
  }
  componentDidShow() {}

  render() {
    const { userMerchantList, cityName } = this.state;
    const templateRankImg = (index) => {
      if (index <= 2) {
        return (
          <View className="page_rank_rankingImage">
            <Image
              style={{
                width: "100%",
                height: "100%",
              }}
              src={`https://web-new.dakale.net/public/image/rank/rank_icons${
                index + 1
              }.png`}
            ></Image>
          </View>
        );
      } else return index + 1;
    };

    const templateActivity = (item) => {
      const { specialGoodsFlag, markFlag, couponFlag, couponList } = item;
      if (specialGoodsFlag !== "1" && markFlag !== "1" && couponFlag !== "1") {
        return null;
      } else {
        return (
          <View className="page_rank_active">
            {specialGoodsFlag === "1" ? (
              <View className="page_rank_activeTag page_rank_bg1"></View>
            ) : (
              ""
            )}

            {markFlag === "1" ? (
              <View className="page_rank_activeTag page_rank_bg2"></View>
            ) : (
              ""
            )}

            {couponFlag === "1" ? (
              <View className="page_rank_coupon">
                <View className="page_rank_icon2 page_rank_center">
                  <View className="page_rank_cou"></View>
                </View>
                <View className="page_rank_text2 font_hide">
                  {couponList[0].buyPrice}代{couponList[0].couponPrice}
                </View>
              </View>
            ) : (
              ""
            )}
          </View>
        );
      }
    };
    const templateShop = (item, index) => {
      const {
        logoImg,
        merchantName,
        userMerchantIdString,
        address = "",
        districtName,
        categoryName,
        lat,
        lnt,
        perCapitaConsumption,
        businessStatus,
        businessTime,
      } = item;
      return (
        <View
          className="page_rank_shop"
          onClick={(e) => {
            e.stopPropagation();
            Router({
              routerName: "merchantDetails",
              args: {
                merchantId: userMerchantIdString,
              },
            });
          }}
        >
          <View className="page_rank_shopBox">
            <View className="page_rank_ranking">{templateRankImg(index)}</View>
            <View
              className="page_rank_image merchant_dakale_logo"
              style={backgroundObj(logoImg)}
            ></View>
            <View className="page_rank_card">
              <View className="page_rank_name font_hide">{merchantName}</View>
              <View className="page_rank_address">
                <View className="page_rank_maxWidth font_hide">
                  {GetDistance(getLat(), getLnt(), lat, lnt)}｜{districtName}｜
                  {categoryName}｜人均￥{perCapitaConsumption}
                </View>
              </View>
              <View className="page_rank_times">
                <View className="page_rank_timeTag">
                  营业时间 <Text className="page_rank_liner">|</Text>
                  {businessTime || "全天"}
                </View>
              </View>
            </View>
          </View>
          {templateActivity(item)}
          <View
            className="page_map"
            onClick={(e) => {
              e.stopPropagation();
              mapGo({
                lat: lat,
                lnt: lnt,
                address: address,
                merchantName: merchantName,
              });
            }}
          ></View>
        </View>
      );
    };

    return (
      <View className="page_rank">
        <View className="page_rank_top">
          <View
            className="page_rank_back"
            onClick={() => goBack()}
            style={{
              top: `${Taro.pxTransform(
                computedClient().top + computedClient().height + 16
              )}`,
            }}
          ></View>
          <View className="page_rank_selfTop"></View>
          <View
            className="page_rank_title"
            style={{
              paddingTop: `${Taro.pxTransform(
                computedClient().top + computedClient().height + 16
              )}`,
            }}
          >
            人气排行榜
          </View>
          <View className="page_rank_toast public_center">
            火爆商家人气榜 · <View className="page_rank_city">{cityName}</View>
          </View>
          <View className="page_rank_rankName">真实数据驱动的榜单</View>
          <View className="page_rank_time">每周一5:00更新</View>
        </View>
        <View className="page_rank_content">
          {userMerchantList.map((item, index) => {
            return templateShop(item, index);
          })}
        </View>

        <View className="page_rank_logo"></View>
      </View>
    );
  }
}

export default index;
