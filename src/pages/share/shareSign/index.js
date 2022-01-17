import React, { Component } from "react";
import { View } from "@tarojs/components";
import { loginStatus } from "@/utils/utils";
import "./index.scss";
import Router from "@/utils/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }
  linkTo() {
    if (!loginStatus()) {
      Router({
        routerName: "login",
      });
    } else {
      const env =
        process.env.NODE_ENV === "development" ? "development" : "production";
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
  componentDidMount() {}
  render() {
    return (
      <View className="shareSign_box">
        <View className="shareSign_btn" onClick={this.linkTo.bind(this)}></View>
      </View>
    );
  }
}

export default Index;
