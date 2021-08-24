import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import "./index.scss";

/**
 *
 * @param {*} show 打开状态
 * @param {*} title 标题
 * @param {*} onClose 关闭
 * @param {*} onSubmit 确认回调
 * @param {*} okText 确认文案
 * @param {*} mask 点击蒙版是否关闭
 * @param {*} children
 */
export default (props) => {
  const {
    onClose,
    onSubmit,
    title,
    show = false,
    mask = true,
    children,
    overflow = false,
    okText = "确认",
  } = props;

  const [childDel, setChildDel] = useState(false); // 子组件销毁

  const hanleCLick = (e) => {
    onSubmit();
  };

  useEffect(() => {
    if (show) {
      setChildDel(true);
    } else {
      setTimeout(() => {
        setChildDel(false);
      }, 200);
    }
  }, [show]);

  return (
    <View className="PopLayout">
      <View
        catchMove
        className={"PopLayout_mask" + (show ? " pop_show" : "pop_hide")}
        onClick={() => mask && onClose()}
      ></View>
      <View
        className={"PopLayout_content"}
        style={{ transform: `translateY(${!show ? "100%" : "0"})` }}
      >
        <View className="poplayout_top">
          <View className="poplayout_left">
            <Text className="poplayout_close" onClick={onClose}>
              取消
            </Text>
          </View>
          <View className="poplayout_title">{title}</View>
          <View className="poplayout_right">
            <Text className="poplayout_sure" onClick={hanleCLick}>
              {okText}
            </Text>
          </View>
        </View>
        {childDel && (
          <View className="poplayout_children">
            {typeof children != "function" ? children : children({ onSubmit })}
          </View>
        )}
      </View>
    </View>
  );
};
