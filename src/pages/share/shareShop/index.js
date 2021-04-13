import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { share } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import {WebView} from '@tarojs/components'
import "./index.scss";
import { navigateTo } from "@/common/utils";

class Record extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        shareType: "activity",
        subType: "inviteMerchant",
      },
      h5Url: "",
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
        this.setState({
          h5Url,
        });
      }
    );
  }

  componentDidShow() {
    this.getActiveInfo();
  }
  render() {
    const { h5Url } = this.state;
    if(h5Url)  {
      return <WebView src={h5Url} />;
    }
   else  return null
  }
}
export default Record;
