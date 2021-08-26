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

import {
  fetchOrganizationUserDetail,
  fetchOrganizationRecord,
} from "@/server/relay";
import { toast } from "@/common/utils";
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
    };
  }
  componentWillUnmount() {}

  componentDidMount() {
    this.fecthDetails();
  }
  fetchRecord() {
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
    } = this.state;
    return (
      <Nav backFlag select>
        <View className="community_green_box">
          <View className="community_green_height"></View>
          <View className="community_after_box">
            <Card
              upDateList={() => {
                this.setState({
                  communityTeamUserInfo: {
                    ...communityTeamUserInfo,
                    subscribeFlag: "1",
                  },
                });
              }}
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
              submit={this.payInit.bind(this)}
            ></PayCard>
          </View>
        </View>
      </Nav>
    );
  }
}

export default Index;
