import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import { getUserBeanInfo } from "@/server/user";
import router from "@/utils/router";
import Card from "./components/card";
import Group from "./components/group";
import JoinGrounp from "./components/joinGroup";
import {
  fetchListTogether,
  fetchStartGroupRebate,
  fetchJoinGroupRebate,
  fetchStartGroupByStatus,
  fetchJoinGroupByStatus,
} from "@/server/user";
import Toast from "@/components/public_ui/selectToast";
import Shop from "./components/shop";
import Router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      list: [
        { key: "拼赚中心", val: 0 },
        { key: "我的开团", val: 1 },
        { key: "我的参团", val: 2 },
      ],
      selectType: 0,

      userJoinPage: {
        page: 1,
        limit: 10,
      },
      //拼赚中心
      startByPage: {
        page: 1,
        limit: 10,
        status: 0,
      },
      //我的开团

      userJoinPage: { page: 1, limit: 10, status: 0 },
      //我的参团
      startRebate: {},
      endRebate: {},
      togetherGroupConfigList: [],
      userStartGroupList: [],
      userJoinGroupList: [],
      visible: false,
    };
  }
  componentDidMount() {
    this.fetchJoinList();
    this.fetchStartRebate();
    this.fetchStartByStatus();
  }
  fetchStartRebate() {
    fetchStartGroupRebate({}).then((val) => {
      const { willRebateFee, accumulativeRebateFee } = val;
      this.setState({
        startRebate: {
          willRebateFee,
          accumulativeRebateFee,
        },
      });
    });
  }
  fetchJoinRebate() {
    fetchJoinGroupRebate({}).then((val) => {
      const { totalWinTimes, totalWinRed } = this.state;
      this.setState({
        endRebate: {
          totalWinTimes,
          totalWinRed,
        },
      });
    });
  }
  fetchJoinList() {
    const { userJoinPage } = this.state;
    fetchListTogether(userJoinPage).then((val) => {
      const { togetherGroupConfigList = [] } = val;
      this.setState({
        togetherGroupConfigList: [
          ...this.state.togetherGroupConfigList,
          ...togetherGroupConfigList,
        ],
      });
    });
  }
  fetchStartByStatus() {
    const { startByPage } = this.state;
    fetchStartGroupByStatus(startByPage).then((val) => {
      const { userStartGroupList } = val;
      this.setState({
        userStartGroupList: [
          ...this.state.userStartGroupList,
          ...userStartGroupList,
        ],
      });
    });
  }
  fetchGroupByStatus() {
    const { userJoinPage } = this.state;
    fetchJoinGroupByStatus(userJoinPage).then((val) => {
      const { userJoinGroupList } = val;
      this.setState({
        userJoinGroupList: [
          ...this.state.userJoinGroupList,
          ...userJoinGroupList,
        ],
      });
    });
  }
  handlerStart(e) {
    this.setState(
      {
        userStartGroupList: [],
        startByPage: {
          page: 1,
          limit: 10,
          status: e,
        },
      },
      () => {
        this.fetchStartByStatus();
      }
    );
  }
  handlerJoin(e) {
    this.setState(
      {
        userJoinGroupList: [],
        userJoinPage: {
          page: 1,
          limit: 10,
          status: e,
        },
      },
      () => {
        this.fetchGroupByStatus();
      }
    );
  }
  errorToast(e) {}
  render() {
    const {
      list,
      selectType,
      togetherGroupConfigList,
      startRebate,
      endRebate,
      userStartGroupList,
      startByPage,
      userJoinGroupList,
      userJoinPage,
      visible,
    } = this.state;
    const { status } = startByPage;
    const temlate = {
      0: (
        <View className="collage_one_margin">
          {togetherGroupConfigList.map((item) => {
            return (
              <Shop
                linkToDownLoad={() => this.setState({ visible: true })}
                data={item}
                type={0}
              ></Shop>
            );
          })}
        </View>
      ),
      1: (
        <Group
          status={status}
          onChange={this.handlerStart.bind(this)}
          data={userStartGroupList}
          type={selectType}
        ></Group>
      ),
      2: (
        <JoinGrounp
          status={userJoinPage.status}
          onChange={this.handlerJoin.bind(this)}
          data={userJoinGroupList}
          type={selectType}
        ></JoinGrounp>
      ),
    }[selectType];
    return (
      <View className="collage_box">
        <View className="collage_top_info">
          <View className="collage_select_box">
            {list.map((item, index) => {
              return (
                <View
                  onClick={() => {
                    this.setState({
                      selectType: index,
                    });
                  }}
                  className={`collage_select ${
                    index === selectType
                      ? "collage_select_style2"
                      : "collage_select_style1"
                  }`}
                >
                  {item.key}
                </View>
              );
            })}
          </View>
          <Card
            startRebate={startRebate}
            endRebate={endRebate}
            type={selectType}
          ></Card>
        </View>
        {temlate}
        {visible && (
          <Toast
            cancel={() =>
              this.setState({
                visible: false,
              })
            }
            visible={visible}
            canfirm={() => {
              this.setState({ visible: false }, (res) => {
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
