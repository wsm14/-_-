import React, { useState, useEffect } from "react";
import Taro, { useScope } from "@tarojs/taro";
import { View } from "@tarojs/components";
import ButtonView from "@/components/Button";
import classNames from "classnames";
import Router from "@/common/router";
export default (props) => {
  const { visible = false, onClose, canfirm } = props;
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
          <View
            className="rules_success_box"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <View
              className="rules_success_btn public_center"
              onClick={() => {
                canfirm();
              }}
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
