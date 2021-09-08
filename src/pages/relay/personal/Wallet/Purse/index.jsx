import React, { useState } from "react";
import { useDidShow } from "@tarojs/taro";
import Router from "@/common/router";
import { View, Text, Button } from "@tarojs/components";
import { fetchBankInfo } from "@/server/relay";
import { backgroundObj, navigateTo } from "@/common/utils";
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
      const { incomeCash, bankBindingInfo, bankStatus, beanCash } = res;
      setData({ incomeCash, ...bankBindingInfo, bankStatus, beanCash });
    });
  };
  const {
    incomeCash = 0,
    bankName,
    bankIcon,
    bankImg,
    bankHideNumber,
    bankStatus,
    beanCash = 0,
  } = data;

  return (
    <View className="Purse_content">
      {/* <View className="purse_tip">资金到账时间预计有1分钟延迟，请耐心等待</View> */}
      <View className="purse_price_content">
        <View className="purse_bean_iconBox"></View>
        <Text className="purse_price_all">卡豆余额</Text>
        <Text className="purse_price">
          {parseInt(incomeCash * 100) + parseInt(beanCash * 100)}
        </Text>
      </View>
      <View className="purse_beanBox">
        <View className="purse_beanDec">
          <View
            onClick={() => navigateTo("/pages/newUser/rewardDetails/index")}
            className="purse_money purse_moneyPad1"
          >
            <View className="purse_moneyBox  purse_moneyPad1">奖励卡豆</View>
            <View className="purse_fonts color1 font40 bold">
              {parseInt(beanCash * 100)}
            </View>
            <View
              className="purse_linkGo purse_linkGoIcon"
              onClick={(e) => {
                e.stopPropagation();
                navigateTo("/pages/newUser/rewardDetails/index");
              }}
            ></View>
          </View>
          <View className="purse_liner"></View>
          <View className="purse_money">
            <View
              className="purse_moneyBox  purse_moneyPad2"
              onClick={(e) => {
                e.stopPropagation();
                Router({ routerName: "purseDetail" });
              }}
            >
              收益卡豆
            </View>
            <View className="purse_fonts color1 font40 bold">
              {parseInt(incomeCash * 100)}
            </View>
            <View className="purse_linkGo1 purse_linkGoIcon"></View>
            {bankStatus === "3" && (
              <View
                className="purse_btn font24 color6"
                onClick={(e) => {
                  e.stopPropagation();
                  Router({ routerName: "purseWithdraw" });
                }}
              >
                提现
              </View>
            )}
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
