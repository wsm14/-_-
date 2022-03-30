import React, { Component, useState } from "react";
import { View, Text } from "@tarojs/components";
import { getUserBeanInfo } from "@/server/user";
import Toast from "@/components/public_ui/selectToast";
import router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
     
    };
  }
  componentDidShow() {}

  errorToast(e) {}
  render() {
    
    return (
      <View className="collageDetails_box">
         
      </View>
    );
  }
}

export default Index;
