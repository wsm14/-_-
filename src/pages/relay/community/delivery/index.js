import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Bottom from "./conponents/bottomAddress";
import EditAddress from "./conponents/editAddress";
import Template from "./conponents/template";
import {
  fakeCreateUserAddress,
  fetchAddressList,
  fakeRemoveAddress,
  fakeUpdateAddress,
} from "@/server/relay";
import "./index.scss";
import { toast } from "@/common/utils";
import { navigatePostBack } from "@/relay/common/hooks";

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      showAddress: false,
      userAddressList: [],
      selectIndex: getCurrentInstance().router.params.selectIndex || 0,
      defaultData: {},
      type: "edit",
    };
  }
  componentWillUnmount() {}
  componentDidMount() {}
  componentDidShow() {
    this.fetchAddress();
  }
  componentWillUnmount() {
    const { userAddressList, selectIndex } = this.state;
    navigatePostBack(userAddressList[selectIndex], false);
  }
  onChangeSelect() {
    this.setState({
      showAddress: true,
    });
  }
  //打开编辑框
  fakeRemove() {
    const { defaultData } = this.state;
    const { userAddressId } = defaultData;
    fakeRemoveAddress({ userAddressId }).then((val) => {
      toast("删除成功");
      this.setState(
        {
          showAddress: false,
          defaultData: {},
          type: "edit",
        },
        (res) => {
          this.fetchAddress();
        }
      );
    });
  }

  fakeUpDate(val) {
    const { defaultData } = this.state;
    const { userAddressId } = defaultData;
    fakeUpdateAddress({ ...val, userAddressId })
      .then((val) => {
        toast("修改成功");
        this.setState(
          {
            showAddress: false,
            defaultData: {},
            type: "edit",
          },
          (res) => {
            this.fetchAddress();
          }
        );
      })
      .catch((val) => {
        this.setState({
          showAddress: false,
          defaultData: {},
          type: "edit",
        });
      });
  }
  updateInfo(val) {
    this.setState(
      {
        type: "update",
        defaultData: val,
      },
      (res) => {
        this.onChangeSelect();
      }
    );
  }
  fakeAddress(data) {
    fakeCreateUserAddress(data)
      .then((val) => {
        toast("添加成功");
        this.setState(
          {
            showAddress: false,
          },
          (res) => {
            this.fetchAddress();
          }
        );
      })
      .catch((val) => {
        this.setState({
          showAddress: false,
        });
      });
  }
  //获取新增地址
  changeSelect(index) {
    const { selectIndex } = this.state;
    if (selectIndex !== index) {
      this.setState({
        selectIndex: index,
      });
    }
  }
  //选择地址
  fetchAddress() {
    fetchAddressList({}).then((val) => {
      const { userAddressList = [] } = val;
      this.setState({
        userAddressList,
      });
    });
  }
  //获取地址列表
  render() {
    const { showAddress, userAddressList, selectIndex, type, defaultData } =
      this.state;
    console.log(selectIndex);
    return (
      <View className="delivery_box">
        <EditAddress
          onSubmit={this.fakeAddress.bind(this)}
          onClose={() =>
            this.setState({
              showAddress: false,
              defaultData: {},
              type: "edit",
            })
          }
          fakeUpDate={this.fakeUpDate.bind(this)}
          fakeRemove={this.fakeRemove.bind(this)}
          show={showAddress}
          type={type}
          defaultData={defaultData}
        ></EditAddress>
        {userAddressList.map((item, index) => {
          return (
            <Template
              data={item}
              index={index}
              updateInfo
              selectIndex={selectIndex}
              changeSelect={this.changeSelect.bind(this)}
              updateInfo={this.updateInfo.bind(this)}
            ></Template>
          );
        })}

        <Bottom onChange={this.onChangeSelect.bind(this)}></Bottom>
      </View>
    );
  }
}

export default Index;
