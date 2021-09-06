import React, { PureComponent } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text, Video, ScrollView } from "@tarojs/components";
import { getUserMomentcheckNew, saveNewUserBean } from "@/server/share";
import { loginStatus, toast, fakeStorage } from "@/common/utils";
import { getGoodsByMerchantId } from "@/server/perimeter";
import Router from "@/common/router";
import classNames from "classnames";
import { ShopView } from "./components/view";
import Login from "./components/login";
import Top from "./components/top";
import evens from "@/common/evens";
import { getAuthStatus } from "@/common/authority";
import "./index.scss";
class Index extends PureComponent {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      goodList: [],
      bottomFlag: true,
      authFlag: false,
      newUserFlag: "1",
      newUserBean: 300,
    };
  }
  componentWillMount() {}
  componentDidMount() {
    this.fetchNearGoods();
    this.fetchMomentcheckNew();
  }
  componentDidShow() {}
  fetchMomentcheckNew() {
    getUserMomentcheckNew({
      newDeviceFlag: Taro.getStorageSync("newDeviceFlag") || "1",
    }).then((val) => {
      const { newUserFlag = "1", newUserBean = "300" } = val;
      this.setState(
        {
          newUserFlag,
          newUserBean,
        },
        (res) => {
          if (!loginStatus()) {
            this.setState({
              authFlag: true,
            });
          }
        }
      );
    });
  }
  fakeNewUserBean() {
    getAuthStatus({
      key: "location",
      success: (res) => {
        if (loginStatus()) {
          saveNewUserBean({}).then((val) => {
            this.setState({
              newUserFlag: "0",
            });
            fakeStorage("newUserFlag", "0");
          });
        } else {
          this.setState({
            authFlag: true,
          });
        }
      },
      fail: (res) => {
        evens.$emit("setLocation");
      },
    });
  }
  fetchNearGoods() {
    getGoodsByMerchantId({ page: 1, limit: 5 }, (res) => {
      const { specialGoodsList = [] } = res;
      this.setState(
        {
          goodList: specialGoodsList,
        },
        (res) => {
          Taro.stopPullDownRefresh();
        }
      );
    });
  }

  fetchLoad() {
    Router({
      routerName: "webView",
      args: {
        link: "https://mp.weixin.qq.com/s/cigoCWs94L4wT_T40fSOkw",
        title: "关注公众号",
      },
    });
  }
  onPullDownRefresh() {}
  onShareAppMessage(res) {}

  render() {
    const { goodList, bottomFlag, authFlag, newUserFlag, newUserBean } =
      this.state;
    const filterObject = (str) => {
      if (str) {
        return JSON.parse(str);
      } else {
        return {};
      }
    };
    return (
      <View className={classNames("userNewArtist_box")}>
        <Top
          saveBean={this.fakeNewUserBean.bind(this)}
          newUserFlag={newUserFlag}
          newUserBean={newUserBean}
        ></Top>
        <View className="shop_info">
          <View className="shop_info_title"></View>
          <View className="shop_info_pay">
            {goodList.map((item) => {
              return ShopView(item, "goods");
            })}
          </View>
        </View>
        <View
          className="shop_btn_Info public_center bold"
          onClick={() =>
            Router({
              routerName: "perimeter",
              type: "switchTab",
            })
          }
        >
          更多好物去逛逛
        </View>
        {bottomFlag && (
          <View className="shop_info_fixed">
            <View
              className="shop_info_close"
              onClick={() => this.setState({ bottomFlag: false })}
            ></View>
            <View className="shop_info_font">更多福利请关注哒卡乐公众号</View>
            <View className="shop_info_setBtn" onClick={() => this.fetchLoad()}>
              戳一下
            </View>
          </View>
        )}
        <Login
          stopVideo={() => {}}
          show={authFlag}
          close={() =>
            this.setState(
              {
                authFlag: false,
              },
              (res) => {}
            )
          }
        ></Login>
      </View>
    );
  }
}

export default Index;
