import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import classNames from "classnames";
import { Text, View } from "@tarojs/components";
import { getUserCouponDetail } from "@/server/coupon";
import Codes from "./components/code/index";
import { goBack, toast, filterWeek } from "@/common/utils";
import { knowPay } from "@/components/componentView/KnowPay";
import CouponLovely from "@/components/couponLovely";
import "./index.scss";
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      id: getCurrentInstance().router.params.id,
      userCouponInfo: {},
    };
  }

  getUserCouponDetail() {
    const { id } = this.state;
    getUserCouponDetail(
      {
        id,
      },
      (res) => {
        const { userCouponInfo } = res;
        this.setState({
          userCouponInfo,
        });
      }
    );
  }

  componentDidShow() {
    this.getUserCouponDetail();
  }

  componentWillMount() {
    if (!getCurrentInstance().router.params.id) {
      goBack(() => toast("券Id不能为空"));
    }
  }

  render() {
    let {
      userCouponInfo,
      userCouponInfo: {
        activeBeginDate,
        activeEndDate,
        useWeek,
        useTime,
        buyDesc,
        thresholdPrice,
        couponDesc,
      },
    } = this.state;
    if (couponDesc) {
      if (JSON.parse(couponDesc)) {
        couponDesc = JSON.parse(couponDesc).toString();
      }
    }
    if (Object.keys(userCouponInfo).length > 0) {
      return (
        <View className="voucherDetails_father_box">
          <Codes
            fn={() => this.getUserCouponDetail()}
            data={userCouponInfo}
          ></Codes>
          {knowPay(userCouponInfo)}
          <View className="voucherDetails_friend_box">
            <CouponLovely title={"小伙伴们还喜欢"}></CouponLovely>
          </View>
        </View>
      );
    } else return null;
  }
}

export default Index;
