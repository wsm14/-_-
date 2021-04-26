import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { getScanAvailableCoupon } from "@/server/goods";
import CouponList from "./components/coupon";
import "./index.scss";
import { toast, goBack } from "@/common/utils";
import Evens from "@/common/evens";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        merchantId: getCurrentInstance().router.params.merchantId,
        total: getCurrentInstance().router.params.total,
      },
      userCouponList: [],
      userCouponObj: {},
      backObj: {},
    };
  }
  componentWillUnmount() {
    const {
      httpData: { merchantId, total },
    } = this.state;

    if (!merchantId || !total) {
      goBack(() => toast("参数缺失"));
    }
  }
  getScanAvailableList() {
    const { httpData } = this.state;
    getScanAvailableCoupon(httpData, (res) => {
      const { userCouponList } = res;
      this.setState(
        {
          userCouponList,
        },
        (res) => {
          if (getCurrentInstance().router.params.couponId) {
            let list = userCouponList.filter((item) => {
              if (
                item.userCouponIdString ===
                getCurrentInstance().router.params.couponId
              ) {
                return true;
              }
            });
            this.setState({
              backObj: list[0],
            });
          }
        }
      );
    });
  }
  componentDidMount() {
    this.getScanAvailableList();
  }
  setUserCouponId(obj) {
    this.setState({
      userCouponObj: obj,
    });
  }
  setCouponPay() {
    const { userCouponObj } = this.state;
    if (userCouponObj) {
      this.setState({ backObj: userCouponObj }, (res) => {
        goBack();
      });
    } else {
      toast("请选择您要使用的优惠券");
    }
  }
  componentDidShow() {}
  componentWillUnmount() {
    const { backObj = {} } = this.state;
    Evens.$emit("payCode", backObj);
  }
  render() {
    const { userCouponList } = this.state;
    return (
      <View className="codeCoupon_box">
        <View className="codeCoupon_content">
          <CouponList
            couponIdInit={getCurrentInstance().router.params.couponId}
            callback={this.setUserCouponId.bind(this)}
            list={userCouponList}
          ></CouponList>
        </View>
        <View className="codeCoupon_bottom">
          <View className="codeCoupon_btn" onClick={() => this.setCouponPay()}>
            完成
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
