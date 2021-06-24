import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import { rssConfigData } from "./components/data";
import { getShareParamInfo, getShareInfo } from "@/server/common";
import {

} from "@/common/utils";
import Router from "@/common/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {

    };
  }
  componentWillMount() {

  }
  componentDidShow() {

  }



  onShareAppMessage(res) {

  }

  render() {
    const {


    } = this.state;

    return (
      <View className="userNewArtist_box">

      </View>
    );
  }
}

export default Index;
