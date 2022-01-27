import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  componentWillUnmount() {}
  componentDidMount() {}
  render() {
    return (
      <View className="interests_box">
        <View className="interests_title">1、随时退</View>
        <View className="interests_font">
          购买成功且未核销使用，进入到该订单详情页面，申请退款；
        </View>
        <View className="interests_font">
          申请退款成功之后，订单受理中的状态可在订单详情页面查看进度；
        </View>
        <View className="interests_font">
          5分钟内会退款成功，通过第三方支付的金额将按原路退回，使用的卡豆抵扣金额将退回至卡豆账户。
        </View>
        <View className="interests_title">2、过期退</View>
        <View className="interests_font">购买成功且未使用的券过期；</View>
        <View className="interests_font">过期后将自动退款；</View>
        <View className="interests_font">退款金额将按原付款路径返回。</View>
        <View className="interests_title">
          3、以下情况不享受随时退、过期自动退服务
        </View>
        <View className="interests_font">已经使用的券；</View>
        <View className="interests_font">
          购买页面未标示“随时退、过期退”的券；
        </View>
        <View className="interests_font">
          用户在使用哒卡乐服务过程中有欺诈，违法或者违反本网站《用户使用协议》的行为。
        </View>
        <View className="interests_title">4、卡豆抵扣</View>
        <View className="interests_font">
          购买商品时，根据身份级别的不同，可使用的卡豆抵扣额度不同，具体额度如下：
        </View>
        <View className="interests_img_box">
          <Image
            lazyLoad
            className="desc_img"
            src="https://wechat-config.dakale.net/miniprogram/image/icon600.png"
          ></Image>
        </View>
        <View className="interests_title">
          5、卡豆获取攻略，通过以下途径获取卡豆
        </View>
        <View className="interests_font">看商家发布的视频</View>
        <View className="interests_font">到店打卡</View>
        <View className="interests_font">圈层消费</View>
      </View>
    );
  }
}

export default Index;
