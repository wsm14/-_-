import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, WebView } from "@tarojs/components";
import { toast, loginStatus, backgroundObj, fakeStorage } from "@/common/utils";
import Init from "./componetns/init";
import { inject, observer } from "mobx-react";
import Button from "@/components/Button";
import Drawer from "@/components/Drawer";
import { fetchFissionHelps } from "@/server/share";
import { getShareParamInfo } from "@/server/common";
import SaveBean from "./componetns/saveBean";
import NewsInfo from "./componetns/newsInfo";
import Router from "@/common/router";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        fissionId: getCurrentInstance().router.params.fissionId,
      },
    };
  }
  fetchHelps() {
    const { httpData } = this.state;
    fetchFissionHelps({
      ...httpData,
    }).then((val) => {
      console.log(val);
    });
  }
  fetchShareType() {
    const { scene } = getCurrentInstance().router.params;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
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
  componentDidMount() {
    this.fetchHelps();
  }
  render() {
    const {
      visible,

      errorVisible,
    } = this.state;
    // const { profile = "", username } = userInfo;
    // const template = {
    //   owner: (
    //     <View className="shareUser_desc">
    //       {" "}
    //       {freeTime > 0
    //         ? `恭喜获得${freeTime}次机会 加速赢iPhone13`
    //         : "等待好友助力"}
    //     </View>
    //   ),
    //   other: (
    //     <View className="shareUser_desc">
    //       {freeTime > 0 ? `TA已获得${freeTime}次免费拆盲盒机会` : ""}
    //     </View>
    //   ),
    // }[userType];
    const { login } = this.props.store.authStore;
    return (
      <View className="shareUser_box">
        {/* <Init
          auth={login}
          initFn={() => {
            this.getBlindHelp();
          }}
        ></Init>
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
                友友，帮我助力
              </View>
              <View className="shareUser_font">
                {" "}
                你也可以获得千元大奖的机会哦～
              </View>
              <View className="shareUser_font" style={{ visibility: "hidden" }}>
                {" "}
                友友， 你的礼品等待领取
              </View>
              {template}
              <View className="shareUser_liner"></View>
              {userType === "other" ? (
                <View className="shareUser_btn_box public_center">
                  <Button>
                    <View
                      className="shareUser_btnInfo_btn public_center"
                      onClick={this.saveBlindBoxHelp.bind(this)}
                    >
                      为TA助力
                    </View>
                  </Button>
                </View>
              ) : (
                <View className="shareUser_btn_box public_center">
                  <Button>
                    <View
                      className="shareUser_btnInfo_btn public_center"
                      onClick={() =>
                        Router({
                          routerName: "blindIndex",
                        })
                      }
                    >
                      {freeTime > 0 ? "助力成功 马上拆盲盒" : "马上拆盲盒"}
                    </View>
                  </Button>
                </View>
              )}

              <View className="shareUser_share_profileBox">
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
        )} */}
      </View>
    );
  }
}
export default Index;
