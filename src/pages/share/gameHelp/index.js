import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Button } from "@tarojs/components";
import { backgroundObj, toast } from "@/common/utils";
import { fetchNewShareInfo } from "@/server/common";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      imgList: {
        fillSign:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_4.png",
        signTaskHelp:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_3.png",
        blindBoxHelp:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_2.png",
        gameTogether:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_6.png",
        freeTaskHelp:
          "https://dakale-wechat-new.oss-cn-hangzhou.aliyuncs.com/miniprogram/game/game_sharebg_7.png",
      },
      subType: getCurrentInstance().router.params.subType || "fillSign",
      shareUserId: getCurrentInstance().router.params.shareUserId,
      fillSignTime: getCurrentInstance().router.params.fillSignTime,
      shareId: getCurrentInstance().router.params.shareId,

      shareInfo: {},
    };
  }
  fakeSign() {
    const { subType, fillSignTime } = this.state;
    fetchNewShareInfo({
      subType: subType,
      shardingKey: fillSignTime,
      shareType: "game",
    }).then((val) => {
      const { shareInfo } = val;
      this.setState({
        shareInfo,
      });
    });
  }
  fakePrize() {
    const { subType, shareId } = this.state;
    fetchNewShareInfo({
      subType: subType,
      shareId: shareId,
      shareType: "game",
    }).then((val) => {
      const { shareInfo } = val;
      this.setState({
        shareInfo,
      });
    });
  }
  fakeBlindBox() {
    const { subType } = this.state;
    fetchNewShareInfo({
      subType: subType,
      shareType: "game",
    }).then((val) => {
      const { shareInfo } = val;
      this.setState({
        shareInfo,
      });
    });
  }
  fakeTogether() {
    const { shareId, subType } = this.state;
    fetchNewShareInfo({
      subType: subType,
      shareId: shareId,
      shareType: "game",
    }).then((val) => {
      const { shareInfo } = val;
      this.setState({
        shareInfo,
      });
    });
  }
  fakefreeTaskHelp() {
    const { subType, shareId } = this.state;
    fetchNewShareInfo({
      subType: subType,
      shareId: shareId,
      shareType: "game",
    }).then((val) => {
      const { shareInfo } = val;
      this.setState({
        shareInfo,
      });
    });
  }
  filterRequest() {
    const { subType } = this.state;
    const requestFilter = {
      fillSign: this.fakeSign.bind(this),
      blindBoxHelp: this.fakeBlindBox.bind(this),
      signTaskHelp: this.fakePrize.bind(this),
      gameTogether: this.fakeTogether.bind(this),
      freeTaskHelp: this.fakefreeTaskHelp.bind(this),
    }[subType];
    requestFilter && requestFilter();
  }
  componentDidShow() {
    this.filterRequest();
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
  render() {
    const { imgList, subType } = this.state;
    return (
      <View className="game_help_info">
        <View
          className="game_box_image"
          style={backgroundObj(imgList[subType])}
        >
          <View className="game_btn public_center">
            <Button
              style={{
                width: "100%",
                height: "100%",
                background: "none",
                position: "absolute",
              }}
              openType={"share"}
            ></Button>
            {subType === "freeTaskHelp" ? "邀请好友合力" : "邀请TA"}
          </View>
        </View>
      </View>
    );
  }
}

export default Index;
