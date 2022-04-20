import React, { Component, useState } from "react";
import { getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { fetchTogetherGoodsDetail } from "@/server/user";
import Content from "./components/shopCard";
import ShopDesc from "./../collageDetails/components/shopDesc";
import Rule from "./../collageDetails/components/payToast";
import Toast from "@/components/public_ui/selectToast";
import Router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      togetherGroupConfigId:
        getCurrentInstance().router.params.togetherGroupConfigId,
      type: getCurrentInstance().router.params.type || "2",
      groupDetail: {},
      userJoinStatus: "0",
      visible: false,
      joinGroupUserDetail: {},
      ShopDrawerVisible: false,
      shareInfo: {},
      visible1: false,
    };
  }

  componentDidShow() {
    this.fetchData();
  }

  fetchData() {
    const { togetherGroupConfigId } = this.state;
    fetchTogetherGoodsDetail({ togetherGroupConfigId }).then((val) => {
      const { togetherGroupConfigDetail } = val;
      this.setState({
        groupDetail: {
          ...togetherGroupConfigDetail,
        },
      });
    });
  }

  render() {
    const {
      groupDetail,
      type,
      visible,
      joinGroupUserDetail,
      userJoinStatus,
      ShopDrawerVisible,
      visible1,
    } = this.state;
    const {
      togetherEarnGoodsObject = {},
      togetherRebateParamObject = {},
      startGroupUser = {},
      joinGroupUserList = [],
    } = groupDetail;
    const { togetherPrice, oriPrice } = togetherEarnGoodsObject;
    const { notWinFee } = togetherRebateParamObject;
    const RenderRule = () => {
      return (
        <View
          onClick={() => {
            this.setState({
              visible: true,
            });
          }}
          className="collageDownload_rule public_center"
        >
          活动规则
        </View>
      );
    };
    return (
      <View className="collageDownload_box">
        <RenderRule></RenderRule>
        <Rule
          visible={visible}
          close={() => this.setState({ visible: false })}
          hasBtn={false}
          content={
            "1.邀请用户参与商品拼团，满足成团需求后即可开奖。\n2.拼到商品，平台将提供包邮发货，发货时间为1-3个工作日内。\n3.未拼到商品，支付金额将原路退回，同时获得拼团红包。\n4.拼团商品为限时底价产品，拼团商品经拼团成功后不支持退款，若有质量问题则可提供换货服务。"
          }
          style={{ textAlign: "left" }}
        ></Rule>
        <Content data={groupDetail}></Content>
        <View className="collageDownload_price_box">
          <View className="collageDownload_price1">¥{oriPrice}</View>
          <View className="collageDownload_price2">
            <Text className="font36">¥ </Text>
            {togetherPrice}
          </View>
          <View className="collageDownload_price3">¥{notWinFee}</View>
          <View className="collageDownload_price4">
            ¥{(oriPrice - togetherPrice).toFixed(2)}
          </View>
        </View>
        <ShopDesc data={groupDetail}></ShopDesc>
        <View className="collageDownload_height"></View>
        <View className="collageDownload_down_btn">
          <View
            className="collageDownload_btn_info public_center"
            onClick={() => {
              this.setState({ visible1: true });
            }}
          >
            开团
          </View>
        </View>

        {visible1 && (
          <Toast
            cancel={() =>
              this.setState({
                visible1: false,
              })
            }
            visible={visible1}
            canfirm={() => {
              this.setState({ visible1: false }, (res) => {
                Router({
                  routerName: "download",
                });
              });
            }}
            content={`点击下载哒卡乐App
            一键开团，极速享收益`}
            canfirmText="不差钱"
            cancelText="去赚"
          ></Toast>
        )}
      </View>
    );
  }
}

export default Index;
