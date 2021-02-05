import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { Canvas, View } from "@tarojs/components";
import { share } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import "./index.scss";
import { authPhotosAlbum } from "@/common/authority";
import { navigateTo, backgroundObj, upLoadFile, toast } from "@/common/utils";
import { inject, observer } from "mobx-react";
import drawQrcode from "weapp-qrcode";
@inject("store")
@observer
class Record extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        shareType: "activity",
        subType: "inviteUser",
      },
      h5Url: "",
      codeUrl: "",
      canvasId: "canvasId",
      showCanvas: false,
      shareFile: "",
    };
  }
  componentWillUnmount() {
    let userInfo = Taro.getStorageSync("userInfo");
    if (!userInfo || Object.keys(userInfo).length < 5) {
      navigateTo("/pages/auth/index");
    }
  }
  getActiveInfo() {
    const {
      shareFriend: { getShareInfo },
    } = share;
    const { httpData } = this.state;
    httpGet(
      {
        url: getShareInfo,
        data: httpData,
      },
      (res) => {
        const { h5Url } = res;
        this.setState(
          {
            h5Url,
          },
          (val) => {
            this.createQRcode();
          }
        );
      }
    );
  }
  createQRcode = () => {
    const qrwh = (150 / 750) * Taro.getSystemInfoSync().windowWidth;
    let canvasId = this.state.canvasId;
    let QRdata = this.state.h5Url;
    drawQrcode({
      width: qrwh,
      height: qrwh,
      background: "#FFFFFF",
      canvasId: canvasId,
      correctLevel: 1,
      text:QRdata,
      callback: () => this.canvasToTempImage(canvasId),
    });
  };
  canvasToTempImage(canvasId) {
    let _this = this;
    Taro.canvasToTempFilePath({
      canvasId,
      success: function (res) {
        let tempFilePath = res.tempFilePath; // 临时图片地址，可在放入图片src中使用
        console.log(res.tempFilePath);
        _this.setState({
          codeUrl: res.tempFilePath,
        });
      },
    });
  }
  createImg() {
    const _this = this;
    const {
      userInfo: { username, profile },
    } = this.props.store.authStore;
    upLoadFile([
      "https://wechat-config.dakale.net/miniprogram/image/shareFriend2.png",
    ]).then((res) => {
      const { path } = res[0];
      _this.setState(
        {
          shareFile: path,
        },
        async () => {
          const context = Taro.createCanvasContext("imgCard", this);
          const width = (750 / 750) * Taro.getSystemInfoSync().windowWidth;
          const height = (1690 / 750) * Taro.getSystemInfoSync().windowWidth;
          const codeStyle = (200 / 750) * Taro.getSystemInfoSync().windowWidth;
          const codeTop = (1230 / 750) * Taro.getSystemInfoSync().windowWidth;
          const codeLeft = (275 / 750) * Taro.getSystemInfoSync().windowWidth;
          const fontLeft = (245 / 750) * Taro.getSystemInfoSync().windowWidth;
          const fontTop = (1483 / 750) * Taro.getSystemInfoSync().windowWidth;
          console.log(width, height);
          context.drawImage(_this.state.shareFile, 0, 0, width, height);
          context.setFillStyle("#FFFFFF");
          context.setFontSize(12);
          context.fillText(`${username} 邀请你加入哒卡乐!`, fontLeft, fontTop);
          context.drawImage(
            _this.state.codeUrl,
            codeLeft,
            codeTop,
            codeStyle,
            codeStyle,
            0,
            0
          );
          context.draw(false, () => {
            Taro.canvasToTempFilePath({
              canvasId: "imgCard",
              success: function (res) {
                const { tempFilePath } = res;
                authPhotosAlbum(tempFilePath);
              },
              fail: (res1) => {
                toast("图片生成失败");
              },
            });
          });
        }
      );
    });
  }
  setImg = () => {
    if (!this.state.showCanvas) {
      this.setState(
        {
          showCanvas: true,
        },
        (res) => {
          this.createImg();
        }
      );
    } else {
      this.createImg();
    }
  };
  componentDidShow() {
    this.getActiveInfo();
  }
  render() {
    const { showCanvas } = this.state;
    const {
      userInfo: { username, profile },
    } = this.props.store.authStore;
    return (
      <View className="share_box">
        {showCanvas && (
          <View className="img_layer">
            <Canvas
              className="imgCard"
              id="imgCard"
              canvas-id="imgCard"
            ></Canvas>
          </View>
        )}
        <View className="share_img_box">
          <View className="share_Canvas_padding">
            <Canvas
              id={this.state.canvasId}
              canvasId={this.state.canvasId}
              className="share_Canvas"
            ></Canvas>
          </View>

          <View className="share_font">{username + "  邀请你加入哒卡乐"}</View>
        </View>
        <View className="share_wx" onClick={this.setImg}>
          <View className="share_wx_icon"></View>
          <View className="share_wx_font">点击保存分享图片</View>
        </View>
      </View>
    );
  }
}
export default Record;
