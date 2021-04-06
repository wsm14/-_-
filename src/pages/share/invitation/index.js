import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import { getShareNewYearSpecialActivity } from "@/server/share";
import "./index.scss";
import {
  backgroundObj,
  GetDistance,
  getLat,
  getLnt,
  toast,
  navigateTo,
} from "@/common/utils";
import { loginBtn } from "@/common/authority";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      specialActivityId: getCurrentInstance().router.params.specialActivityId,
      shareUserId: getCurrentInstance().router.params.shareUserId,
      specialGoodsInfo: {},
      userInfo: {},
    };
  }
  componentWillUnmount() {
    const { specialActivityId, merchantId, shareUserId } = this.state;
    if (!specialActivityId || !merchantId || !shareUserId) {
      toast("参数缺失");
    }
  }
  componentDidShow() {
    this.getShareNewYearSpecialActivity();
  }
  getShareNewYearSpecialActivity() {
    const { specialActivityId, merchantId, shareUserId } = this.state;
    getShareNewYearSpecialActivity(
      { specialActivityId, merchantId, shareUserId },
      (res) => {
        const { specialGoodsInfo, userInfo } = res;
        this.setState({
          specialGoodsInfo,
          userInfo,
        });
      }
    );
  }
  render() {
    const { 
      specialGoodsInfo: {
        lat,
        lnt,
        merchantName,
        goodsImg,
        merchantAddress,
        goodsName,
        goodsStock,
        activityBoostStatus = "0",
        oriPrice,
        realPrice,
        specialActivityIdString,
        merchantIdString
      },
      userInfo: { username,userIdString },
    } = this.state;
    const template = {
      0: (
        <>
          <View className="invitation_btnBox public_auto">
            <View
              onClick={() =>loginBtn(() => {
                navigateTo("/pages/perimeter/lookShare/index");
              })}
              className="invitation_btn1 invitation_btnStyle"
            >
              捡豆购买
            </View>
            <View
              onClick={() => loginBtn(() => {
                navigateTo(
                  `/pages/goods/favourOrder/index?merchantId=${merchantIdString}&specialActivityId=${specialActivityIdString}&shareUserId=${userIdString}`
                );
              })}
              className="invitation_btn2 invitation_btnStyle"
            >
              直接购买
            </View>
          </View>
          <View className="invitation_gl">
            <Text className="invitation_liner">——</Text> 捡豆攻略{" "}
            <Text className="invitation_liner">——</Text>
          </View>

          <View className="invitation_descText">
            <Text className="color3"> 捡豆方式一：</Text>看分享打卡捡豆豆
            <View>进入哒卡乐“看分享”栏目，观看视频/图文可获得豆豆。</View>
          </View>

          <View className="invitation_descText1">
            <Text className="color3"> 捡豆方式二：</Text>线下扫码打卡捡豆豆
            <View>通过哒卡乐扫到店打卡码，即可获得豆豆。</View>
          </View>
          <View className="invitation_descText1">
            <Text className="color3"> 豆豆越多，消费抵扣越多哦～</Text>
          </View>
        </>
      ),
      1: (
        <>
          <View className="invitation_success_pay">已下单助力购买成功</View>
          <View className="invitation_success_btn" onClick={() => navigateTo(`/pages/share/download/index`)}>我也要参加</View>
          <View className="invitation_gl">
            <Text className="invitation_liner">——</Text> 温馨提示{" "}
            <Text className="invitation_liner">——</Text>
          </View>
          <View className="invitation_descText">
            发起助力活动即可有机会免单，除本商品外还有其他多款商品可选择，参与本次活动需要下载哒卡乐App哦～
          </View>
        </>
      ),
    }[activityBoostStatus];
    if(Object.keys(specialGoodsInfo).length>0){
      return (
        <View className="invitation_box">
          <View className="invitation_content_box">
            <View className="invitation_cover"></View>
            <View className="invitation_content_title font_hide">
              {username}，邀你一起共享特惠商品
            </View>
            <View className="invitation_content_toast font_hide">
              看分享捡豆豆，豆豆抵消费哦
            </View>
            <View
              style={goodsImg ? backgroundObj(goodsImg) : {}}
              className="invitation_coverImage dakale_nullImage"
            >
              <View className="invitation_coverLayer">
                <View className="invitation_merchant font_hide">
                  {merchantName}
                </View>
                <View className="invitation_limit font_hide">
                  {" "}
                  {GetDistance(getLat(), getLnt(), lat, lnt)}
                  ｜{merchantAddress}
                </View>
              </View>
            </View>
            <View className="invitation_goodsName font_hide">{goodsName}</View>
            <View className="invitation_desc font_hide">
              仅限杭州线下核销使用 | 剩余{goodsStock}份
            </View>
            <View className="invitation_price">
              <Text className="invitation_price_style1">￥</Text>
              <Text className="invitation_price_style2">{realPrice}</Text>{" "}
              <Text className="invitation_price_style3">￥{oriPrice}</Text>
            </View>
            {template}
          </View>
        </View>
      );
    }
   else return null
  }
}

export default Index;