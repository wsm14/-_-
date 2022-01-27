import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classnames";
import { fetchRightGoods, fetchRightCoupon } from "@/server/index";
import {
  prefectrueGoodsTemplate,
  prefectrueCouponTemplate,
} from "@/components/public_ui/specalTemplate";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      selectIndex: "0",
      ownerCouponList: [],
      specialGoodsList: [],
      changeObj: {
        0: "specialGoodsList",
        1: "ownerCouponList",
      },
      ownerHttp: {
        page: 1,
        limit: 10,
      },
      selectHttp: {
        page: 1,
        limit: 10,
      },
    };
  }
  componentDidMount() {
    this.changeList("owner");
    this.changeList("goods");
  }
  selectChange(e) {
    const { selectIndex } = this.state;
    if (selectIndex === e) {
      return;
    } else {
      this.setState({
        selectIndex: e,
      });
    }
  }
  changeList(t) {
    const { ownerHttp, selectHttp } = this.state;
    if (t !== "owner") {
      fetchRightGoods(selectHttp).then((val) => {
        const { specialGoodsList } = val;
        this.setState({
          specialGoodsList: [
            ...this.state.specialGoodsList,
            ...specialGoodsList,
          ],
        });
      });
    } else {
      fetchRightCoupon(ownerHttp).then((val) => {
        const { ownerCouponList } = val;
        this.setState({
          ownerCouponList: [...this.state.ownerCouponList, ...ownerCouponList],
        });
      });
    }
  }
  onReachBottom() {
    const { selectIndex, ownerHttp, selectHttp } = this.state;
    if (selectIndex === "1") {
      this.setState(
        { ownerHttp: { ...ownerHttp, page: ownerHttp.page + 1 } },
        (res) => {
          this.changeList("owner");
        }
      );
    } else {
      this.setState(
        { selectHttp: { ...selectHttp, page: selectHttp.page + 1 } },
        (res) => {
          this.changeList("goods");
        }
      );
    }
  }
  render() {
    const { selectIndex, changeObj, ownerCouponList, specialGoodsList } =
      this.state;

    return (
      <View className="preChildTure_box">
        <View className="preChildTure_bg"></View>
        <View className="preChildTure_content">
          <View
            onClick={() => {}}
            className={classNames(
              "preChildTure_select_box",
              selectIndex === "0"
                ? "preChildTure_tabbar1"
                : "preChildTure_tabbar2"
            )}
          >
            <View
              className="preChildTure_select_left"
              onClick={() => this.selectChange("0")}
            ></View>
            <View
              className="preChildTure_select_right"
              onClick={() => this.selectChange("1")}
            ></View>
          </View>
          {this.state[changeObj[selectIndex]].length === 0 && (
            <View className="preChildTure_null_start">
              <View className="preChildTure_null_image"></View>
              <View className="preChildTure_null_desc">
                东西都被抢完啦，小豆正在紧急备货中
              </View>
            </View>
          )}
          <View
            className="preChildTure_content_top"
            style={
              selectIndex !== "0" ? { display: "none" } : { display: "block" }
            }
          >
            {specialGoodsList.map((item) => {
              return prefectrueGoodsTemplate(item);
            })}
          </View>
          <View
            className="preChildTure_content_top"
            style={
              selectIndex === "0" ? { display: "none" } : { display: "block" }
            }
          >
            {ownerCouponList.map((item) => {
              return prefectrueCouponTemplate(item);
            })}
          </View>
        </View>
        <View className="preChildTure_bg_logo">
          <Image
            className="preChildTure_image"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/image/icon799.png"
            }
          ></Image>
        </View>
      </View>
    );
  }
}
export default Index;
