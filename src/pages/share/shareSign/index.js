import React, { Component } from "react";
import { View, Button } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { loginStatus } from "@/utils/utils";
import { fakeShareCard, fakeExchangeReward } from "@/server/share";
import { fetchNewShareInfo } from "@/server/common";
import { fetchShareParamInfo } from "@/server/common";
import "./index.scss";
import Router from "@/utils/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userType: getCurrentInstance().router.params.userType || "submit",
      shareUserId: getCurrentInstance().router.params.shareUserId,
      shareInfo: {},
      shareId: getCurrentInstance().router.params.shareId,
      identification: getCurrentInstance().router.params.identification,
    };
  }
  shareInfo() {
    const { userType, shareId } = this.state;
    if (userType === "submit") {
      return;
    } else if (userType === "share") {
      fetchNewShareInfo({
        shareType: "game",
        subType: "gatherCard",
      }).then((val) => {
        const { shareInfo } = val;
        this.setState({
          shareInfo,
        });
      });
    } else if (userType === "help") {
      fetchNewShareInfo({
        shareType: "game",
        subType: "gatherRewardHelp",
        shareId: shareId,
      }).then((val) => {
        const { shareInfo } = val;
        this.setState({
          shareInfo,
        });
      });
    }
  }
  fetchShareType() {
    const { scene } = getCurrentInstance().router.params;
    if (scene) {
      fetchShareParamInfo({ uniqueKey: scene }, (res) => {
        const {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          this.setState({
            ...JSON.parse(param),
          });
        }
      });
    }
  }
  fakeHelp() {
    const { identification, shareUserId } = this.state;
    fakeExchangeReward({ identification, shareUserIdStr: shareUserId })
      .then((val) => {
        Router({
          routerName: "webView",
          args: {
            link: `https://web-new.dakale.net/${
              env === "development" ? "dev" : "product"
            }/game/collectGame/index.html#/collect`,
          },
        });
      })
      .catch((e) => {
        Router({
          routerName: "webView",
          args: {
            link: `https://web-new.dakale.net/${
              env === "development" ? "dev" : "product"
            }/game/collectGame/index.html#/collect`,
          },
        });
      });
  }
  linkTo() {
    const env =
      process.env.NODE_ENV === "development" ? "development" : "production";
    if (!loginStatus()) {
      Router({
        routerName: "login",
      });
    } else {
      const { shareUserId } = this.state;
      if (shareUserId) {
        fakeShareCard({
          shareUserId: shareUserId,
        })
          .then((val) => {
            Router({
              routerName: "webView",
              args: {
                link: `https://web-new.dakale.net/${
                  env === "development" ? "dev" : "product"
                }/game/collectGame/index.html#/collect`,
              },
            });
          })
          .catch((e) => {
            Router({
              routerName: "webView",
              args: {
                link: `https://web-new.dakale.net/${
                  env === "development" ? "dev" : "product"
                }/game/collectGame/index.html#/collect`,
              },
            });
          });
      } else {
        Router({
          routerName: "webView",
          args: {
            link: `https://web-new.dakale.net/${
              env === "development" ? "dev" : "product"
            }/game/collectGame/index.html#/collect`,
          },
        });
      }
    }
  }
  onShareAppMessage(res) {
    const { shareInfo } = this.state;
    if (res.from === "button") {
      if (shareInfo) {
        const { miniProgramUrl, title, miniProgramImage } = shareInfo;
        return {
          title: title,
          imageUrl: miniProgramImage,
          path: miniProgramUrl,
        };
      }
    }
  }
  onShareAppMessage(res) {
    const { shareInfo } = this.state;
    if (res.from === "button") {
      if (shareInfo) {
        const { miniProgramUrl, title, miniProgramImage } = shareInfo;
        return {
          title: title,
          imageUrl: miniProgramImage,
          path: miniProgramUrl,
        };
      }
    }
  }
  componentDidMount() {
    const { userType } = this.state;
    this.fetchShareType();
    if (userType !== "submit") {
      this.shareInfo();
    }
  }
  render() {
    const { userType } = this.state;
    const template = {
      submit: (
        <View className="shareSign_btn" onClick={this.linkTo.bind(this)}></View>
      ),
      helpInfo: (
        <View
          className="shareSign_btn"
          onClick={this.fakeHelp.bind(this)}
        ></View>
      ),
      share: (
        <View className="shareSign_share">
          <Button
            style={{
              width: "100%",
              height: "100%",
              background: "none",
              position: "absolute",
            }}
            openType={"share"}
          ></Button>
        </View>
      ),
      help: (
        <View className="shareSign_share">
          <Button
            style={{
              width: "100%",
              height: "100%",
              background: "none",
              position: "absolute",
            }}
            openType={"share"}
          ></Button>
        </View>
      ),
    }[userType];
    return <View className="shareSign_box">{template}</View>;
  }
}

export default Index;
