import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, PickerView, WebView } from "@tarojs/components";
import { getLat, getLnt } from "@/utils/utils";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      link: getCurrentInstance().router.params.link,
      url: getCurrentInstance().router.params.url,
      title: getCurrentInstance().router.params.title,
    };
  }

  filterUrl() {
    const { url = "" } = this.state;
    const { token = "" } = Taro.getStorageSync("userInfo") || {};
    let str = "";
    str = url.replace(/\|/g, "=");
    str = str.replace(/\+/g, "&");
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
      getLnt();
    return str;
  }

  componentDidMount() {}
  render() {
    const { link } = this.state;
    console.log(link);
    return (
      <View className="record_box">
        <WebView src={`${link}?${this.filterUrl()}`} />
      </View>
    );
  }
}

export default Index;
