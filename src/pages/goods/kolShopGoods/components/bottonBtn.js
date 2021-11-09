import React, { useEffect, useState } from "react";
import { View } from "@tarojs/components";
import "./../index.scss";
import { toast } from "@/common/utils";
import Taro from "@tarojs/taro";
import { navigateTo } from "@/common/utils";
import Router from "@/common/router";
export default (props) => {
  const { data, remove, deleteSn, closeSn } = props;
  const [order, setOrderDetails] = useState({});
  useEffect(() => {
    setOrderDetails(data);
  }, [data]);
  console.log(order)
  const getPay = () => {
    const { orderSn, orderType } = order;
    navigateTo(
      `/pages/goods/payWeex/index?orderSn=${orderSn}&orderType=${orderType}`
    );
  };
  const goSpeGoods = () => {
    const {
      ownerIdString,
      ownerCouponIdString,
      merchantIdString,
      activityIdString,
      orderType,
    } = order;
    if (orderType === "specialGoods") {
      Router({
        routerName: "favourableDetails",
        args: {
          merchantId: merchantIdString,
          specialActivityId: activityIdString,
        },
      });
    } else {
      Router({
        routerName: "payCouponDetails",
        args: {
          merchantId: merchantIdString,
          ownerId: ownerIdString,
          ownerCouponId: ownerCouponIdString,
        },
      });
    }
  };
  //再次Spe下单

  const filterBtn = () => {
    const { status } = order;
    switch (status) {
      case "0":
        return (
          <View className="kolGoods_bottom_btn">
            <View
              className="kolGoods_submit color2"
              onClick={() => closeSn()}
              style={{ marginRight: `${Taro.pxTransform(24)}` }}
            >
              取消订单
            </View>
            <View className="kolGoods_submit1 color4" onClick={() => getPay()}>
              去付款
            </View>
          </View>
        );
        break;
      case "1":
        return (
          <View className="kolGoods_bottom_btn" onClick={() => goSpeGoods()}>
            <View className="kolGoods_submit1 color4">再来一单</View>
          </View>
        );
        break;
      case "2":
        return (
          <View className="kolGoods_bottom_btn">
            <View
              className="kolGoods_submit color2"
              onClick={() => deleteSn()}
              style={{ marginRight: `${Taro.pxTransform(24)}` }}
            >
              删除订单
            </View>
            <View
              className="kolGoods_submit1 color4"
              onClick={() => goSpeGoods()}
            >
              重新购买
            </View>
          </View>
        );
        break;
      case "3":
        return (
          <View className="kolGoods_bottom_btn">
            <View
              className="kolGoods_submit color2"
              onClick={() => deleteSn()}
              style={{ marginRight: `${Taro.pxTransform(24)}` }}
            >
              删除订单
            </View>
            <View
              className="kolGoods_submit1 color4"
              onClick={() => goSpeGoods()}
            >
              再次购买
            </View>
          </View>
        );
        break;
      // case "6":
      //   return (
      //     <View className="kolGoods_bottom_btn">
      //       <View className="kolGoods_submit color2" onClick={() => remove()}>
      //         取消申请
      //       </View>
      //     </View>
      //   );
      default:
        return null;
    }
  };
  return <View className="kolGoods_bottom_btnBox">{filterBtn()}</View>;
};
