import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Nav from "@/relay/components/navigaton";
import Card from "./components/user";
import BuyCard from "./components/buyCard";
import GoodsInfo from "./components/goodCard";
import NodeCard from "./components/nodeCard";
import PayCard from "./components/payCard";
import FromTemplate from "@/relay/components/FormTemplate";
import ShareInfo from "@/relay/components/shareInfo";
import { getShareInfo, getShareParamInfo } from "@/server/common";
import {
  fetchOrganizationUserDetail,
  fetchOrganizationRecord,
  fetchOrganizationShare,
} from "@/server/relay";
import { loginStatus, toast } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      count: 1,
      httpData: {
        ...getCurrentInstance().router.params,
      },
      communityOrganizationInfo: {},
      communityTeamUserInfo: {},
      consumerRecordList: [],
      visible: false,
      shareData: {},
      index: 0,
    };
  }
  fetchShareInfo() {
    const { communityOrganizationId, ownerId } = this.state.httpData;
    const { shareData } = this.state;
    if (!loginStatus()) {
      return Router({
        routerName: "login",
      });
    } else {
      if (Object.keys(shareData).length > 0) {
        this.setState({
          visible: true,
        });
      } else {
        getShareInfo(
          {
            shareType: "communityGoods",
            shareId: communityOrganizationId,
            shardingKey: ownerId,
          },
          (res) => {
            this.setState(
              {
                shareData: { ...res },
              },
              (res) => {
                this.setState({
                  visible: true,
                });
              }
            );
          }
        );
      }
    }
  }
  fetchShareView() {
    const { communityOrganizationId, ownerId } = this.state;
    fetchOrganizationShare({ communityOrganizationId, ownerId });
  }
  onShareAppMessage(res) {
    const { shareData } = this.state;
    const { title, miniProgramUrl, frontImage } = shareData;
    if (res.from === "button") {
      return {
        title: title,
        path: miniProgramUrl,
        imageUrl: frontImage,
      };
    }
    return {
      title: title,
      imageUrl: frontImage,
      path: miniProgramUrl,
    };
  }

  componentDidShow() {
    let { scene } = getCurrentInstance().router.params;
    let { httpData } = this.state;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        let {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          param = JSON.parse(param);
          this.setState(
            {
              httpData: { ...httpData, ...param },
            },
            (res) => {
              this.fecthDetails();
              this.fetchRecord();
              this.fetchShareView();
            }
          );
        }
      });
    } else {
      const { shareUserId } = this.state;
      if (shareUserId) {
        this.fetchShareView();
      }
      this.fecthDetails();
      this.fetchRecord();
    }
  }
  fetchRecord() {
    const { httpData } = this.state;
    fetchOrganizationRecord({ ...httpData, page: 1, limit: 20 }).then((val) => {
      const { consumerRecordList = [] } = val;
      this.setState({
        consumerRecordList,
      });
    });
  }
  payInit() {
    const { count, httpData, communityOrganizationInfo } = this.state;
    const { ownerId } = httpData;
    const { communityOrganizationGoodsList = [] } = communityOrganizationInfo;
    const { communityOrganizationGoodsId } = communityOrganizationGoodsList[0];
    Router({
      routerName: "communityOrder",
      args: {
        count,
        communityOrganizationGoodsId,
        ownerId,
      },
    });
  }
  fecthDetails() {
    const { httpData } = this.state;
    fetchOrganizationUserDetail(httpData, (res) => {
      const { communityOrganizationInfo = {}, communityTeamUserInfo = {} } =
        res;
      this.setState({
        communityOrganizationInfo,
        communityTeamUserInfo,
      });
    });
  }
  onChange(type = "add") {
    const { count } = this.state;
    if (type === "add") {
      if (count === 99) {
        return toast("选择数量已到最大值");
      }
      this.setState({
        count: count + 1,
      });
    } else {
      if (count === 1) {
        return toast("选择数量不能为0");
      }
      this.setState({
        count: count - 1,
      });
    }
  }
  render() {
    const {
      count,
      communityOrganizationInfo,
      communityTeamUserInfo,
      consumerRecordList = [],
      communityOrganizationInfo: { communityContentObjectList = [] },
      visible,
      shareData,
    } = this.state;
    return (
      <View>
        <Nav backFlag select></Nav>
        <View className="community_green_box">
          <View className="community_green_height"></View>
          <View className="community_after_box">
            <Card
              reload={this.fecthDetails.bind(this)}
              shareInfo={this.fetchShareInfo.bind(this)}
              data={{ ...communityOrganizationInfo, ...communityTeamUserInfo }}
            ></Card>
            <View className="community_after_shopHeight"></View>
            <GoodsInfo
              data={{ ...communityOrganizationInfo, ...communityTeamUserInfo }}
            ></GoodsInfo>
            <FromTemplate data={communityContentObjectList}></FromTemplate>
            <BuyCard
              onChange={this.onChange.bind(this)}
              count={count}
              data={{ ...communityOrganizationInfo, ...communityTeamUserInfo }}
            ></BuyCard>
            <NodeCard data={consumerRecordList}></NodeCard>
            <PayCard
              data={{ ...communityOrganizationInfo, ...communityTeamUserInfo }}
              count={count}
              shareInfo={this.fetchShareInfo.bind(this)}
              submit={this.payInit.bind(this)}
              getDetail={this.fecthDetails}
            ></PayCard>
          </View>
          <ShareInfo
            onClose={() => {
              this.setState({ visible: false });
            }}
            show={visible}
            data={shareData}
            bottomFlag
          ></ShareInfo>
        </View>
      </View>
    );
  }
}

export default Index;
