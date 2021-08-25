import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Bottom from "./conponents/bottomAddress";
import EditAddress from "./conponents/editAddress";
import Template from "./conponents/template";
import { fakeCreateUserAddress } from "@/server/relay";
import "./index.scss";
import { toast } from "@/common/utils";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      showAddress: false,
    };
  }
  componentWillUnmount() {}
  componentDidMount() {}
  onChangeSelect() {
    this.setState({
      showAddress: true,
    });
  }
  fakeAddress(data, callBack) {
    fakeCreateUserAddress(data)
      .then((val) => {
        toast("添加成功");
        this.setState(
          {
            showAddress: false,
          },
          (res) => {
            
          }
        );
      })
      .catch((val) => {
        this.setState({
          showAddress: false,
        });
      });
  }
  render() {
    const { showAddress } = this.state;
    return (
      <View className="delivery_box">
        <EditAddress
          onSubmit={this.fakeAddress.bind(this)}
          onClose={() => this.setState({ showAddress: false })}
          show={showAddress}
        ></EditAddress>
        <Template></Template>
        <Bottom onChange={this.onChangeSelect.bind(this)}></Bottom>
      </View>
    );
  }
}

export default Index;
