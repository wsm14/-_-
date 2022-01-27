/*通用单按钮样式弹框
  btn 按钮名称
  close 外面传入的关闭方法
  width 内弹框宽度
  children Components 子组件或函数
 */
import React from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.scss";

export default ({
  title,
  Components,
  close,
  btn,
  children,
  width,
  onSubmit,
}) => {
  return (
    <View
      className="dakale_toasts"
      catchMove
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <View className="dakale_layer" onClick={(e) => e.stopPropagation()}>
        <View
          style={width ? { width: Taro.pxTransform(width) } : {}}
          className="dakale_layer_toast"
        >
          {title && (
            <View className="dakale_layer_title font32 bold color1">
              {title}
            </View>
          )}
          {children}
          {Components && Components()}
          <View
            className="dakale_layer_btn color6 font32"
            onClick={(e) => {
              e.stopPropagation();
              close();
              onSubmit && onSubmit();
            }}
          >
            {btn || "知道了"}
          </View>
        </View>
      </View>
    </View>
  );
};
