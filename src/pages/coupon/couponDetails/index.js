import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { getUserCouponDetail } from "@/server/coupon";
import KnowPay from "@/components/public_ui/KnowPay";
import Codes from "./components/goodscode/index";
import CouponCode from "./components/couponCode";
import Recommend from "@/components/public_ui/specalActive";
import CouponRecommend from "@/components/public_ui/couponActive";
import { goBack, toast } from "@/utils/utils";
import { inject, observer } from "mobx-react";
import "./index.scss";
@inject("store")
@observer
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      id: getCurrentInstance().router.params.id,
      configUserLevelInfo: {},
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
  setConfigUserLevelInfo() {
    const { commonStore = {} } = this.props.store;
    const { preferentialGlobalDefaultList = [] } = commonStore;
    let data = preferentialGlobalDefaultList.find((item) => {
      const { identification } = item;
      return identification === "otherDefault";
    });
    this.setState({
      payBeanCommission: data.preferentialActivityRuleObject.payBeanCommission,
    });
  }
  componentDidShow() {
    this.setConfigUserLevelInfo();
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
        orderType,
        couponDesc,
        couponType,
      },
      configUserLevelInfo: { payBeanCommission = 50, shareCommission = 0 },
      configUserLevelInfo,
    } = this.state;
    const template = {
      specialGoods: (
        <Codes
          fn={() => this.getUserCouponDetail()}
          data={userCouponInfo}
        ></Codes>
      ),
      reduceCoupon: (
        <CouponCode
          fn={() => this.getUserCouponDetail()}
          data={userCouponInfo}
        ></CouponCode>
      ),
      rightGoods: (
        <Codes
          fn={() => this.getUserCouponDetail()}
          data={userCouponInfo}
        ></Codes>
      ),
      rightCoupon: (
        <CouponCode
          fn={() => this.getUserCouponDetail()}
          data={userCouponInfo}
        ></CouponCode>
      ),
      freeReduceCoupon: (
        <CouponCode
          fn={() => this.getUserCouponDetail()}
          data={userCouponInfo}
        ></CouponCode>
      ),
    }[couponType];
    if (couponDesc) {
      if (JSON.parse(couponDesc)) {
        couponDesc = JSON.parse(couponDesc).toString();
      }
    }
    if (Object.keys(userCouponInfo).length > 0) {
      return (
        <View className="couponDetails_father_box">
          {template}
          <KnowPay
            data={userCouponInfo}
            type={
              orderType === "specialGoods" || orderType === "rightGoods"
                ? "good"
                : "coupon"
            }
          ></KnowPay>
          {orderType === "specialGoods" || orderType === "rightGoods" ? (
            <Recommend
              current={true}
              userInfo={configUserLevelInfo}
            ></Recommend>
          ) : (
            <CouponRecommend
              current={true}
              userInfo={configUserLevelInfo}
            ></CouponRecommend>
          )}
        </View>
      );
    } else return null;
  }
}

export default Index;
