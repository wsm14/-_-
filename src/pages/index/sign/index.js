import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, PickerView, WebView } from "@tarojs/components";
import {
  getLat,
  getLnt,
  fetchStorage,
  loginStatus,
  backgroundObj,
} from "@/common/utils";
import { getMainPage } from "@/server/user";
import Router from "@/common/router";
import Drawer from "@/components/Drawer";
let env = process.env.NODE_ENV === "development" ? "dev" : "dev";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      visible: false,
      visible1: false,
      link: `https://web-new.dakale.net/${env}/game/sign/index.html#/register?${this.filterUrl()}`,
      token: fetchStorage("userInfo").token,
    };
  }

  filterUrl() {
    const { token = "" } = Taro.getStorageSync("userInfo") || {};
    const { cityCode = 3301 } = fetchStorage("city") || {};
    let str = "";
    str =
      str +
      "&" +
      "token=" +
      token +
      "&" +
      "lat=" +
      getLat() +
      "&" +
      "lnt=" +
      getLnt() +
      "&" +
      "city_code=" +
      cityCode;
    return str;
  }
  getMainPage() {
    getMainPage({}, (res) => {
      const { userInfo } = res;
      if (!userInfo) {
        this.setState(
          {
            visible: false,
          },
          (res) => {
            this.setState({
              visible1: true,
            });
          }
        );
      } else {
        if (this.state.visible === false) {
          this.setState({
            visible: true,
            visible1: false,
            link: `https://web-new.dakale.net/${env}/game/sign/index.html#/register?${this.filterUrl()}`,
          });
        }
      }
    });
  }

  componentDidShow() {
    this.getMainPage();
  }
  render() {
    const { visible, link, visible1 } = this.state;
    return (
      <View>
        {visible1 && (
          <Drawer
            show={visible1}
            closeBtn={false}
            close={() => {
              this.setState({
                visible1: false,
              });
            }}
          >
            <View
              onClick={() => {
                Router({
                  routerName: "login",
                });
              }}
              style={{
                width: Taro.pxTransform(600),
                height: Taro.pxTransform(718),
                ...backgroundObj(
                  "https://wechat-config.dakale.net/miniprogram/game/game_drawer.png"
                ),
              }}
            ></View>
          </Drawer>
        )}
        {visible && <WebView src={link} />}
      </View>
    );
  }
}

export default Index;
