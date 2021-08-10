/*到店打卡领豆视频领豆组件
 * show 显示或隐藏组件
 * data 外部导入数据
 * visible 外部关闭方法
 */
import React, { useEffect, useState } from "react";
import { Image, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import Router from "@/common/router";
import ButtonView from "@/components/Button";
import "./index.scss";
export default (props) => {
  const { data = {}, visible, show = false } = props;
  const [animate, setAnimated] = useState(null);
  const { remainDay, orderNum, finishOrderNum, subsidyBean } = data;
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
  const linkToDown = () => {
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
        routerName: "wallet",
        args: {},
      });
    }, 300);
  };
  /* 跳转下载页面  */

  useEffect(() => {
    if (show) {
      animated();
    }
  }, [show]);

  return (
    <View
      style={show ? { display: "flex" } : { display: "none" }}
      className="pay_success_toast public_center"
      catchMove
      animation={animate}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <View>
        <View
          catchMove
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="pay_toast_box"
        >
          <View className="pay_content_info">
            <Text className="color15">{remainDay}天内</Text>
            <Text className="color6">，成功核销</Text>
            <Text className="color15">{orderNum}单</Text>
            <Text className="color6">即可获得</Text>
          </View>
          <View className="pay_content_bean public_center">
            <View className="pay_bean_icon"></View>

            <View className="pay_bean_xIcon"></View>
            <View className="pay_bean_beanNums">{subsidyBean}</View>
          </View>
          <View
            className="pay_content_btn public_center"
            onClick={() => linkToDown()}
          >
            去查看
          </View>
        </View>
        <View className="pay_toas_close" onClick={() => onClose()}></View>
      </View>
    </View>
  );
};
