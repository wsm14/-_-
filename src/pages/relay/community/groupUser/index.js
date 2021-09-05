import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Nav from "@/relay/components/navigaton";
import Card from "./components/user";
import ShareInfo from "@/relay/components/shareInfo";
import { getShareInfo } from "@/server/common";
import { fetchCommunityUser, fetchUserCenter } from "@/server/relay";
import UserCard from "@/relay/components/UserCard";
import { loginStatus, toast } from "@/common/utils";
import Router from "@/common/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
        page: 1,
        limit: 10,
      },
      communityOrganizationInfo: {},
      communityOrganizationList: [],
      visible: false,
      shareData: {},
    };
  }
  fetchShareInfo(val) {
    const { communityOrganizationId, ownerId } = val;
    if (!loginStatus()) {
      return Router({
        routerName: "login",
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

  componentDidMount() {
    this.fecthDetails();
    this.fetchUser();
  }
  fetchUser() {
    const { httpData } = this.state;
    const { ownerId } = httpData;
    fetchUserCenter({ userId: ownerId }, (res) => {
      this.setState({
        communityOrganizationInfo: { ...res },
      });
    });
  }
  fecthDetails() {
    const { httpData } = this.state;
    fetchCommunityUser(httpData, (res) => {
      const { communityOrganizationList = [] } = res;
      this.setState({
        communityOrganizationList: [
          ...this.state.communityOrganizationList,
          ...communityOrganizationList.map((item) => {
            return { ...item, subscribeFlag: "1" };
          }),
        ],
      });
    });
  }
  onReachBottom() {
    this.setState(
      {
        httpData: {
          ...this.state.httpData,
          page: this.state.httpData.page + 1,
        },
      },
      (res) => {
        this.fecthDetails();
      }
    );
  } //上拉加载

  render() {
    const {
      communityOrganizationList = [],
      communityOrganizationInfo,
      communityOrganizationInfo: {},
      visible,
      shareData,
    } = this.state;
    return (
      <View>
        <Nav backFlag select></Nav>
        <View className="groupUser_green_box">
          <View className="groupUser_green_height"></View>
          <View className="groupUser_after_box">
            <Card
              reload={this.fecthDetails.bind(this)}
              shareInfo={this.fetchShareInfo.bind(this)}
              data={communityOrganizationInfo}
            ></Card>
            <View className="groupUser_after_shopHeight"></View>
            <UserCard
              shareInfo={(val) => {
                if (!loginStatus()) {
                  Router({ routerName: "login" });
                } else {
                  this.fetchShareInfo(val);
                }
              }}
              upDateList={(item) => {}}
              list={communityOrganizationList}
            ></UserCard>
            <View className="groupUser_after_toast">没有更多了</View>
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
