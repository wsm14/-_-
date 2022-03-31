import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import { fetchRightGoods, fetchRightCoupon } from "@/server/index";
import { fetchCommerceGoods, fetchSelfTourGoods } from "@/server/perimeter";
import {
  prefectrueGoodsTemplate,
  prefectrueCouponTemplate,
  commerGoodsTemplate,
  template,
} from "@/components/public_ui/specalTemplate";
import { fetchUserShareCommission } from "@/server/common";
import Router from "@/utils/router";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      selectIndex: "0",
      ownerCouponList: [],
      //权益券列表
      specialGoodsList: [],
      //权益商品列表
      selfList: [],
      //周边游玩列表
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
      payBeanCommission: getCurrentInstance().router.params.payBeanCommission,
      identification: getCurrentInstance().router.params.identification,
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
    const { payBeanCommission } = this.state;
    if (payBeanCommission) {
      this.setState({
        configUserLevelInfo: {
          payBeanCommission,
        },
      });
    } else {
      fetchUserShareCommission({}, (res) => {
        const { configUserLevelInfo = {} } = res;
        this.setState({
          configUserLevelInfo,
        });
      });
    }
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
      payBeanCommission,
      identification,
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
                    args: {
                      payBeanCommission,
                      identification,
                    },
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
                    return prefectrueCouponTemplate({
                      ...item,
                      payBeanCommission,
                      identification,
                    });
                  } else {
                    return prefectrueGoodsTemplate({
                      ...item,
                      payBeanCommission,
                      identification,
                    });
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
                    args: {
                      payBeanCommission,
                      identification,
                    },
                  });
                }}
              >
                查看更多
              </View>
            </View>
            <View className="prefecture_content_top">
              {selfList.map((item, index) => {
                if (index < 2) {
                  return template(
                    { ...item, payBeanCommission, identification },
                    configUserLevelInfo,
                    true,
                    false
                  );
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
                    args: {
                      payBeanCommission,
                      identification,
                    },
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
                    return template(
                      { ...item, payBeanCommission, identification },
                      configUserLevelInfo,
                      true,
                      false
                    );
                  } else {
                    return commerGoodsTemplate(
                      { ...item, payBeanCommission, identification },
                      configUserLevelInfo
                    );
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
