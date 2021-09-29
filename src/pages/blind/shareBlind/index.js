import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.scss";
import { toast } from "@/common/utils";
class Index extends Component {
  defaultProps = {};
  constructor() {
    super(...arguments);
    this.state = {};
  }

  render() {
    return (
      <View className="shareBlind_box">
        <View className="shareBlind_content">
          <View className="shareBlind_profile">
            <Image></Image>
          </View>
        </View>
      </View>
    );
  }
}
export default Index;
