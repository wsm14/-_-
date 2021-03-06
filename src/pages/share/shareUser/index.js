import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import { toast, loginStatus, backgroundObj, fakeStorage } from "@/utils/utils";
import { inject, observer } from "mobx-react";
import Drawer from "@/components/Drawer";
import { fetchFissionHelps, fetchInvitationUser } from "@/server/share";
import { fetchShareParamInfo } from "@/server/common";
import SaveBean from "./componetns/saveBean";
import NewsInfo from "./componetns/newsInfo";
import Router from "@/utils/router";
import "./index.scss";

@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        fissionId: getCurrentInstance().router.params.fissionId,
        shareUserId: getCurrentInstance().router.params.shareUserId,
      },
      fissionInfo: {},
      userInfo: {},
      helpUserListInfo: [],
      errorVisible: false,
      visible: false,
    };
  }
  fetchHelps() {
    const { httpData } = this.state;
    fetchFissionHelps({
      ...httpData,
    }).then((val) => {
      const { fissionInfo, userInfo, helpUserListInfo } = val;
      this.setState({
        fissionInfo,
        userInfo,
        helpUserListInfo,
      });
    });
  }
  filterList(num, list) {
    let newList = [];
    for (let i = 0; i < num; i++) {
      if (list[i]) {
        newList.push(list[i]);
      } else {
        newList.push({});
      }
    }
    return newList;
  }
  fetchShareType() {
    const { scene } = getCurrentInstance().router.params;
    if (scene) {
      fetchShareParamInfo({ uniqueKey: scene }, (res) => {
        const {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          this.setState(
            {
              httpData: {
                ...JSON.parse(param),
              },
            },
            (res) => {
              this.fetchHelps();
            }
          );
        } else {
          toast("参数缺失");
        }
      });
    } else {
      this.fetchHelps();
    }
  }
  fetchInvitation() {
    const { httpData, userInfo } = this.state;
    const { fissionId } = httpData;
    const { fissionUserId } = userInfo;
    fetchInvitationUser({ fissionId, userId: fissionUserId })
      .then((val) => {
        this.setState(
          {
            visible: true,
          },
          (res) => {
            this.fetchHelps();
          }
        );
      })
      .catch((e) => {
        const { resultCode } = e;
        if (resultCode === "5238" || resultCode === "5239") {
          this.setState({
            errorVisible: true,
          });
        }
      });
  }
  componentDidShow() {
    this.fetchShareType();
  }
  render() {
    const {
      visible,
      userInfo,
      errorVisible,
      helpUserListInfo,
      fissionInfo,
      httpData,
    } = this.state;
    const { fissionId } = httpData;
    const { inviteNum, prizeBean, prizeName, prizeType } = fissionInfo;
    const { profile = "", username } = userInfo;
    return (
      <View className="shareUser_box">
        <View className="shareUser_left_layer"></View>
        <View className="shareUser_bg_left"></View>
        <View className="shareUser_bg">
          <View className="shareUser_content">
            <View className="shareUser_content_box">
              <View className="shareUser_bg_blind"></View>
              <View
                style={backgroundObj(profile)}
                className="shareUser_profile merchant_dakale_logo"
              ></View>
              <View className="shareUser_fontInfo font_hide">
                来自 {username} 的礼盒
              </View>
              <View className="shareUser_fontMargin1 shareUser_font">
                我正在哒卡乐免费拿{prizeName || prizeBean + "卡豆"}
              </View>
              <View className="shareUser_font">
                {helpUserListInfo.length - inviteNum >= 0
                  ? `该用户已完成助力任务`
                  : `仅差${inviteNum - helpUserListInfo.length}次机会`}
              </View>
              <View className="shareUser_font">
                快来帮我助力就可以获得{prizeName || prizeBean + "卡豆"}啦！
              </View>
              <View className="shareUser_liner"></View>
              <View className="shareUser_btn_box public_center">
                <View
                  className="shareUser_btnInfo_btn public_center"
                  onClick={this.fetchInvitation.bind(this)}
                >
                  帮TA助力
                </View>
              </View>

              <View className="shareUser_share_profileBox">
                {this.filterList(inviteNum, helpUserListInfo).map(
                  (item, index) => {
                    const { profile = "" } = item;
                    if (!profile) {
                      return (
                        <View
                          style={
                            (index + 1) % 4 === 0
                              ? {}
                              : { marginRight: Taro.pxTransform(22) }
                          }
                          className="shareUser_share_profile shareUser_share_proStyle2"
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
                          className="shareUser_share_profile shareUser_share_proStyle1"
                        ></View>
                      );
                    }
                  }
                )}
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
                    Router({
                      routerName: "shareActive",
                      args: {
                        fissionId,
                      },
                    });
                  }
                );
              }}
              data={{ ...userInfo, ...fissionInfo }}
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
                      routerName: "shareActive",
                      args: {
                        fissionId,
                      },
                    });
                  }
                );
              }}
              data={{ ...userInfo, ...fissionInfo }}
            ></NewsInfo>
          </Drawer>
        )}
      </View>
    );
  }
}
export default Index;
