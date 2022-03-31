import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import { getUserBeanInfo } from "@/server/user";
import Toast from "@/components/public_ui/selectToast";
import router from "@/utils/router";
import Card from "./components/card";
import Group from "./components/group";
import {
  fetchListTogether,
  fetchStartGroupRebate,
  fetchJoinGroupRebate,
  fetchStartGroupByStatus,
} from "@/server/user";
import Shop from "./components/shop";
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
      startRebate: {},
      endRebate: {},
      togetherGroupConfigList: [],
      userStartGroupList: [],
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
    } = this.state;
    const { status } = startByPage;
    const temlate = {
      0: (
        <View className="collage_one_margin">
          {togetherGroupConfigList.map((item) => {
            return <Shop data={item} type={0}></Shop>;
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
      </View>
    );
  }
}

export default Index;
