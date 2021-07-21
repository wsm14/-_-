import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { ScrollView, Text, View, Video } from "@tarojs/components";

import { wxapiGet, perimeter } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import InterFace from "./components/interface";
import { inject, observer } from "mobx-react";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  //猜你喜欢
  render() {
    const { login } = this.props.store.authStore;
    return <InterFace auth={login}></InterFace>;
  }
}

export default Index;
