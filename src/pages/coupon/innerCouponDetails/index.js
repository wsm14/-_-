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
  onShareAppMessage(res) {
    let userInfo = loginStatus() || {};
    if (loginStatus()) {
      const { userIdString } = userInfo;
      if (res.from === "button") {
        return {
          title: weChatTitle || title,
          imageUrl: weChatImg || frontImage,
          path: `/pages/coupon/innerCouponDetails/index?shareUserId=${userIdString}&shareUserType=user`,
          complete: function () {
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/coupon/innerCouponDetails/index?shareUserId=${userIdString}&shareUserType=user`,
          complete: function () {
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      }
    } else {
      if (res.from === "button") {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/coupon/innerCouponDetails/index?`,
          complete: function () {
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      } else {
        return {
          title: title,
          imageUrl: frontImage,
          path: `/pages/coupon/innerCouponDetails/index?`,
          complete: function () {
            // 转发结束之后的回调（转发成不成功都会执行）
            console.log("---转发完成---");
          },
        };
      }
    }
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
