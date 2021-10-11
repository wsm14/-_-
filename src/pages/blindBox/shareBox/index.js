import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import { toast, loginStatus, backgroundObj, fakeStorage } from "@/common/utils";
import { fakeBlindBoxHelp, fetchBlindBoxHelp } from "@/server/blindBox";
import Init from "./componetns/init";
import { inject, observer } from "mobx-react";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { getUserMomentcheckNew, saveNewUserBean } from "@/server/share";
import SaveBean from "./componetns/saveBean";
import NewsInfo from "./componetns/newsInfo";
import Router from "@/common/router";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {
      userId:
        getCurrentInstance().router.params.userId || "1434865185039794178",
      blindBoxRuleObject: {},
      blindBoxHelpList: [],
      userInfo: {},
      freeTime: 0,
      visible: false,
      errorVisible: false,
      userBeanInfo: {},
    };
  }
  fetchMomentcheckNew() {
    getUserMomentcheckNew({}).then((val) => {
      const { newUserFlag = "1", newUserBean = "300" } = val;
      this.setState({
        userBeanInfo: { newUserFlag, newUserBean },
      });
    });
  }
  fakeNewUserBean() {
    saveNewUserBean({}).then((val) => {
      this.setState({
        userBeanInfo: { ...this.state.userBeanInfo, newUserFlag: "0" },
        visible: true,
      });
      fakeStorage("deviceFlag", "0");
    });
  }
  getBlindHelp() {
    const { userId } = this.state;
    fetchBlindBoxHelp({
      userId: userId,
    }).then((val = {}) => {
      const {
        blindBoxHelpList = [],
        freeTime,
        blindBoxRuleObject = {},
        userInfo,
      } = val;

      this.setState({
        blindBoxHelpList,
        freeTime,
        blindBoxRuleObject,
        userInfo,
      });
    });
  }
  saveBlindBoxHelp() {
    const { userId, blindBoxRuleObject } = this.state;
    const { ruleType = "invitation" } = blindBoxRuleObject;
    fakeBlindBoxHelp({
      userId: userId,
      luckDrawType: ruleType,
    })
      .then((val) => {
        this.getBlindHelp();
        toast("邀请成功");
      })
      .catch((e) => {
        this.setState({
          errorVisible: true,
        });
      });
  }
  componentDidShow() {
    this.getBlindHelp();
  }
  changeNewUser() {
    const { userBeanInfo } = this.state;
    const { newUserFlag } = userBeanInfo;
    if (newUserFlag === "1") {
      this.fakeNewUserBean();
    } else {
      Router({
        routerName: "blindIndex",
      });
    }
  }
  filterList(list) {
    let newList = [{}, {}, {}, {}];
    if (list.length >= 4) {
      return list;
    }
    list.forEach((item, index) => {
      newList[index] = item;
    });
    return newList;
  }
  render() {
    const {
      blindBoxHelpList,
      blindBoxRuleObject,
      freeTime = 0,
      userType = "other",
      userInfo = {},
      visible,
      userBeanInfo,
      errorVisible,
    } = this.state;
    const { num, times } = blindBoxRuleObject;
    const { profile = "", username } = userInfo;
    const template = {
      owner: (
        <View className="shareBox_desc">
          {" "}
          {freeTime > 0
            ? `恭喜获得${freeTime}次机会 加速赢iPhone13`
            : "等待好友助力"}
        </View>
      ),
      other: (
        <View className="shareBox_desc">
          {freeTime > 0 ? `TA已获得${freeTime}次免费拆盲盒机会` : ""}
        </View>
      ),
    }[userType];
    const { login } = this.props.store.authStore;
    return (
      <View className="shareBox_box">
        <Init
          auth={login}
          initFn={() => {
            this.getBlindHelp();
            this.fetchMomentcheckNew();
          }}
        ></Init>
        <View className="shareBox_bg">
          <View className="shareBox_content">
            <View className="shareBox_content_box">
              <View className="shareBox_bg_blind"></View>
              <View
                style={backgroundObj(profile)}
                className="shareBox_profile"
              ></View>
              <View className="shareBox_fontInfo font_hide">
                来自 {username} 的邀请函
              </View>
              <View className="shareBox_fontMargin1 shareBox_font">
                我正在哒卡乐抽盲盒，仅差1次机会
              </View>
              <View className="shareBox_font">就可以最高抽中iPhone13啦，</View>
              <View className="shareBox_font">
                快来帮我助力，同时你也获得抽盲盒机会哦！
              </View>
              {template}
              <View className="shareBox_liner"></View>
              <View className="shareBox_btn_box public_auto">
                <Button>
                  <View
                    className="shareBox_btn public_center"
                    onClick={this.saveBlindBoxHelp.bind(this)}
                  >
                    为TA助力
                  </View>
                </Button>
                <Button>
                  <View
                    className="shareBox_btn public_center"
                    onClick={() => {
                      this.changeNewUser();
                    }}
                  >
                    我也要拆盲盒
                  </View>
                </Button>
              </View>
              <View className="shareBox_share_profileBox">
                {this.filterList(blindBoxHelpList).map((item, index) => {
                  const { profile = "" } = item;
                  if (!profile) {
                    return (
                      <View
                        style={
                          (index + 1) % 4 === 0
                            ? {}
                            : { marginRight: Taro.pxTransform(22) }
                        }
                        className="shareBox_share_profile shareBox_share_proStyle2"
                      ></View>
                    );
                  } else {
                    return (
                      <View
                        style={
                          (index + 1) % 4 === 0
                            ? { ...backgroundObj(profile) }
                            : {
                                marginRight: Taro.pxTransform(22),
                                ...backgroundObj(profile),
                              }
                        }
                        className="shareBox_share_profile shareBox_share_proStyle1"
                      ></View>
                    );
                  }
                })}
              </View>
            </View>
          </View>
          <View className="shareBox_bg_left"></View>
          <View className="shareBox_toast_title">温馨提示</View>
          <View className="shareBox_toast_font">
            1. 每个好友每天仅可助力1次哦
          </View>
          <View className="shareBox_toast_font">
            2. 每{times}个人助力成功，好友即可获得{num}次免费盲盒机会
          </View>
          <View className="shareBox_toast_font">3. 待补充</View>
        </View>
        {visible && (
          <Drawer
            show={visible}
            close={() => {
              this.setState({
                visible: false,
              });
            }}
          >
            <SaveBean
              change={() => {
                this.setState(
                  {
                    visible: false,
                  },
                  () => {
                    Router({
                      routerName: "blindIndex",
                    });
                  }
                );
              }}
              data={{ ...userBeanInfo, ...userInfo }}
            ></SaveBean>
          </Drawer>
        )}
        {errorVisible && (
          <Drawer
            show={errorVisible}
            close={() => {
              this.setState({
                errorVisible: false,
              });
            }}
          >
            <NewsInfo
              change={() => {
                this.setState(
                  {
                    errorVisible: false,
                  },
                  () => {
                    Router({
                      routerName: "blindIndex",
                    });
                  }
                );
              }}
            ></NewsInfo>
          </Drawer>
        )}
      </View>
    );
  }
}
export default Index;
