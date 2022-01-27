import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import { toast, loginStatus, backgroundObj, fakeStorage } from "@/utils/utils";
import { fakeBlindBoxHelp, fetchBlindBoxHelp } from "@/server/blindBox";
import Init from "./componetns/init";
import { inject, observer } from "mobx-react";
import Drawer from "@/components/Drawer";
import { getUserMomentcheckNew } from "@/server/share";
import SaveBean from "./componetns/saveBean";
import NewsInfo from "./componetns/newsInfo";
import Router from "@/utils/router";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {
      userId: getCurrentInstance().router.params.userId,
      blindBoxRuleObject: {},
      blindBoxHelpList: [],
      userInfo: {},
      freeTime: 0,
      visible: false,
      errorVisible: false,
      userBeanInfo: {},
      userType: "other",
    };
  }
  fetchMomentcheckNew() {
    getUserMomentcheckNew({}).then((val) => {
      const { newUserFlag = "1", newUserBean = "300" } = val;
      if (newUserFlag === "1") {
        Router({
          routerName: "userNewArtist",
        });
      } else {
        Router({
          routerName: "blindIndex",
        });
      }
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
        userType,
      } = val;

      this.setState({
        blindBoxHelpList: blindBoxHelpList.slice(0, 3),
        freeTime,
        blindBoxRuleObject,
        userInfo,
        userType,
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
        getUserMomentcheckNew({}).then((val) => {
          const { newUserFlag = "1", newUserBean = "300" } = val;
          if (newUserFlag === "1") {
            this.setState(
              {
                userBeanInfo: { ...val },
              },
              (val) => {
                this.setState({ visible: true });
              }
            );
          }
        });
      })
      .catch((e) => {
        const { resultCode } = e;
        if (resultCode == 5235) {
          this.setState({
            errorVisible: true,
          });
        }
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
          }}
        ></Init>
        <View className="shareBox_bg">
          <View className="shareBox_content">
            <View className="shareBox_content_box">
              <View className="shareBox_bg_blind"></View>
              <View
                style={backgroundObj(profile)}
                className="shareBox_profile merchant_dakale_logo"
              ></View>
              <View className="shareBox_fontInfo font_hide">
                来自 {username} 的礼盒
              </View>
              <View className="shareBox_fontMargin1 shareBox_font">
                友友，帮我助力
              </View>
              <View className="shareBox_font">
                {" "}
                你也可以获得千元大奖的机会哦～
              </View>
              <View className="shareBox_font" style={{ visibility: "hidden" }}>
                {" "}
                友友， 你的礼品等待领取
              </View>
              {template}
              <View className="shareBox_liner"></View>
              {userType === "other" ? (
                <View className="shareBox_btn_box public_center">
                  <View
                    className="shareBox_btnInfo_btn public_center"
                    onClick={this.saveBlindBoxHelp.bind(this)}
                  >
                    为TA助力
                  </View>
                </View>
              ) : (
                <View className="shareBox_btn_box public_center">
                  <View
                    className="shareBox_btnInfo_btn public_center"
                    onClick={() =>
                      Router({
                        routerName: "blindIndex",
                      })
                    }
                  >
                    {freeTime > 0 ? "助力成功 马上拆盲盒" : "马上拆盲盒"}
                  </View>
                </View>
              )}

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
                    this.fetchMomentcheckNew();
                  }
                );
              }}
              data={{ ...userInfo, ...userBeanInfo }}
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
