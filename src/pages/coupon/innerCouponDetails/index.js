import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { fetchGiftPackDetail } from "@/server/user";
import Top from "./components/top";
import Content from "./components/content";
import InnerDesc from "./components/innerDesc";
import Submit from "./components/submit";
import { loginStatus } from "@/utils/utils";
import "./index.scss";
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      platformGiftId: getCurrentInstance().router.params.platformGiftId,
      platformGiftPackInfo: {},
    };
  }
  componentDidShow() {
    this.fetchPackDetail();
  }
  fetchPackDetail() {
    const { platformGiftId } = this.state;
    fetchGiftPackDetail({
      platformGiftId,
    }).then((val = {}) => {
      const { platformGiftPackInfo = {} } = val;
      this.setState({
        platformGiftPackInfo,
      });
    });
  }
  render() {
    const { platformGiftPackInfo } = this.state;
    return (
      <View className="innerCouponDetails_box">
        <Top data={platformGiftPackInfo}></Top>
        <Content data={platformGiftPackInfo}></Content>
        <InnerDesc data={platformGiftPackInfo}></InnerDesc>
        <Submit data={platformGiftPackInfo}></Submit>
      </View>
    );
  }
}

export default Index;
