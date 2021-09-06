import React, { useState } from "react";
import { useDidShow } from "@tarojs/taro";
import Router from "@/common/router";
import { View, Text, Button } from "@tarojs/components";
import { fetchBankInfo } from "@/server/relay";
import { backgroundObj } from "@/common/utils";
import "./index.scss";
/**
 * 我的钱包
 */
export default () => {
  const [data, setData] = useState({});

  useDidShow(() => {
    getUserInfo();
  });

  // 获取用户信息
  const getUserInfo = () => {
    fetchBankInfo().then((res) => {
      const { incomeCash, bankBindingInfo, bankStatus } = res;
      setData({ incomeCash, ...bankBindingInfo, bankStatus });
    });
  };
  const {
    incomeCash = 0,
    bankName,
    bankIcon,
    bankImg,
    bankHideNumber,
    bankStatus,
  } = data;

  return (
    <View className="Purse_content">
      {/* <View className="purse_tip">资金到账时间预计有1分钟延迟，请耐心等待</View> */}
      <View className="purse_price_content">
        <View className="purse_bean_iconBox"></View>
        <Text className="purse_price_all">卡豆余额</Text>
        <Text className="purse_price">{parseInt(incomeCash * 100)}</Text>
      </View>
      <View className="purse_price_menu">
        <View className="purse_menu_group">
          <View
            className="purse_menu_cell"
            onClick={() => Router({ routerName: "purseDetail" })}
          >
            资产明细
          </View>
        </View>
      </View>
      {bankStatus === "3" ? (
        <View
          className="purse_bank_box"
          onClick={() => {
            Router({ routerName: "purseWithdraw" });
          }}
        >
          <View className="purse_bank_toast">
            银行卡
            <View className="purse_bank_link"></View>
          </View>
          <View className="purse_bank_cardBox" style={backgroundObj(bankImg)}>
            <View
              className="purse_bank_cardProfile"
              style={backgroundObj(bankIcon)}
            ></View>
            <View className="purse_bank_cardText font_noHide">{bankName}</View>
            <View className="purse_bank_cardnumHide">{bankHideNumber}</View>
          </View>
        </View>
      ) : (
        <View
          className="purse_bank_box"
          onClick={() => {
            Router({ routerName: "bankForm" });
          }}
        >
          <View className="purse_bank_toast">银行卡</View>
          <View className="purse_bank_add">添加银行卡</View>
        </View>
      )}
      <View className="purse_bottom_tip">哒卡乐支付安全保障中</View>
    </View>
  );
};
