import React from "react";
import Taro from "@tarojs/taro";
import { Input, Text, View } from "@tarojs/components";
import { removeStorage } from "@/common/utils";
import "./index.scss";
import {
  getSearchDataStatistic,
  getSearchRecommend,
  getSearchConditions,
} from "@/server/perimeter";
import ContentData from "./components/selectContent/index";
import Router from "@/common/router";

export default class Index extends React.Component {
  constructor() {
    super(...arguments);
    this.instance = null;
    this.state = {
      hotSearchList: [],
      statistic: {
        keyword: "",
      },
      topicInfo: {},
      searchInfo: {},
      status: "0",
      keywords: "",
      // shopData: {
      //   page: 1,
      //   limit: 10,
      //   smartSiftType: 'markFlag'
      // },
      userMerchantList: [],
      countStatus: true,
      storageList: Taro.getStorageSync("storageList") || [],
      setting: {
        tabList: ["商家", "内容", "用户", "话题"],
        current: 0,
      },
    };
  }

  getSearchRecommend() {
    getSearchRecommend({}, (res) => {
      const { hotSearchList = [], topicInfo = {} } = res;
      this.setState({
        hotSearchList,
        topicInfo,
      });
    });
  }

  getSearchConditions() {
    const {
      statistic: { keyword },
      storageList,
    } = this.state;
    if (!storageList.includes(keyword) && storageList.length < 10) {
      this.setState(
        {
          storageList: [keyword, ...this.state.storageList],
        },
        (res) => {
          Taro.setStorageSync("storageList", this.state.storageList);
        }
      );
    } else if (!storageList.includes(keyword) && storageList.length === 10) {
      this.setState(
        {
          storageList: [keyword, ...this.state.storageList].slice(0, 9),
        },
        (res) => {
          Taro.setStorageSync("storageList", this.state.storageList);
        }
      );
    }
  }

  search(e) {
    const {
      statistic: {},
      statistic,
      keyword,
    } = this.state;
    const { value } = e.detail;
    if (keyword === value) {
      return;
    } else {
      this.setState(
        {
          statistic: {
            ...statistic,
            keyword: e.detail.value,
          },
          shopData: {
            page: 1,
            limit: 10,
            smartSiftType: "markFlag",
          },
          userMerchantList: [],
        },
        (res) => {
          if (this.state.statistic.keyword) {
            getSearchDataStatistic(this.state.statistic, (res) => {
              const { userMerchantNum, userMerchantNameList = [] } = res;
              if (userMerchantNum > 0 && userMerchantNameList.length > 0) {
                this.setState({
                  searchInfo: res,
                  status: "1",
                });
              } else {
                this.setState({
                  status: "1",
                });
              }
            });
          } else {
            this.setState({
              searchInfo: {},
              status: "0",
            });
          }
        }
      );
    }
  }

  searchDetails(e) {
    if (this.instance) {
      clearTimeout(this.instance);
      this.instance = setTimeout(this.search.bind(this, e), 300);
    } else {
      this.instance = setTimeout(this.search.bind(this, e), 300);
    }
  }

  cleanList() {
    this.setState(
      {
        storageList: [],
      },
      (res) => {
        removeStorage("storageList");
      }
    );
  }

  changeClick(item) {
    this.setState(
      {
        statistic: {
          keyword: item,
        },
      },
      (res) => {
        this.getSearchConditions();
        this.setState({
          keywords: item,
          status: "2",
        });
      }
    );
  }

  setIndex(index) {
    const that = this;
    if (index != this.state.setting.current) {
      this.setState({
        setting: {
          ...this.state.setting,
          current: index,
        },
      });
    }
    return;
  }

  componentDidMount() {
    this.getSearchRecommend();
  }

  render() {
    const {
      topicInfo: { topicIdString, topicName, kolMomentsNum },
      hotSearchList,
      storageList,
      statistic: { keyword },
      searchInfo,
      searchInfo: {
        userMerchantNum = 0,
        userMerchantNameList = [],
        userNum = 0,
        topicNum = 0,
      },
      status,
      userMerchantList,
      keywords,
    } = this.state;

    const hasListObj = {
      0: (
        <>
          <View className="search_shop_orderTags">
            <View className="search_shop_title color2 font24">最近搜索</View>
            <View
              className="search_shop_close"
              onClick={() => this.cleanList()}
            ></View>
          </View>
          {/*最近搜索*/}

          <View className="search_shopTags font24">
            {storageList.map((item) => {
              return (
                <View
                  onClick={() => this.changeClick(item)}
                  className="shopTag  font_hide"
                >
                  {item}
                </View>
              );
            })}
          </View>
          {/*标签*/}

          <View className="search_shop_liner"></View>
          {/*下划线*/}
          <View
            onClick={() =>
              Router({
                routerName: "tipView",
                args: {
                  topicId: topicIdString,
                },
              })
            }
          >
            <View className="search_hot_search color2 font24 public_auto">
              <Text>推荐话题</Text>
              <Text>{kolMomentsNum}篇分享</Text>
            </View>
            <View className="search_hot_tipName font28 bold color1">
              #{topicName}
            </View>
            <View className="search_hot_liner"></View>
          </View>
          <View className="search_hot_search color2 font24">热门搜索</View>
          {/*热门搜索*/}
          <View className="search_hot_list">
            <View className="search_liner"></View>
            {hotSearchList.map((item) => {
              const { merchantName } = item;
              return (
                <View
                  onClick={() => this.changeClick(merchantName)}
                  className="search_hot_font font_hide font28 color1"
                >
                  {merchantName}
                </View>
              );
            })}
          </View>
        </>
      ),
      1: (
        <View className="fixed_padding">
          <View
            className="search_shop_layer"
            onClick={() => {
              this.setState({
                setting: {
                  tabList: ["商家", "内容", "用户", "话题"],
                  current: 0,
                },
              });
              this.changeClick(keyword);
            }}
          >
            <View className="search_shop_icon"></View>
            <View className="font28 color1 font_hide search_hide">
              {keyword}
            </View>
            <View className="font24 color2 search_shop_right">
              约{userMerchantNum || 0}个商户
            </View>
          </View>
          <View
            className="search_shop_layer"
            onClick={() => {
              this.setState({
                setting: {
                  tabList: ["商家", "内容", "用户", "话题"],
                  current: 1,
                },
              });
              this.changeClick(keyword);
            }}
          >
            <View className="search_user_icon"></View>
            <View className="font28 color1 font_hide search_hide">
              {keyword}
            </View>
            <View className="font24 color2 search_shop_right">
              约{userNum || 0}个用户
            </View>
          </View>
          <View
            className="search_shop_layer"
            onClick={() => {
              this.setState({
                setting: {
                  tabList: ["商家", "内容", "用户", "话题"],
                  current: 2,
                },
              });
              this.changeClick(keyword);
            }}
          >
            <View className="search_share_icon"></View>
            <View className="font28 color1 font_hide search_hide">
              {keyword}
            </View>
            <View className="font24 color2 search_shop_right">
              约{topicNum || 0}个分享
            </View>
          </View>
          <View
            className="search_shop_layer"
            onClick={() => {
              this.setState({
                setting: {
                  tabList: ["商家", "内容", "用户", "话题"],
                  current: 3,
                },
              });
              this.changeClick(keyword);
            }}
          >
            <View className="search_tip_icon"></View>
            <View className="font28 color1 font_hide search_hide">
              {keyword}
            </View>
            <View className="font24 color2 search_shop_right">
              约{searchInfo.kolMomentsNum || 0}个话题
            </View>
          </View>
          {userMerchantNameList.map((item) => {
            return (
              <View
                className="search_shop_layer"
                onClick={() => this.changeClick(item)}
              >
                <View className="search_seach_icon"></View>
                <View className="font28 color1 font_hide search_hide">
                  {item}
                </View>
              </View>
            );
          })}
        </View>
      ),
      2: (
        <ContentData
          fn={this.setIndex.bind(this)}
          keyword={keywords}
          setting={this.state.setting}
          userList={userMerchantList}
        ></ContentData>
      ),
    }[status];
    return (
      <View className="search_shop_box">
        <View className="search_shop_padding">
          <View className="search_shop_inputBox">
            <Input
              type={"text"}
              confirmType={"search"}
              onConfirm={() => {
                keyword && this.changeClick(keyword);
              }}
              value={keyword}
              onInput={(e) => this.searchDetails(e)}
              className="search_shop_input"
              placeholder={"搜索附近商户/用户以及好玩的话题内容"}
            ></Input>
          </View>
          {hasListObj}
        </View>
      </View>
    );
  }
}
