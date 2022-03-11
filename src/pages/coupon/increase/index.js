import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { fetchPlatformCouponDetail } from "@/server/coupon";
import Coupon from "../wraparound/components/couponFree";
import Specal from "./components/specilShop";
import CommerceShop from "./components/commerceShop";
import "./index.scss";
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      userCouponId: getCurrentInstance().router.params.userCouponId,
      useScenesType: getCurrentInstance().router.params.useScenesType,
      classType: getCurrentInstance().router.params.classType,
      userPlatformCouponInfo: {},
    };
  }

  getCouponDetail() {
    const { userCouponId } = this.state;
    fetchPlatformCouponDetail({ userCouponId }).then((val) => {
      const { userPlatformCouponInfo } = val;
      this.setState({
        userPlatformCouponInfo,
      });
    });
  }

  componentDidShow() {
    this.getCouponDetail();
  }

  render() {
    const { userPlatformCouponInfo, classType, useScenesType, userCouponId } =
      this.state;
    const template = () => {
      if (!useScenesType) {
        return null;
      }
      if (useScenesType === "commerce") {
        return (
          <CommerceShop
            data={{ platformCouponId: userCouponId, classType }}
          ></CommerceShop>
        );
      } else {
        return (
          <Specal data={{ platformCouponId: userCouponId, classType }}></Specal>
        );
      }
    };
    return (
      <View className="couponShop_box">
        <View className="couponShop_insert_info">
          <Coupon
            hasBtn={false}
            status={0}
            data={userPlatformCouponInfo}
          ></Coupon>
        </View>
        {template()}
      </View>
    );
  }
}

export default Index;
