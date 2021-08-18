import React from "react";
import { View } from "@tarojs/components";
import Router from "@/common/router";
import { toast } from "@/common/utils";
export default ({ levelDetails, fetchUserLeverToast, incomeBean }) => {
  const {
    teamUserCount = 0,
    nextLevelInfo,
    monthIncome = 0,
    monthToIncome = 0,
    totalIncome = 0,
  } = levelDetails;
  return (
    <View
      className="user_content_kolBox"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <View className="user_newkol_box">
        <View className="user_newkol_left font_hide">
          <View className="user_newkol_pay">可提现金额(元)</View>
          <View className="user_newkol_money font_hide">
            {(incomeBean / 100).toFixed(2)}
          </View>
          <View
            className="user_newkol_btnBox user_newkol_btn1 public_center"
            style={{ border: " 1px solid #ef476f" }}
            onClick={() =>
              Router({
                routerName: "download",
              })
            }
          >
            查看
          </View>
        </View>
        <View className="user_newkol_right font_hide">
          <View className="user_newkol_pay">我的团队(人)</View>
          <View className="user_newkol_money font_hide">{teamUserCount}</View>
          <View
            className="user_newkol_btnBox user_newkol_btn2 public_center"
            style={{ border: " 1px solid #07c0c2" }}
            onClick={() =>
              Router({
                routerName: "download",
              })
            }
          >
            查看
          </View>
        </View>
      </View>
      <View className="user_newkol_otherdetails">
        <View className="user_newkol_other1">
          <View className="user_newkol_otherMoney">
            {(totalIncome / 100).toFixed(2)}
          </View>
          <View className="user_newkol_otherToast">总收益/元</View>
        </View>
        <View className="user_newkol_liner"></View>
        <View className="user_newkol_other2">
          <View className="user_newkol_otherMoney">
            {(monthIncome / 100).toFixed(2)}
          </View>
          <View className="user_newkol_otherToast">本月累计收益/元</View>
        </View>
        <View className="user_newkol_liner"></View>
        <View className="user_newkol_other3">
          <View className="user_newkol_otherMoney">
            {(monthToIncome / 100).toFixed(2)}
          </View>
          <View className="user_newkol_otherToast">本月待收益/元</View>
        </View>
      </View>
      <View
        className="user_card_nextNever"
        onClick={() => {
          toast("跳转权益中心");
        }}
      >
        <View className="user_card_nextfont">{nextLevelInfo + " >"}</View>
        <View
          className="user_card_nextBtn"
          onClick={(e) => {
            e.stopPropagation();
            fetchUserLeverToast();
          }}
        ></View>
      </View>
    </View>
  );
};
