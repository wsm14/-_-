import React, { PureComponent } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { View } from "@tarojs/components";

import "./index.scss";
import { getLat, getLnt, GetDistance } from "@/common/utils";

class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {};
  }

  componentDidShow() {}

  render() {
    const template = (item) => {
      const { lat, lnt } = item;
      return (
        <View className="groupMerchant_list">
          <View className="groupMerchant_list_box">
            <View className="groupMerchant_list_cover dakale_nullImage"></View>
            <View className="groupMerchant_list_user">
              <View className="groupMerchant_list_userTitle">
                <View className="groupMerchant_list_userName color1 font28 bold">
                  盒马鲜生（123店)
                </View>
              </View>
              <View className="groupMerchant_list_userAddress font24  color2">
                萧山区宁围街道国泰科技大厦
              </View>
            </View>
            <View className="groupMerchant_list_map"></View>
            <View className="groupMerchant_list_limit">
              {" "}
              {"距你" + GetDistance(getLat(), getLnt(), lat || 0, lnt || 0)}
            </View>
          </View>
        </View>
      );
    };
    return (
      <View className="groupMerchant_box">
        <View style={{ paddingBottom: Taro.pxTransform(24) }}>
          {/* <View></View> */}
          {template({})}
        </View>
      </View>
    );
  }
}

export default Index;
