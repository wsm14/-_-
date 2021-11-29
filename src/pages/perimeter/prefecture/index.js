import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import classNames from "classnames";
import {
  fetchRightGoods,
  fetchRightCoupon,
  fetchSpecialGoods,
  fetchUserShareCommission,
} from "@/server/index";
import { fetchCommerceGoods, fetchSelfTourGoods } from "@/server/perimeter";
import {
  prefectrueGoodsTemplate,
  prefectrueCouponTemplate,
  commerGoodsTemplate,
  template,
} from "@/components/specalTemplate";
import Router from "@/common/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      selectIndex: "0",
      ownerCouponList: [],
      specialGoodsList: [],
      selfList: [],
      changeObj: {
        0: "specialGoodsList",
        1: "ownerCouponList",
      },
      ownerHttp: {
        page: 1,
        limit: 2,
      },
      selectHttp: {
        page: 1,
        limit: 2,
      },
      commerList: [],
      commerHttp: { page: 1, limit: 2 },
      configUserLevelInfo: {},
    };
  }
  componentDidMount() {
    this.changeList("owner");
    this.changeList("goods");
    this.fetchCommerceList();
    this.fetchSelfList();
    this.fetchUserShare();
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
  fetchUserShare() {
    fetchUserShareCommission({}, (res) => {
      const { configUserLevelInfo = {} } = res;
      this.setState({
        configUserLevelInfo,
      });
    });
  }
  fetchCommerceList() {
    fetchCommerceGoods(this.state.commerHttp).then((val) => {
      const { specialGoodsList } = val;
      this.setState({
        commerList: specialGoodsList,
      });
    });
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
  fetchSelfList() {
    fetchSelfTourGoods({}).then((val) => {
      const { selfTourGoodList = [] } = val;
      this.setState({
        selfList: selfTourGoodList,
      });
    });
  }
  render() {
    const {
      ownerCouponList,
      specialGoodsList,
      selfList,
      configUserLevelInfo,
      commerList,
    } = this.state;

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
        {[...ownerCouponList, ...specialGoodsList].length > 0 && (
          <View className="prefecture_content">
            <View className="prefecture_init_title public_auto">
              <View className="prefecture_title_info"></View>
              <View
                className="prefecture_title_right"
                onClick={() =>
                  Router({
                    routerName: "preChildTure",
                  })
                }
              >
                查看更多
              </View>
            </View>
            <View className="prefecture_content_top">
              {[...specialGoodsList, ...ownerCouponList].map((item, index) => {
                if (index < 2) {
                  const { couponType } = item;
                  if (couponType) {
                    return prefectrueCouponTemplate(item);
                  } else {
                    return prefectrueGoodsTemplate(item);
                  }
                } else {
                  return null;
                }
              })}
            </View>
          </View>
        )}

        {selfList.length > 0 && (
          <View className="prefecture_content prefecture_margin">
            <View className="prefecture_init_title public_auto">
              <View className="prefecture_title_info2"></View>
              <View
                className="prefecture_title_right"
                onClick={() => {
                  Router({
                    routerName: "preSelfour",
                  });
                }}
              >
                查看更多
              </View>
            </View>
            <View className="prefecture_content_top">
              {selfList.map((item, index) => {
                if (index < 2) {
                  return template(item, configUserLevelInfo, true, false);
                }
              })}
            </View>
          </View>
        )}

        {commerList.length > 0 && (
          <View className="prefecture_content prefecture_margin">
            <View className="prefecture_init_title public_auto">
              <View className="prefecture_title_info3"></View>
              <View
                className="prefecture_title_right"
                onClick={() => {
                  Router({
                    routerName: "commer",
                  });
                }}
              >
                查看更多
              </View>
            </View>
            <View className="prefecture_content_top">
              {commerList.map((item, index) => {
                const { paymentModeObject = {} } = item;
                const { type = "defaultMode" } = paymentModeObject;
                if (index < 2) {
                  if (type === "defaultMode") {
                    return template(item, configUserLevelInfo, true, false);
                  } else {
                    return commerGoodsTemplate(item, configUserLevelInfo);
                  }
                }
              })}
            </View>
          </View>
        )}
        <View className="prefecture_bg_logo">
          <Image
            className="prefecture_image"
            lazyLoad
            mode={"aspectFill"}
            src={
              "https://wechat-config.dakale.net/miniprogram/image/icon798.png"
            }
          ></Image>
        </View>
      </View>
    );
  }
}
export default Index;
