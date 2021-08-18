import React, { useState, useEffect } from "react";
import Taro, { useScope } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import ButtonView from "@/components/Button";
import classNames from "classnames";
import Router from "@/common/router";
export default (props) => {
  const { visible = false, onClose, canfirm, data } = props;
  const { level = "0" } = data;
  if (visible) {
    return (
      <View
        className="rules_box animated fadeIn public_center"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        catchMove
      >
        <View>
          <View className="user_toast_layers">
            <Image
              src={`https://wechat-config.dakale.net/miniprogram/image/lever_wechat_${level}.png`}
              className="user_toast_image"
            ></Image>
            <View
              className="user_toast_btnInfo public_center"
              onClick={() => canfirm()}
            >
              立即下载「哒卡乐」APP
            </View>
          </View>
          <View className="user_toast_close" onClick={() => onClose()}></View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
