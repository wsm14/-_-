import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import classNames from "classnames";
import { Text, View } from "@tarojs/components";
import { getUserCouponDetail } from "@/server/coupon";
import Codes from "./components/code/index";
import { goBack, toast, filterWeek } from "@/common/utils";
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
    const {
      userCouponInfo,
      userCouponInfo: {
        activeBeginDate,
        activeEndDate,
        useWeek,
        useTime,
        buyDesc,
        thresholdPrice,
      },
    } = this.state;
    if (Object.keys(userCouponInfo).length > 0) {
      return (
        <View className="voucherDetails_father_box">
          <Codes
            fn={() => this.getUserCouponDetail()}
            data={userCouponInfo}
          ></Codes>
          <View className="shopdetails_shop_toast">
            <View className="shop_toastTitle">使用须知</View>
            <View className="shop_toastDec shop_toastDate">有效期：</View>
            <View className="shop_toastText">
              <Text className="shop_toastTextColor">
                {activeBeginDate + " 至 " + activeEndDate}{" "}
              </Text>
              ，请在有效期内使用；
            </View>
            {thresholdPrice && (
              <>
                <View className="shop_toastDec shop_showNow">使用门槛：</View>
                <View
                  style={{ lineHeight: Taro.pxTransform(36) }}
                  className="shop_toastText"
                >
                  满{thresholdPrice}元可用 
                </View>
              </>
            )}
            <View className="shop_toastDec shop_showNow">购买须知：</View>
            <View
              style={{ lineHeight: Taro.pxTransform(36) }}
              className="shop_toastText"
            >
              到店后，在APP/小程序我的—卡券中找到相应的券码，将
              券码出示给店员，直接验码核销，要补差价的另行补齐；
            </View>
          </View>
          {/*使用规则*/}
          <View className="shopdetails_shop_toast">
            <View className="shop_toastTitle">使用规则</View>
            <View className="shop_toastText shop_toastTextHeight">
              本券不可拆分使用，不支持外卖点餐、电商订购等方式；不全不可转让、转售、转发、截图，也不能兑换现金，伪造无效；
            </View>
            <View className="shop_toastText shop_toastTextHeight">
              如对订单有疑问，请点击左下角客服进行咨询；一旦核销即为使用，卡券详情可查看存根信息；【因供应商明确要求，本电子券一经售出后均不退不换，请介意者慎拍】
              哒卡乐客服电话：400-800-5881，如有疑问也可以直接拨打咨询。
            </View>
            <View className="shop_toastText shop_toastTextHeight">
              最终解释权归哒卡乐所有
            </View>
          </View>
        </View>
      );
    } else return null;
  }
}

export default Index;
