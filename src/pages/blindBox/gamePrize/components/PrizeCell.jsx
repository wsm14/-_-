import React from "react";
import { View } from "@tarojs/components";
import "./index.scss";

// 奖品记录提示语句
export const PRIZE_TIP_TEXT = {
  bean: "卡豆已发放至卡豆余额中",
  onlineGoods: "可在我的奖品中查看", // 线上商品
  actualGoods: "凭记录线下直接领取", // 实物
  rightGoods: "可在我的券包中查看", // 霸王餐
};

/**
 * 我的奖品块
 * @param {Boolean} showButton 是否显示底部按钮
 * @param {String} cellType 奖励类型 展示不同按钮和提示文案
 * @param {String} rewardChannel 卡豆领取地点 hitting-打卡 adverties-看广告
 * @param {String} name 商品名称
 * @param {String} img 商品图片
 * @param {String} time 领取时间
 * @param {String} tip 状态提示文案（邮寄）
 * @param {Object} buttonProps 按钮属性
 * cellType {
 *  bean-卡豆
 *  rightGoods-霸王餐
 *  actualGoods-实物
 *  onlineGoods-线上商品
 * }
 * buttonProps {
 *  @param {Boolean} disabled 可否点击
 *  @param {String} text 文案
 *  @param {Function} onClick 点击事件
 * }
 */
export default ({
  cellType = "bean",
  tip = "",
  name,
  img = "",
  time,
  rewardChannel = "",
  showButton = true,
  buttonProps = {},
}) => {
  const { disabled, text, onClick } = buttonProps;

  return (
    <View className="myPrize_cell">
      <View className="myPrize_detail">
        {/* 打卡奖励 beanCheck 广告奖励 beanAd*/}
        <View
          className={`myPrize_img ${
            cellType === "bean" &&
            { hitting: "beanCheck", advertise: "beanAd" }[rewardChannel]
          }`}
          style={{ backgroundImage: `url(${img})` }}
        ></View>
        <View className="myPrize_info">
          <View className="myPrize_name">{name}</View>
          <View className="myPrize_num">数量：1</View>
          <View className="myPrize_tip">{tip || PRIZE_TIP_TEXT[cellType]}</View>
        </View>
      </View>
      <View className="myPrize_footer">
        <View className="myPrize_footer_time">{time}</View>
        {showButton && (
          <View
            className={`myPrize_footer_btn ${disabled && "none"}`}
            onClick={!disabled && onClick}
          >
            {text}
          </View>
        )}
      </View>
    </View>
  );
};
