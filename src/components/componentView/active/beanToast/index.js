import React from "react";
import Taro from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";
export default ({ show, onClose, onChange, onLink }) => {
  if (show) {
    return (
      <View
        catchMove
        className="beanToast_layer public_center"
        onClick={(e) => {
          onClose && onClose();
        }}
      >
        <View
          className="beanToast_box"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View className="beanToast_box_btn">
            <View
              className="beanToast_btn_left"
              onClick={() => {
                onChange && onChange();
              }}
            >
              直接购买
            </View>
            <View
              className="beanToast_btn_right"
              onClick={() => {
                onLink && onLink();
              }}
            >
              赚取卡豆
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
