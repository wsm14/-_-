/*到店打卡领豆视频领豆组件
 * show 显示或隐藏组件
 * data 外部导入数据
 * visible 外部关闭方法
 */
import React, { useEffect, useState } from "react";
import { CoverImage, CoverView, Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { backgroundObj, switchTab } from "@/common/utils";
import Router from "@/common/router";
import ButtonView from "@/components/Button";
import "./../index.scss";
export default (props) => {
  const { data = {}, visible, show = false } = props;
  const [animate, setAnimated] = useState(null);

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
        routerName: "download",
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
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
    >
      <CoverView
        animation={animate}
        catchMove
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="pay_toast_box"
      >
        <CoverImage
          className="pay_toast_Image"
          src={"https://wechat-config.dakale.net/miniprogram/image/icon621.png"}
        ></CoverImage>
        <CoverImage
          className="pay_toast_Image1"
          src={"https://wechat-config.dakale.net/miniprogram/image/icon624.png"}
        ></CoverImage>
        <CoverImage
          className="pay_toast_Image2"
          src={"https://wechat-config.dakale.net/miniprogram/image/icon625.png"}
        ></CoverImage>
        <CoverImage
          onClick={linkToDown}
          className="pay_toast_Image4"
          src={"https://wechat-config.dakale.net/miniprogram/image/icon622.png"}
        ></CoverImage>
        <CoverImage
          onClick={onClose}
          className="pay_toast_Image5"
          src={"https://wechat-config.dakale.net/miniprogram/image/icon623.png"}
        ></CoverImage>
        <CoverView className="pay_toast_view">{data.subsidyBean}</CoverView>
      </CoverView>
    </View>
  );
};
