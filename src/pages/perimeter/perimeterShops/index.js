import React, { Component, PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { ScrollView, View, Text, Button } from "@tarojs/components";
import {
  getLat,
  getLnt,
  GetDistance,
  backgroundObj,
  loginStatus,
  mapGo,
  navigateTo,
  toast,
} from "@/common/utils";
import { fetchMainMerchantList } from "@/server/perimeter";
import { scanCard } from "@/common/authority";
import ShopView from "./components/shopView";
import { fetchUserShareCommission } from "@/server/index";
import {getBanner} from  '@/server/common'
import "./index.scss";

class index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        page: 1,
        limit: 10,
      },
      countStatus: true,
      userMerchantList: [],
      visible: false,
      bannerList: [],
      configUserLevelInfo: {},
    };
  }

  componentDidMount() {
    this.fetchList();
    this.getBanner();
  }
  componentDidShow() {
    this.fetchUserShare();
  }
  getBanner() {
    getBanner({ bannerType: "wanderAroundGoodMerchant" }, (res) => {
      const { bannerList } = res;
      this.setState({
        bannerList,
      });
    });
  }
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  fetchList(init) {
    const { httpData } = this.state;
    fetchMainMerchantList(httpData, (res) => {
      const { userMerchantList = [] } = res;
      if (!init) {
        if (userMerchantList.length === 0) {
          this.setState({
            countStatus: false,
          });
        } else {
          this.setState({
            userMerchantList: [
              ...this.state.userMerchantList,
              ...userMerchantList,
            ],
          });
        }
      } else {
        this.setState({
          userMerchantList,
        });
      }
    });
  }
  onReachBottom() {
    const { httpData, countStatus } = this.state;
    if (countStatus) {
      this.setState(
        {
          httpData: {
            ...httpData,
            page: httpData.page + 1,
          },
        },
        (res) => {
          this.fetchList();
        }
      );
    } else {
      return toast("暂无数据");
    }
  } //上拉加载
  render() {
    const {
      userMerchantList,
      visible,
      httpData,
      configUserLevelInfo,
      bannerList,
    } = this.state;
    const template = (item, index) => {
      const {
        perCapitaConsumption,
        categoryName,
        districtName,
        businessHub,
        markFlag,
        markBean,
        coverImg,
        logoImg,
        specialGoodsFlag,
        specialGoodsAmount,
        brandFlag,
        couponList = [],
        lat,
        lnt,
        merchantName,
        address,
        userMerchantIdString,
      } = item;
      return (
        <View
          className="perimeter_shop_template"
          onClick={() =>
            navigateTo(
              `/pages/perimeter/merchantDetails/index?merchantId=${userMerchantIdString}`
            )
          }
        >
          <View
            style={backgroundObj(coverImg)}
            className="template_filterImage dakale_nullImage"
          >
            <View
              style={backgroundObj(logoImg)}
              className="template_userprofile coupon_shop_icon"
            ></View>
            {brandFlag === "1" && <View className="template_pingpai"></View>}
          </View>
          <View className="template_content">
            <View className="template_title font_hide">{merchantName}</View>
            <View className="list_font_type  font_hide">
              {businessHub}·{categoryName}｜人均￥{perCapitaConsumption}
            </View>
            <View className="template_time_box">
              <View className="template_time">
                <Text style={{ display: "inline-block" }} className="bold">
                  营业时间
                </Text>{" "}
                <View className="liner"></View> 10:00 - 23:00
              </View>
            </View>
            <View
              onClick={(e) => {
                e.stopPropagation();
                scanCard();
              }}
              className="template_scan"
            >
              <View className="scan_icon"></View>
              <View className="scan_font">打卡捡豆</View>
            </View>
          </View>
          {/* <ShopView
            data={item}
            configUserLevelInfo={configUserLevelInfo}
          ></ShopView> */}
          <View className="template_liner"></View>
          <View className="template_liner_address public_auto">
            <View className="template_address_left font_hide">
              {merchantName}｜ {GetDistance(getLat(), getLnt(), lat, lnt)}
            </View>
            <View
              className="template_address_right"
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
        </View>
      );
    };
    return (
      <View className="perimeter_shop_box">
        {bannerList.length > 0 && (
          <View className="perimeter_banner_style">
            <Banner
              boxStyle={{ width: "100%", height: "100%" }}
              imgName="coverImg"
              data={bannerList}
            ></Banner>
          </View>
        )}
        {userMerchantList.map((item, index) => {
          return template(item, index);
        })}
      </View>
    );
  }
}

export default index;
