import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "@tarojs/components";
import Drawer from "@/components/Drawer";
import Empty from "@/components/Empty";
import { backgroundObj } from "@/utils/utils";
import Taro from "@tarojs/taro";
import "./index.scss";
export default ({
  visible,
  close,
  title,
  content,
  cancel,
  canfirm,
  cancelText,
  canfirmText,
  btnFlag = true,
  hasBtn = true,
  style = {},
}) => {
  if (visible) {
    return (
      <Drawer closeBtn={btnFlag} show={visible} close={close}>
        <View className="payToast_box">
          <View className="payToast_title">{title || "温馨提示"}</View>
          <View style={style} className="payToast_body">
            {content}
          </View>
          {hasBtn ? (
            btnFlag ? (
              <View className="payToast_btn_box public_auto">
                <View
                  className="payToast_btn public_center"
                  onClick={() => {
                    cancel && cancel();
                  }}
                >
                  {cancelText}
                </View>
                <View
                  className="payToast_btn public_center"
                  onClick={() => {
                    canfirm && canfirm();
                  }}
                >
                  {canfirmText}
                </View>
              </View>
            ) : (
              <View className="payToast_btn_box public_center">
                <View
                  className="payToast_btn_one public_center"
                  onClick={() => {
                    canfirm && canfirm();
                  }}
                >
                  {canfirmText}
                </View>
              </View>
            )
          ) : null}
        </View>
      </Drawer>
    );
  } else return null;
};
