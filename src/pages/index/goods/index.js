import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { index } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import { toast, filterGoodsStatus, loginStatus } from "@/common/utils";
import Tabs from "@/components/tabs";
import Goods from "./components/goods";
import { goodsNullStatus } from "@/components/publicShopStyle";
import { inject, observer } from "mobx-react";
import { fetchOrderTotalBean } from "@/server/goods";
import Router from "@/common/router";
import "./index.scss";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      setting: {
        tabList: ["全部订单", "待付款", "可使用", "退款/售后"],
        current: 0,
      },
      httpData: {
        page: 1,
        limit: 10,
        // orderType: 'kolGoods,scan'
      },
      saveBean: "0",
      countStatus: true,
    };
  }
  setIndex(index) {
    const that = this;
    if (index != this.state.setting.current) {
      that.props.store.goodsStore.setNullList();
      let closeType = "";
      if (index === 3) {
        closeType = "expiredRefund,manualRefund";
      }
      this.setState(
        {
          setting: {
            ...this.state.setting,
            current: index,
          },
          httpData: {
            ...this.state.httpData,
            page: 1,
            orderStatus: filterGoodsStatus(index),
            closeType,
          },
          countStatus: true,
        },
        (res) => {
          this.getOrder();
        }
      );
    }
    return;
  }
  getOrderTotalBean() {
    fetchOrderTotalBean().then((val) => {
      const { saveBean = "0" } = val;
      this.setState({
        saveBean,
      });
    });
  }
  componentDidShow() {
    const {
      store: {
        goodsStore: { orderList },
      },
    } = this.props;
    if (orderList.length === 0 && loginStatus()) {
      this.getOrder();
    }
    if (loginStatus()) {
      this.getOrderTotalBean();
    }
  }
  getOrder() {
    const { httpData } = this.state;
    let that = this;
    const {
      goods: { orderDetails },
    } = index;
    httpGet(
      {
        data: httpData,
        url: orderDetails,
      },
      (res) => {
        const { orderList } = res;
        Taro.stopPullDownRefresh();
        if (orderList && orderList.length > 0) {
          that.props.store.goodsStore.setOrderList(orderList);
        } else {
          this.setState(
            {
              countStatus: false,
            },
            (res) => {
              toast("暂无数据");
            }
          );
        }
      }
    ).catch((e) => {
      Taro.stopPullDownRefresh();
    });
  }
  errorToast(e) {
    this.setState({
      Toast: {
        status: "error",
        text: e,
        isOpened: true,
      },
    });
  }
  onPullDownRefresh() {
    let that = this;
    const { httpData } = this.state;
    if (loginStatus()) {
      Taro.stopPullDownRefresh();
      that.props.store.goodsStore.setNullList();
      this.setState(
        {
          httpData: {
            ...httpData,
            page: 1,
          },
        },
        (res) => {
          this.getOrder();
        }
      );
    } else {
      Router({
        routerName: "login",
      });
    }
  }
  onReachBottom() {
    const { httpData, countStatus } = this.state;
    this.setState(
      {
        httpData: {
          ...httpData,
          page: httpData.page + 1,
        },
      },
      (res) => {
        this.getOrder();
      }
    );
  } //上拉加载
  render() {
    const { setting, saveBean } = this.state;
    const { current } = setting;
    const {
      store: {
        goodsStore: { orderList },
      },
    } = this.props;

    const tabStyle = {
      height: Taro.pxTransform(88),
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#FFFFFF",
      padding: `0 ${Taro.pxTransform(48)}`,
      position: "fixed",
      left: 0,
      right: 0,
      top: 0,
      zIndex: 100,
    };
    return (
      <View className="goods_tabbar_box">
        <Tabs
          fn={this.setIndex.bind(this)}
          lineStyle={{
            background: "#07C0C2",
            width: Taro.pxTransform(40),
            height: Taro.pxTransform(4),
            borderRadius: Taro.pxTransform(2),
          }}
          fontStyle={{ color: "#07C0C2", fontSize: Taro.pxTransform(32) }}
          sizeStyle={{ fontSize: Taro.pxTransform(32), color: "#999999" }}
          style={tabStyle}
          {...setting}
        ></Tabs>
        {current === 0 && (
          <View className="goods_tags_box">
            <View className="goods_tags_icon"></View>
            <View className="goods_tags_title">卡豆累计为您节省</View>
            <View className="goods_tags_beanInfo">
              ¥{(saveBean / 100).toFixed(2)}
            </View>
          </View>
        )}
        {orderList.length === 0 ? (
          <View>
            <View className="goods_nullState_box"></View>
            <View className="goods_nullState_toast">您还没有下单</View>
            <View
              className="goods_nullState_btn public_center"
              onClick={() => Router({ routerName: "specialOffer" })}
            >
              去下单
            </View>
          </View>
        ) : (
          <Goods pageDown={() => {}} list={orderList}></Goods>
        )}
      </View>
    );
  }
}

export default Index;
