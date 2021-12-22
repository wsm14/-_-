import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { resiApiKey } from "@/common/utils";
import { goBack, toast, getLat, getLnt } from "@/common/utils";

import { navigatePostBack } from "@/relay/common/hooks";
import {
  fakeCreateUserAddress,
  fetchAddressList,
  fakeRemoveAddress,
  fakeUpdateAddress,
} from "@/server/relay";
import { getRestapiAddress } from "@/server/common";
import Empty from "@/components/Empty";
import Bottom from "./conponents/bottomAddress";
import EditAddress from "./conponents/editAddress";
import Template from "./conponents/template";
import "./index.scss";

class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      showAddress: false,
      userAddressList: [],
      selectIndex: getCurrentInstance().router.params.blindType
        ? null
        : getCurrentInstance().router.params.selectIndex || 0,
      defaultData: {},
      type: "edit",
      mode: getCurrentInstance().router.params.mode,
      blindType: getCurrentInstance().router.params.blindType || 0, // 盲盒进入存在
    };
  }
  componentDidShow() {
    this.fetchAddress();
  }

  onChangeSelect(type) {
    if (type === "add" && getLnt()) {
      // 逆地理位置解析 获取用户当前所在地省市区
      getRestapiAddress(
        {
          location: `${getLnt()},${getLat()}`,
          key: resiApiKey,
        },
        (val) => {
          console.log(val, val.infocode, val.regeocode);
          const { addressComponent } = val.regeocode;
          const { adcode } = addressComponent;
          this.setState({
            defaultData: {
              lat: getLat(),
              lnt: getLnt(),
              districtCode: adcode,
              provinceCode: adcode.slice(0, 2),
              cityCode: adcode.slice(0, 4),
            },
          });
        }
      );
    }
    this.setState({
      showAddress: true,
    });
  }
  //打开编辑框
  fakeRemove() {
    const { defaultData } = this.state;
    const { userAddressId } = defaultData;
    const that = this;
    Taro.showModal({
      title: "温馨提示",
      confirmText: "确定",
      confirmColor: "#07c0c2",
      content: `确定要删除该地址吗？`,
      success: function (res) {
        if (res.confirm) {
          fakeRemoveAddress({ userAddressId }).then((val) => {
            toast("删除成功");
            that.setState(
              {
                showAddress: false,
                defaultData: {},
                type: "edit",
              },
              (res) => {
                that.fetchAddress();
              }
            );
          });
        }
      },
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
            defaultData: {},
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
        });
      });
  }
  //获取新增地址
  changeSelect(index) {
    const { mode, userAddressList, blindType } = this.state;
    if (mode == "select") {
      this.setState(
        {
          selectIndex: index,
        },
        (res) => {
          Taro.showModal({
            title: "选择收货地址后无法修改地址",
            confirmText: "确认选择",
            confirmColor: "#07c0c2",
            cancelText: "重新选择",
            content: `${userAddressList[index].address}`,
            success: function (res) {
              if (res.confirm) {
                if (blindType) {
                  fetchBindAddress({ blindBoxRewardId, userAddressId }).then(
                    (res) => {
                      goBack();
                    }
                  );
                  return;
                }
                console.log(userAddressList[index]);
                navigatePostBack({
                  ...getCurrentInstance().router.params,
                  userAddressId: userAddressList[index].userAddressId,
                });
              }
            },
          });
        }
      );
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
        <Empty
          show={userAddressList.length === 0}
          toast={"您还没有完善收货地址哦"}
          type={"error"}
        ></Empty>
        <Bottom onChange={this.onChangeSelect.bind(this)}></Bottom>
      </View>
    );
  }
}

export default Index;
