import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import Coupon from "./components/couponTop";
import { getOwnerCouponDetail } from "@/server/perimeter";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import { fetchUserShareCommission } from "@/server/index";
import ButtonView from "@/components/Button";
import { payNeed } from "@/components/componentView/NeedPay";
import { knowPay } from "@/components/componentView/KnowPay";
import {
  Instruction,
  merchantSet,
} from "@/components/componentView/Instruction";
import { format, loginStatus, computedPrice } from "@/common/utils";
import Router from "@/common/router";
import { loginBtn } from "@/common/authority";
import NullStatus from "./components/nullStatus";
import { inject, observer } from "mobx-react";
import TaroShareDrawer from "./components/TaroShareDrawer";
import { rssConfigData } from "./components/data";
import Toast from "@/components/dakale_toast";
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
      cavansObj: {
        data: null,
        start: false,
      },
      visible: false,
    };
  }
  componentWillMount() {
    let { scene } = getCurrentInstance().router.params;
    let { httpData } = this.state;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        let {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          param = JSON.parse(param);
          this.setState(
            {
              httpData: { ...httpData, ...param },
            },
            (res) => {
              this.fetchCouponDetail();
            }
          );
        }
      });
    } else {
      this.fetchCouponDetail();
    }
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
  getShareInfo() {
    const {
      couponDetail: {
        ownerCouponIdString,
        merchantName,
        activityEndTime = "",
        address,
        couponName,
        cityName,
        merchantLogo,
      },
    } = this.state;

    const { profile, username } = Taro.getStorageSync("userInfo");
    getShareInfo(
      {
        shareType: "reduceCoupon",
        shareId: ownerCouponIdString,
      },
      (res) => {
        console.log(res);
        const { oriPrice, realPrice, qcodeUrl } = res;
        this.setState(
          {
            cavansObj: {
              start: true,
              data: rssConfigData({
                merchantName,
                time:
                  (activityEndTime && activityEndTime + "结束") || "长期有效",
                oldPrice: oriPrice,
                price: realPrice,
                wxCode: qcodeUrl,
                username,
                userProfile: profile,
                name: couponName,
                address,
                city: cityName,
                merchantLogo: merchantLogo,
              }),
            },
          },
          (res) => {
            console.log(this.state.cavansObj);
          }
        );
      }
    );
  }

  onShareAppMessage(res) {
    const {
      couponDetail: { couponName, merchantLogo },
      httpData: { merchantId, ownerId, ownerCouponId },
    } = this.state;
    let userInfo = loginStatus() || {};
    const { userIdString } = userInfo;
    if (res.from === "button") {
      return {
        title: couponName,
        imageUrl: merchantLogo,
        path: `/pages/perimeter/payCouponDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&ownerId=${ownerId}&ownerCouponId=${ownerCouponId}`,
      };
    }
    if (loginStatus()) {
      return {
        title: couponName,
        imageUrl: merchantLogo,
        path: `/pages/perimeter/payCouponDetails/index?shareUserId=${userIdString}&shareUserType=user&merchantId=${merchantId}&ownerId=${ownerId}&ownerCouponId=${ownerCouponId}`,
      };
    } else {
      return {
        title: couponName,
        imageUrl: merchantLogo,
      };
    }
  }
  saveCouponOrder() {
    const {
      couponDetail: {
        merchantIdString,
        ownerIdString,
        ownerCouponIdString,
        personLimit,
        dayMaxBuyAmount,
        boughtCouponNum,
        buyRule,
      },
    } = this.state;
    if (buyRule === "dayLimit" && dayMaxBuyAmount === boughtCouponNum) {
      this.setState({
        visible: true,
      });
      return;
    } else if (buyRule === "personLimit" && personLimit === boughtCouponNum) {
      this.setState({
        visible: true,
      });
      return;
    }
    Router({
      routerName: "couponOrder",
      args: {
        merchantId: merchantIdString,
        ownerId: ownerIdString,
        ownerCouponId: ownerCouponIdString,
      },
    });
  }
  componentDidShow() {
    const { index } = this.state;
    if (index !== 0) {
      this.fetchCouponDetail();
    }
    this.fetchUserShareCommission();
  }
  componentDidMount() {}
  render() {
    const {
      couponDetail,
      configUserLevelInfo,
      configUserLevelInfo: { shareCommission = 0 },
      cavansObj,
      couponDetail: {
        couponPrice,
        buyPrice,
        merchantPrice,
        merchantCouponStatus = "1",
        remain,
        buyRule,
        dayMaxBuyAmount,
        personLimit,
      },
      visible,
    } = this.state;
    const payBtn = () => {
      if (remain === 0) {
        return (
          <ButtonView>
            <View className="shopdetails_shop_goshop shopdetails_shop_option">
              已售罄
            </View>
          </ButtonView>
        );
      } else if (shareCommission) {
        return (
          <View className="shopdetails_kol_goshop">
            <ButtonView>
              <View
                onClick={() => loginBtn(() => this.saveCouponOrder())}
                className="shopdetails_kol_btnBox shopdetails_kol_btnColor1"
              >
                <View className="shopdetails_kol_font1">自购返</View>
                <View className="shopdetails_kol_font2">
                  {" "}
                  省¥
                  {computedPrice(buyPrice - merchantPrice, shareCommission)}
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
                  {computedPrice(buyPrice - merchantPrice, shareCommission)}
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
              onClick={() => loginBtn(() => this.saveCouponOrder())}
            >
              立即抢购
            </View>
          </ButtonView>
        );
      }
    };
    if (merchantCouponStatus === "1") {
      return (
        <View className="payCoupon_box">
          <TaroShareDrawer
            {...cavansObj}
            onSave={() => console.log("点击保存")}
            onClose={() =>
              this.setState({ cavansObj: { start: false, data: null } })
            }
          ></TaroShareDrawer>
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
                  {((Number(buyPrice) / Number(couponPrice)) * 10).toFixed(1)}折
                </Text>
              </View>
            </View>
            {payBtn()}
          </View>
          {visible && (
            <Toast
              title={"哒卡乐温馨提示"}
              close={() => this.setState({ visible: false })}
            >
              <View className="shop_dakale_content">
                {buyRule === "dayLimit" ? (
                  <>
                    <View>
                      每人每天限购{dayMaxBuyAmount}
                      份，您今天已享受本次优惠，请明天再来
                    </View>
                  </>
                ) : (
                  <View>每人限购{personLimit}份，您已享受本次优惠</View>
                )}
              </View>
            </Toast>
          )}
        </View>
      );
    } else {
      return <NullStatus></NullStatus>;
    }
  }
}
export default Index;
