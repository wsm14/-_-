import React, { useState, useEffect } from "react";
import { View, Image } from "@tarojs/components";
import "./index.scss";

/**
 *
 * @param {*} show 打开状态
 * @param {*} onClose 关闭
 */
export default (props) => {
  const { onClose, show = false } = props;

  const [childDel, setChildDel] = useState(false); // 子组件销毁

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
    <View className="blind_layout">
      <View
        catchMove
        className={"PopLayout_mask" + (show ? " pop_show" : "pop_hide")}
        onClick={onClose}
      ></View>
      <View
        className={"PopLayout_content"}
        style={{ transform: `translateY(${!show ? "100%" : "0"})` }}
      >
        <View className="blind_layout_title"></View>
        {childDel && (
          <View className="blind_layout_group">
            <View className="blind_goods_cell">
              <Image
                src="https://wechat-config.dakale.net/miniprogram/blind/home/bean_special.png"
                className="blind_goods_img"
              ></Image>
              <View className="blind_goods_name">
                MAC口红口红口红口红口红口红口红口红MAC口红口红口红口红口红口红口红口红
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
