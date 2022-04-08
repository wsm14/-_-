import React, { Component, useState } from "react";
import { getCurrentInstance } from "@tarojs/taro";
import { View, Text } from "@tarojs/components";
import { fetchGroupDetail } from "@/server/user";
import { fetchNewShareInfo, fetchShareParamInfo } from "@/server/common";
import ClooageTime from "./components/clooageTime";
import Content from "./components/shopCard";
import ShopDesc from "./components/shopDesc";
import Rule from "./components/payToast";
import ShopDrawer from "./components/shopDrawer";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      groupId: getCurrentInstance().router.params.groupId,
      type: getCurrentInstance().router.params.type || "2",
      groupDetail: {},
      userJoinStatus: "0",
      visible: false,
      joinGroupUserDetail: {},
      ShopDrawerVisible: false,
      shareInfo: {},
    };
  }

  componentDidShow() {
    let { scene, groupId } = getCurrentInstance().router.params;
    if (groupId) {
      this.fetchData();
      this.fetchNewShare();
    } else if (scene) {
      fetchShareParamInfo({ uniqueKey: scene }, (res) => {
        let {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          param = JSON.parse(param);
          let { groupId } = param;
          this.setState(
            {
              groupId,
              type: "2",
            },
            (res) => {
              this.fetchData();
              this.fetchNewShare();
            }
          );
        }
      });
    }
  }

  fetchNewShare() {
    const { groupId } = this.state;
    fetchNewShareInfo({
      shareType: "spellGroup",
      shareId: groupId,
    }).then((val) => {
      const { shareInfo } = val;
      this.setState({
        shareInfo,
      });
    });
  }
  fetchData() {
    const { groupId } = this.state;
    fetchGroupDetail({ groupId }).then((val) => {
      const {
        groupDetail,
        joinGroupUserDetail,
        joinGroupUserList,
        userJoinStatus,
        startGroupUser,
      } = val;
      this.setState({
        groupDetail: {
          ...groupDetail,
          joinGroupUserList,
          startGroupUser,
        },
        joinGroupUserDetail,
        userJoinStatus,
      });
    });
  }
  onShareAppMessage(res) {
    const { shareInfo } = this.state;
    const { miniProgramImage, miniProgramUrl, contentBody } = shareInfo;
    if (res.from === "button") {
      return {
        title: contentBody,
        imageUrl: miniProgramImage,
        path: miniProgramUrl,
        complete: function () {
          // 转发结束之后的回调（转发成不成功都会执行）
          console.log("---转发完成---");
        },
      };
    } else {
      return {
        title: contentBody,
        imageUrl: miniProgramImage,
        path: miniProgramUrl,
        complete: function () {
          // 转发结束之后的回调（转发成不成功都会执行）
          console.log("---转发完成---");
        },
      };
    }
  }
  render() {
    const {
      groupDetail,
      type,
      visible,
      joinGroupUserDetail,
      userJoinStatus,
      ShopDrawerVisible,
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

        <ClooageTime
          reload={() => this.fetchData()}
          data={groupDetail}
        ></ClooageTime>
        <Content
          joinGroupUserDetail={joinGroupUserDetail}
          type={type}
          startGroupUser={startGroupUser}
          list={joinGroupUserList}
          data={groupDetail}
          userJoinStatus={userJoinStatus}
          onChange={() => {
            this.setState({
              ShopDrawerVisible: true,
            });
          }}
        ></Content>
        <View className="collageDetails_price_box">
          <View className="collageDetails_price1">¥{oriPrice}</View>
          <View className="collageDetails_price2">
            <Text className="font36">¥ </Text>
            {togetherPrice}
          </View>
          <View className="collageDetails_price3">¥{notWinFee}</View>
        </View>
        <ShopDesc data={groupDetail}></ShopDesc>
        <ShopDrawer
          data={groupDetail}
          visible={ShopDrawerVisible}
          joinGroupUserDetail={joinGroupUserDetail}
          close={() => {
            this.setState({
              ShopDrawerVisible: false,
            });
          }}
        ></ShopDrawer>
      </View>
    );
  }
}

export default Index;
