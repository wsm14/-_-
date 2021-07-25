import React from "react";
import Taro from "@tarojs/taro";
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import "./index.scss";
export default ({ show, onClose, item }) => {
  if (show) {
    return (
      <View
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
                onClose && onClose();
              }}
            >
              直接购买
            </View>
            <View
              className="beanToast_btn_right"
              onClick={() => {
                onClose && onClose();
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
