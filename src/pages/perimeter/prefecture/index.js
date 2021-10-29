import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classnames";
import { fetchRightGoods, fetchRightCoupon } from "@/server/index";
import {
  prefectrueGoodsTemplate,
  prefectrueCouponTemplate,
} from "@/components/specalTemplate";
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
      <View className="prefecture_box">
        <View className="prefecture_bg_title">
          <Image
            className="prefecture_image"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/image/icon771.png"
            }
          ></Image>
        </View>
        <View className="prefecture_bg_desc">
          <Image
            className="prefecture_image"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/image/icon772.png"
            }
          ></Image>
        </View>
        <View className="prefecture_content">
          <View
            onClick={() => {}}
            className={classNames(
              "prefecture_select_box",
              selectIndex === "0" ? "prefecture_tabbar1" : "prefecture_tabbar2"
            )}
          >
            <View
              className="prefecture_select_left"
              onClick={() => this.selectChange("0")}
            ></View>
            <View
              className="prefecture_select_right"
              onClick={() => this.selectChange("1")}
            ></View>
          </View>
          {this.state[changeObj[selectIndex]].length === 0 && (
            <View className="prefecture_null_start">
              <View className="prefecture_null_image"></View>
              <View className="prefecture_null_desc">
                东西都被抢完啦，小豆正在紧急备货中
              </View>
            </View>
          )}
          <View
            className="prefecture_content_top"
            style={
              selectIndex !== "0" ? { display: "none" } : { display: "block" }
            }
          >
            {specialGoodsList.map((item) => {
              return prefectrueGoodsTemplate(item);
            })}
          </View>
          <View
            className="prefecture_content_top"
            style={
              selectIndex === "0" ? { display: "none" } : { display: "block" }
            }
          >
            {ownerCouponList.map((item) => {
              return prefectrueCouponTemplate(item);
            })}
          </View>
        </View>
        <View className="prefecture_bg_logo">
          <Image
            className="prefecture_image"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/active/8.8/active8_8_21.png"
            }
          ></Image>
        </View>
      </View>
    );
  }
}
export default Index;
