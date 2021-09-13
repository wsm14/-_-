import React from "react";
import Taro from "@tarojs/taro";
import { Input, Text, View } from "@tarojs/components";
import { removeStorage } from "@/common/utils";
import "./index.scss";
import {
  getSearchDataStatistic,
  getSearchRecommend,
  getSearchConditions,
  fetchMultiSearchData,
} from "@/server/perimeter";
import { fetchUserShareCommission } from "@/server/index";
import ContentData from "./components/selectContent/index";
import { inject, observer } from "mobx-react";
@inject("store")
@observer
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
      configUserLevelInfo: {},
      storageList: Taro.getStorageSync("storageList") || [],
      setting: {
        tabList: ["商品", "商家", "视频", "用户"],
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

  fetchUserShareCommission() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
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
            fetchMultiSearchData(this.state.statistic, (res) => {
              console.log(res);
              this.setState({
                searchInfo: res,
                status: "1",
              });
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
    this.fetchUserShareCommission();
  }

  render() {
    const {
      topicInfo: { topicIdString, topicName, kolMomentsNum },
      hotSearchList,
      storageList = [],
      statistic: { keyword },
      searchInfo,
      searchInfo: {
        specialGoodsNum = 0,
        userMerchantNameList = [],
        userMerchantNum = 0,
        userNum = 0,
        userMomentNum = 0,
      },
      status,
      userMerchantList,
      keywords,
      configUserLevelInfo,
    } = this.state;

    const hasListObj = {
      0: (
        <>
          <View className="search_searchPadding"></View>
          {storageList.length > 0 && (
            <>
              <View className="search_shop_orderTags">
                <View className="search_shop_title color1 font32 bold">
                  最近搜索
                </View>
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
            </>
          )}

          {/*标签*/}
          <View className="search_hot_search color1 font32 bold">热门搜索</View>
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
                  tabList: ["商品", "商家", "视频", "用户"],
                  current: 0,
                },
              });
              this.changeClick(keyword);
            }}
          >
            <View className="search_goods_icon"></View>
            <View className="font28 color1 font_hide search_hide">
              {keyword}
            </View>
            <View className="font24 color2 search_shop_right">
              约{specialGoodsNum}个商品
            </View>
          </View>
          <View
            className="search_shop_layer"
            onClick={() => {
              this.setState({
                setting: {
                  tabList: ["商品", "商家", "视频", "用户"],
                  current: 1,
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
              约{userMerchantNum}个商家
            </View>
          </View>
          <View
            className="search_shop_layer"
            onClick={() => {
              this.setState({
                setting: {
                  tabList: ["商品", "商家", "视频", "用户"],
                  current: 2,
                },
              });
              this.changeClick(keyword);
            }}
          >
            <View className="search_video_icon"></View>
            <View className="font28 color1 font_hide search_hide">
              {keyword}
            </View>
            <View className="font24 color2 search_shop_right">
              约{userMomentNum}个视频
            </View>
          </View>
          <View
            className="search_shop_layer"
            onClick={() => {
              this.setState({
                setting: {
                  tabList: ["商品", "商家", "视频", "用户"],
                  current: 3,
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
              约{searchInfo.userNum}个用户
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
          configUserLevelInfo={configUserLevelInfo}
          store={this.props.store}
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
              placeholder={"搜索附近好玩的内容"}
            ></Input>
          </View>
          {hasListObj}
        </View>
      </View>
    );
  }
}
