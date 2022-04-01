import React, { Component, useState } from "react";
import { getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { fetchGroupDetail } from "@/server/user";
import ClooageTime from "./components/clooageTime";
import Content from "./components/shopCard";
import ShopDesc from "./components/shopDesc";
import Rule from "./components/payToast";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      groupId: getCurrentInstance().router.params.groupId,
      type: getCurrentInstance().router.params.type || "2",
      groupDetail: {},
      startGroupUser: {},
      joinGroupUserList: [],
      visible: false,
    };
  }
  componentDidShow() {
    this.fetchData();
  }
  fetchData() {
    const { groupId } = this.state;
    fetchGroupDetail({ groupId }).then((val) => {
      const { groupDetail, startGroupUser, joinGroupUserList } = val;
      this.setState({
        groupDetail,
        startGroupUser,
        joinGroupUserList,
      });
    });
  }
  errorToast(e) {}
  render() {
    const { groupDetail, startGroupUser, joinGroupUserList, type, visible } =
      this.state;
    const { togetherEarnGoodsObject = {}, togetherRebateParamObject = {} } =
      groupDetail;
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
          className="collageDetails_rule public_center"
        >
          活动规则
        </View>
      );
    };
    return (
      <View className="collageDetails_box">
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

        <ClooageTime data={groupDetail}></ClooageTime>
        <Content
          type={type}
          startGroupUser={startGroupUser}
          list={joinGroupUserList}
          data={groupDetail}
        ></Content>
        <View className="collageDetails_price_box">
          <View className="collageDetails_price1">¥{oriPrice}</View>
          <View className="collageDetails_price2">
            <Text className="font36">¥ </Text>
            {notWinFee}
          </View>
          <View className="collageDetails_price3">¥{togetherPrice}</View>
        </View>
        <ShopDesc data={groupDetail}></ShopDesc>
      </View>
    );
  }
}

export default Index;
