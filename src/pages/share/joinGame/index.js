import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { backgroundObj, loginStatus } from "@/utils/utils";
import {
  fakefillSign,
  fakeBoxPrize,
  fetchDoneTask,
  fakeTogether,
  fakeJoinTeam,
} from "@/server/share";
import "./index.scss";
import Router from "@/utils/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      imgList: {
        signGame:
          "https://wechat-config.dakale.net/miniprogram/image/icon966.png",
        freeGame:
          "https://wechat-config.dakale.net/miniprogram/image/icon967.png",
        farmGame:
          "https://wechat-config.dakale.net/miniprogram/image/icon968.png",
        gatherGame:
          "https://wechat-config.dakale.net/miniprogram/image/icon969.png",
      },
      subType: getCurrentInstance().router.params.subType || "signGame",
    };
  }

  fakeJoinFoTeam() {
    const { subType } = this.state;
    const env = process.env.NODE_ENV === "development" ? "dev" : "product";
    if (!loginStatus) {
      return Router({
        routerName: "login",
      });
    } else if (subType === "signGame") {
      Router({
        routerName: "sign",
        type: "reLaunch",
      });
    } else if (subType === "freeGame") {
      Router({
        routerName: "webView",
        args: {
          link: `https://web-new.dakale.net/${env}/game/receiveGame/index.html#/index`,
        },
      });
    } else if (subType === "farmGame") {
      Router({
        routerName: "webView",
        args: {
          link: `https://web-new.dakale.net/${env}/game/farmGame/index.html#/farm`,
        },
      });
    } else {
      Router({
        routerName: "webView",
        args: {
          link: `https://web-new.dakale.net/${env}/game/collectGame/index.html#/collect`,
        },
      });
    }
  }
  componentDidMount() {}
  render() {
    const { imgList, subType } = this.state;

    return (
      <View className="game_box_info">
        <View
          className="game_box_image"
          style={backgroundObj(imgList[subType])}
        >
          <View
            className="game_btn public_center"
            onClick={() => {
              this.fakeJoinFoTeam();
            }}
          >
            我要参加
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
