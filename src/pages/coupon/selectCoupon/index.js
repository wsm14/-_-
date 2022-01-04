import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { fetchAllAvailableCoupon } from "@/server/coupon";
import Template from "./components/couponTemplate";
import ErrorTemplate from "./components/errorCoupon";
import { toast, goBack, objStatus } from "@/utils/utils";
import "./index.scss";
import Evens from "@/common/evens";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      userPlatformCouponList: [],
      //平台券
      userCouponList: [],
      //商家券
      selectObj: {},
      reloadObj: {},
      defaultId: getCurrentInstance().router.params.defaultId,
    };
  }
  onChange(item) {
    const { userCouponId } = item;
    const { selectObj } = this.state;
    if (userCouponId === selectObj.userCouponId) {
      this.setState({
        selectObj: {},
      });
    } else {
      this.setState({
        selectObj: item,
      });
    }
  }
  fetchCoupon() {
    const { httpData, defaultId } = this.state;
    console.log(defaultId);
    fetchAllAvailableCoupon(httpData).then((val) => {
      const { userPlatformCouponList = [], userCouponList = [] } = val;
      this.setState(
        {
          userPlatformCouponList,
          userCouponList,
        },
        (res) => {
          [...userPlatformCouponList, ...userCouponList].forEach((item) => {
            if (item.userCouponId === defaultId && item.availableFlag === "1") {
              this.setState({
                selectObj: item,
                reloadObj: item,
              });
            }
          });
        }
      );
    });
  }
  componentDidMount() {
    this.fetchCoupon();
  }
  setCouponPay() {
    const { selectObj } = this.state;
    this.setState({ reloadObj: selectObj }, (res) => {
      goBack();
    });
  }
  componentWillUnmount() {
    const { reloadObj = {} } = this.state;
    Evens.$emit("payCoupon", reloadObj);
  }
  render() {
    const { userPlatformCouponList, userCouponList, selectObj } = this.state;
    return (
      <View className="codeCoupon_box">
        <View className="codeCoupon_content">
          <View className="codeCoupon_template_title">平台优惠券</View>
          {userPlatformCouponList
            .filter((item) => {
              return item.availableFlag === "1";
            })
            .map((item, index) => {
              return (
                <Template
                  change={this.onChange.bind(this)}
                  checkedObj={selectObj}
                  data={item}
                  index={index}
                ></Template>
              );
            })}
          <ErrorTemplate
            list={userPlatformCouponList.filter((item) => {
              return item.availableFlag === "0";
            })}
          ></ErrorTemplate>
          <View className="codeCoupon_template_title">商家免费券</View>
          {userCouponList
            .filter((item) => {
              return item.availableFlag === "1";
            })
            .map((item, index) => {
              return <Template data={item} index={index}></Template>;
            })}
          <ErrorTemplate
            list={userCouponList.filter((item) => {
              return item.availableFlag === "0";
            })}
          ></ErrorTemplate>
        </View>
        <View className="codeCoupon_btn_box public_center">
          <View
            className="codeCoupon_btn_pay public_center"
            onClick={() => this.setCouponPay()}
          >
            确定
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
