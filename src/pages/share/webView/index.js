import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, PickerView, WebView } from "@tarojs/components";

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      link: getCurrentInstance().router.params.link,
      url: getCurrentInstance().router.params.url,
      title: getCurrentInstance().router.params.title,
    };
  }
  setTitle() {
    const { title } = this.state;
    if (title) {
      Taro.setNavigationBarTitle({
        title: this.state.title,
      });
    }
  }
  filterUrl() {
    const { url = "" } = this.state;
    let str = "";
    str = url.replace(/\|/g, "=");
    str = str.replace(/\+/g, "&");
    return str;
  }

  componentDidMount() {
    console.log(getCurrentInstance().router.params);
    this.setTitle();
  }
  render() {
    const { link } = this.state;
    console.log();
    return (
      <View className="record_box">
        <WebView src={`${link}?${this.filterUrl()}`} />
      </View>
    );
  }
}

export default Index;
