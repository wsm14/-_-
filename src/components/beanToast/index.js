/*到店打卡领豆视频领豆组件
 * show 显示或隐藏组件
 * data 外部导入数据
 * visible 外部关闭方法
 */
import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { backgroundObj, switchTab } from "@/common/utils";
import Router from "@/common/router";
import ButtonView from "@/components/Button";
import "./index.scss";
export default (props) => {
  const { data, visible, show = false } = props;
  const [animate, setAnimated] = useState(null);
  const {
    guideMomentFlag = "0",
    goodsName = "",
    goodsImg = "",
    oriPrice = "",
    realPrice = "",
    discount = "",
    beanAmount,
    otherBeanAmount = "",
    merchantIdString,
    specialActivityIdString,
    otherRealPrice = "",
  } = data;
  /* guideMomentFlag  为1时显示另外一套特殊携带商品样式，默认为0不管 */
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

  /* 显示隐藏动画  */
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
      visible();
    }, 300);
  };

  /* 关闭弹框  */
  const linkToGuang = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      visible();
      switchTab("/pages/index/lookAround/index");
    }, 300);
  };
  /* 跳转主页逛逛页面  */
  const linkToPay = () => {
    let animateTem2 = Taro.createAnimation({
      duration: 300,
      timingFunction: "linear",
      delay: 0,
      transformOrigin: "50% 50%",
    });
    animateTem2.scale(0, 0).step();
    setAnimated(animateTem2);
    setTimeout(() => {
      visible();
      Router({
        routerName: "favourableDetails",
        args: {
          merchantId: merchantIdString,
          specialActivityId: specialActivityIdString,
        },
      });
    }, 300);
  };
  /* 跳转订单详情页面  */
  useEffect(() => {
    if (show) {
      animated();
    }
  }, [show]);
  const templateBean = {
    0: (
      <View
        className="kol_bean_box happyBean"
        catchMove
        animation={animate}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <View className="kol_details_padding">
          <View className="color1 bold font32">恭喜您获得</View>
          <View className="font40 bold color3 bean_padding">
            {data.beanAmount}卡豆
          </View>
          <ButtonView>
            <View
              className="getBean_btn font32 color6"
              onClick={() => onClose()}
            >
              立即领取
            </View>
          </ButtonView>
        </View>
      </View>
    ),
    1: (
      <View
        animation={animate}
        catchMove
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="specal_layer_box "
      >
        <View className="specal_layer_getBean">
          <View className="specal_layer_bean"></View>
          <View className="specal_layer_X"></View>
          <View className="specal_layer_count">{beanAmount}</View>
        </View>
        <View className="specal_layer_title font24">
          <Text className="color6">再领{otherBeanAmount}卡豆</Text>
          <Text className="color10"> 可超值购买</Text>
        </View>
        <View onClick={() => linkToPay()} className="specal_layer_card">
          <View
            className="specal_layer_img dakale_nullImage"
            style={backgroundObj(goodsImg)}
          ></View>
          <View className="specal_layer_font">
            <View className="specal_title font_hide">{goodsName}</View>
            <View className="specal_getBeanPrice">卡豆抵扣到手价</View>
            <View className="specal_orice">
              <Text className="color1 font24 bold">¥</Text>{" "}
              <Text className="color1 font28 bold"> {otherRealPrice}</Text>{" "}
              <Text className="specal_rice_font">¥{oriPrice}</Text>
            </View>
          </View>
          <ButtonView>
            <View className="specal_btn public_center">立即抢购</View>
          </ButtonView>
        </View>
        <View className="specal_layer_shareFriend"></View>
        <View className="specal_layer_btn public_auto">
          <ButtonView>
            <View
              onClick={() => onClose()}
              className="specal_layer_btnLeft specal_layer_btnBox public_center"
            >
              继续捡豆
            </View>
          </ButtonView>
          <ButtonView>
            <View
              onClick={() => linkToGuang()}
              className="specal_layer_btnRight specal_layer_btnBox public_center"
            >
              马上逛逛
            </View>
          </ButtonView>
        </View>
      </View>
    ),
  }[guideMomentFlag];
  return (
    <View
      style={show ? { display: "flex" } : { display: "none" }}
      className="kol_bean public_center"
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      {templateBean}
    </View>
  );
};
