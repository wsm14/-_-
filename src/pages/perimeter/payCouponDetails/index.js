import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import classNames from "classnames";
import Coupon from "./components/couponTop";
import { getOwnerCouponDetail } from "@/server/perimeter";
import { getShareParamInfo } from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import ButtonView from "@/components/Button";
import { payNeed } from "@/components/componentView/NeedPay";
import { knowPay } from "@/components/componentView/KnowPay";
import {
  Instruction,
  merchantSet,
} from "@/components/componentView/Instruction";
import { format } from "@/common/utils";
import Router from "@/common/router";
import { inject, observer } from "mobx-react";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      couponDetail: {},
      index: 0,
      configUserLevelInfo: {},
    };
  }
  fetchCouponDetail() {
    const { httpData } = this.state;
    getOwnerCouponDetail(httpData, (res) => {
      const { couponDetail } = res;
      const { reduceObject = {} } = couponDetail;
      this.setState({
        couponDetail: { ...couponDetail, ...reduceObject },
      });
    });
  }
  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  componentDidShow() {
    const { index } = this.state;
    if (index !== 0) {
      this.getDetailsById();
    }
    this.fetchUserShareCommission();
  }
  componentDidMount() {
    this.fetchCouponDetail();
  }
  render() {
    const {
      couponDetail,
      configUserLevelInfo,
      configUserLevelInfo: { shareCommission },
      couponDetail: {
        couponPrice,
        buyPrice,
        activityStartTime,
        activityTimeRule,
        merchantPrice,
      },
    } = this.state;
    const payBtn = () => {
      if (!format(activityStartTime) && activityTimeRule === "fixed") {
        return (
          <ButtonView>
            <View className="shopdetails_shop_goshop shopdetails_shop_option">
              即将开抢
            </View>
          </ButtonView>
        );
      } else if (shareCommission !== 0) {
        return (
          <View className="shopdetails_kol_goshop">
            <ButtonView>
              <View className="shopdetails_kol_btnBox shopdetails_kol_btnColor1">
                <View
                  className="shopdetails_kol_font1"
                  // onClick={() =>
                  //   loginBtn(() =>
                  //     navigateTo(
                  //       `/pages/goods/favourOrder/index?specialActivityId=${specialActivityIdString}&merchantId=${merchantIdString}`
                  //     )
                  //   )
                  // }
                >
                  自购返
                </View>
                <View className="shopdetails_kol_font2">
                  {" "}
                  省¥
                  {(
                    (buyPrice - merchantPrice) *
                    (shareCommission / 100)
                  ).toFixed(2)}
                </View>
              </View>
            </ButtonView>
            <ButtonView>
              <View
                className="shopdetails_kol_btnBox shopdetails_kol_btnColor2"
                onClick={() => loginBtn(() => this.getShareInfo())}
              >
                <View className="shopdetails_kol_font1">分享赚</View>
                <View className="shopdetails_kol_font2">
                  {" "}
                  赚¥
                  {(
                    (buyPrice - merchantPrice) *
                    (shareCommission / 100)
                  ).toFixed(2)}
                </View>
              </View>
            </ButtonView>
          </View>
        );
      } else {
        return (
          <ButtonView>
            <View
              className="shopdetails_shop_goshop"
              onClick={() =>
                loginBtn(() =>
                  navigateTo(
                    `/pages/goods/favourOrder/index?specialActivityId=${specialActivityIdString}&merchantId=${merchantIdString}`
                  )
                )
              }
            >
              立即抢购
            </View>
          </ButtonView>
        );
      }
    };
    return (
      <View className="payCoupon_box">
        <Coupon
          configUserLevelInfo={configUserLevelInfo}
          data={couponDetail}
        ></Coupon>
        {merchantSet(couponDetail)}
        {/*使用须知*/}
        {knowPay(couponDetail, "coupon")}
        {/*使用方法*/}
        {Instruction()}
        {/*使用规则*/}
        {payNeed()}
        <View className="shopdetails_shop_btn">
          <View className="shopdetails_shop_price">
            <View className="shopdetails_shop_priceTop">
              <Text className="font20">¥</Text>
              {buyPrice}
            </View>
            <View className="shopdetails_shop_real">
              <Text className="shopdetails_shop_realStatus1">
                ¥ {couponPrice}
              </Text>
              <Text className="shopdetails_shop_realStatus2">
                {((Number(couponPrice) / Number(buyPrice)) * 10).toFixed(1)}折
              </Text>
            </View>
          </View>
          {payBtn()}
        </View>
      </View>
    );
  }
}

export default Index;
