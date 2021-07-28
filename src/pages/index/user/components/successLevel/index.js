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
        className="rules_box public_center"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        catchMove
      >
        <View
          className="rules_success_box"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <View className="rules_success_btn public_auto">
            <View
              className="rules_success_btnLeft public_center"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              取消
            </View>
            <View
              className="rules_success_btnRight public_center"
              onClick={() => {
                canfirm();
              }}
            >
              打开APP查看权益
            </View>
          </View>
        </View>
      </View>
    );
  } else {
    return null;
  }
};
