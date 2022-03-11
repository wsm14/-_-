import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { backgroundObj, toast } from "@/utils/utils";
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
        fillSign:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_4.png",
        signTaskHelp:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_4.png",
        blindBoxHelp:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_4.png",
        gameTogether:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_6.png",
        freeTaskHelp:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_5.png",
        farmTaskHelp:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_8.png",
        //合力任务
        farmTogether:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_8.png",
        //助力任务
      },
      subType: getCurrentInstance().router.params.subType || "fillSign",
      shareUserId: getCurrentInstance().router.params.shareUserId,
      fillSignTime: getCurrentInstance().router.params.fillSignTime,
      strapId: getCurrentInstance().router.params.strapId,
      progressId: getCurrentInstance().router.params.progressId,
    };
  }
  fakeSign() {
    const { shareUserId, fillSignTime } = this.state;
    fakefillSign({
      fillSignDate: fillSignTime,
      fillSignWay: "1",
      signUserId: shareUserId,
    }).then((val) => {
      toast("补签成功");
      Router({
        routerName: "sign",
        type: "reLaunch",
      });
    });
  }
  fakeTask() {
    const { strapId, shareUserId } = this.state;
    fetchDoneTask({
      taskStrapId: strapId,
      inviteFlag: "1",
      userId: shareUserId,
    }).then((val) => {
      toast("助力成功");
      Router({
        routerName: "sign",
        type: "reLaunch",
      });
    });
  }
  fakePrize() {
    const { shareUserId } = this.state;
    fakeBoxPrize({
      helpFlag: "1",
      helpUserId: shareUserId,
    }).then((val) => {
      toast("助力成功");
      Router({
        routerName: "sign",
        type: "reLaunch",
      });
    });
  }
  fakeTogether() {
    const { progressId, shareUserId } = this.state;
    const env =
      process.env.NODE_ENV === "development" ? "development" : "production";
    fakeTogether({
      gameProcessId: progressId,
      userIdStr: shareUserId,
    }).then((val) => {
      toast("合力成功");
      Router({
        routerName: "webView",
        args: {
          link: `https://web-new.dakale.net/${
            env === "development" ? "dev" : "product"
          }/game/receiveGame/index.html#/index`,
          url: "actionType|together",
        },
      });
    });
  }

  fetfreeTaskHelp() {
    const { strapId, shareUserId } = this.state;
    const env =
      process.env.NODE_ENV === "development" ? "development" : "production";
    fetchDoneTask({
      taskStrapId: strapId,
      inviteFlag: "1",
      userId: shareUserId,
    }).then((val) => {
      toast("助力成功");
      Router({
        routerName: "webView",
        args: {
          link: `https://web-new.dakale.net/${
            env === "development" ? "dev" : "product"
          }/game/receiveGame/index.html#/index`,
        },
      });
    });
  }
  farmTogether() {
    const { strapId, shareUserId } = this.state;
    const env =
      process.env.NODE_ENV === "development" ? "development" : "production";
    fetchDoneTask({
      taskStrapId: strapId,
      inviteFlag: "1",
      userId: shareUserId,
    }).then((val) => {
      toast("助力成功");
      Router({
        routerName: "webView",
        args: {
          link: `https://web-new.dakale.net/${
            env === "development" ? "dev" : "product"
          }/game/farmGame/index.html#/farm`,
        },
      });
    });
  }
  linkToTeam() {
    const env =
      process.env.NODE_ENV === "development" ? "development" : "production";
    Router({
      routerName: "webView",
      args: {
        link: `https://web-new.dakale.net/${
          env === "development" ? "dev" : "product"
        }/game/farmGame/index.html#/farm`,
      },
    });
  }
  fakeJoinFoTeam() {
    const { progressId, shareUserId } = this.state;
    const env =
      process.env.NODE_ENV === "development" ? "development" : "production";
    fakeJoinTeam({
      shareUserIdStr: shareUserId,
      gameProgressIdStr: progressId,
    }).then((val) => {
      toast("合力成功");
      Router({
        routerName: "webView",
        args: {
          link: `https://web-new.dakale.net/${
            env === "development" ? "dev" : "product"
          }/game/farmGame/index.html#/farm`,
        },
      });
    });
  }
  componentDidMount() {}
  render() {
    const { imgList, subType } = this.state;
    const requestFilter = {
      fillSign: this.fakeSign.bind(this),
      blindBoxHelp: this.fakePrize.bind(this),
      signTaskHelp: this.fakeTask.bind(this),
      gameTogether: this.fakeTogether.bind(this),
      freeTaskHelp: this.fetfreeTaskHelp.bind(this),
      farmTogether: this.fakeJoinFoTeam.bind(this),
      farmTaskHelp: this.farmTogether.bind(this),
      shareGameImage: this.linkToTeam.bind(this),
    }[subType];
    const requestName = {
      fillSign: "帮助TA",
      blindBoxHelp: "我要拿好礼",
      signTaskHelp: "帮助TA",
      gameTogether: "我要拿好礼",
      freeTaskHelp: "立即合力",
      farmTogether: "我要领水果",
      farmTaskHelp: "我要领水果",
      shareGameImage: "我要领水果",
    }[subType];
    return (
      <View className="game_box_info">
        <View
          className="game_box_image"
          style={backgroundObj(imgList[subType])}
        >
          <View
            className="game_btn public_center"
            onClick={() => {
              requestFilter && requestFilter();
            }}
          >
            {requestName}
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
