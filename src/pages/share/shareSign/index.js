import React, { Component } from "react";
import { View, Button } from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { loginStatus } from "@/utils/utils";
import { fakeShareCard } from "@/server/share";
import { fetchNewShareInfo } from "@/server/common";
import "./index.scss";
import Router from "@/utils/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      userType: getCurrentInstance().router.params.userType || "submit",
      shareUserId: getCurrentInstance().router.params.shareUserId,
      shareInfo: {},
    };
  }
  shareInfo() {
    fetchNewShareInfo({
      shareType: "game",
      subType: "gatherCard",
    }).then((val) => {
      const { shareInfo } = val;
      this.setState({
        shareInfo,
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
      console.log(111);
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
    if (userType !== "submit") {
      this.shareInfo();
    }
  }
  render() {
    const { userType } = this.state;
    return (
      <View className="shareSign_box">
        {userType === "submit" ? (
          <View
            className="shareSign_btn"
            onClick={this.linkTo.bind(this)}
          ></View>
        ) : (
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
        )}
      </View>
    );
  }
}

export default Index;
