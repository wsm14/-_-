import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

/**
 * Drawer
 * @param {Boolean}   show 是否展示
 * @param {Number}    width 内容宽度 500
 * @param {Boolean}   mask 点击蒙层关闭 默认开启
 * @param {ClassName} className 外层样式
 * @param {ClassName} bodyClassName 内容区域样式
 * @param {Function}  onClose 关闭事件
 * @param {ReactNode} children
 */
export default (props) => {
  const {
    show = false,
    width = 500,
    mask = true,
    className = "",
    bodyClassName = "",
    onClose,
    children,
  } = props;

  const handleClose = (e) => {
    e.stopPropagation();
    if (mask) onClose && onClose();
  };

  return (
    <View className={`dakale_drawer_layout ${className}`}>
      <View
        catchMove
        className={`dakale_drawer_mask ${show ? "mask_show" : "mask_hide"}`}
        onClick={handleClose}
      ></View>
      <View
        style={{ width: Taro.pxTransform(width) }}
        className={`drawer_content ${bodyClassName} ${
          show ? "drawer_show" : "drawer_hide"
        }`}
      >
        <View className="drawer_contentOvel">{show && children}</View>
      </View>
    </View>
  );
};
