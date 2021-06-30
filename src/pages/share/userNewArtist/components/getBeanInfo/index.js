import React, { useEffect, useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import { newShopView } from "./../view";
import "./index.scss";
export default ({ data, show, list, close }) => {
  const [animate, setAnimated] = useState(null);
  const { beanAmount, guideMomentFlag } = data;
  const linkTo = (item) => {
    const {
      specialActivityIdString,
      merchantIdString,
      ownerCouponIdString,
      ownerIdString,
    } = item;
    if (specialActivityIdString) {
      Router({
        routerName: "favourableDetails",
        args: {
          specialActivityId: specialActivityIdString,
          merchantId: merchantIdString,
        },
      });
    } else {
      Router({
        routerName: "payCouponDetails",
        args: {
          ownerCouponId: ownerCouponIdString,
          ownerId: ownerIdString,
          merchantId: merchantIdString,
        },
      });
    }
  };
  useEffect(() => {
    if (show) {
      animated();
    }
  }, [show]);
  const onClose = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      close();
    }, 300);
  };
  const onlinkBuy = (item) => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      close(() => linkTo(item));
    }, 300);
  };
  const animated = () => {
    let animateTem = Taro.createAnimation({
      duration: 10,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    let animateTem1 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem.scale(0, 0).step();
    setAnimated(animateTem.export());
    setTimeout(() => {
      animateTem1.scale(1, 1).step();
      setAnimated(animateTem1);
    }, 300);
  };
  const renderBeanToast = () => {
    if (list.length === 1) {
      return (
        <View className="getBeanInfo_own">
          {list.map((item) => {
            return newShopView(item);
          })}
          <View
            className="getBeanInfo_font4 public_center"
            onClick={() => {
              onlinkBuy(list[0]);
            }}
          >
            立即购买
          </View>
        </View>
      );
    } else {
      return (
        <ScrollView scrollY className="getBeanInfo_scroll">
          {list.map((item, index) => {
            if (index < 3) {
              return newShopView(item);
            }
          })}
        </ScrollView>
      );
    }
  };
  /* 显示隐藏动画  */

  if (show) {
    return (
      <View
        animation={animate}
        className="getBeanInfo_Box_father"
        catchMove
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <View
          className="getBeanInfo_Box"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View catchMove className="getBeanInfo_image">
            <View className="getBeanInfo_font2 public_center">
              <View className="getBeanInfo_bean_icon"></View>
              <View className="getBeanInfo_num_icon"></View>
              <View className="getBeanInfo_num">{beanAmount}</View>
            </View>
            {renderBeanToast()}
          </View>
          <View
            className="getBeanInfo_Box_close"
            onClick={() => onClose()}
          ></View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
