import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import {
  fakeCreateUserAddress,
  fetchAddressList,
  fakeRemoveAddress,
  fakeUpdateAddress,
} from "@/server/relay";
import "./index.scss";
import { toast } from "@/common/utils";
import { navigatePostBack } from "@/relay/common/hooks";
import classNames from "classnames";
import evens from "@/common/evens";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      id: "",
    };
  }
  componentWillUnmount() {}
  componentDidMount() {}
  componentDidShow() {
    this.fetchAddress();
  }
  componentWillUnmount() {
    evens.$on("setCabinetId", this.state.id);
  }

  //获取地址列表
  render() {
    const { id } = this.state;
    const template = () => {};
    return (
      <View className="cabinet_box">
        <View className="cabinet_template_box">
          <View className="cabinet_template_address">
            <Text className="font28 color1">国泰科技大厦</Text>
            <Text className="font24 color2">｜22m</Text>
          </View>
          <View className="cabinet_template_xxaddress color2 font24">
            浙江省杭州市萧山区宁卫街道萧山区宁卫街道萧山区宁卫街道萧山区宁卫街道78号
          </View>
          <View className="cabinet_template_set font24 color1">
            联系人：刘 187****6767
          </View>
          <View
            className={classNames(
              "cabinet_template_checkBox",
              id === 1 ? "cabinet_template_check" : "cabinet_template_noCheck"
            )}
          ></View>
        </View>
      </View>
    );
  }
}

export default Index;
