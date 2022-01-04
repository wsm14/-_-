import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { loginStatus } from "@/utils/utils";
import Tabs from "@/components/tabs";
import Goods from "./components/goods";
import { inject, observer } from "mobx-react";
import { fetchOrderTotalBean, fetchOrderList } from "@/server/goods";
import Router from "@/utils/router";
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
  filterGoodsStatus = (status) => {
    switch (status) {
      case 0:
        return "";
      //全部订单
      case 1:
        return "0";
      //待支付
      case 2:
        return "1";
      //已支付
      case 3:
        return "6,2";
      //退款
    }
  };
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
            orderStatus: this.filterGoodsStatus(index),
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
  //切换订单类型
  getOrderTotalBean() {
    fetchOrderTotalBean().then((val) => {
      const { saveBean = "0" } = val;
      this.setState({
        saveBean,
      });
    });
  }
  //订单卡豆总量
  componentWillUnmount() {
    this.props.store.goodsStore.setNullList([]);
  }
  //退出订单页清除Model层数据
  componentDidMount() {
    const { defaultRouter } = getCurrentInstance().router.params;
    if (defaultRouter == 0) {
      this.getOrder();
    } else {
      this.setIndex(parseInt(defaultRouter));
    }

    if (loginStatus()) {
      this.getOrderTotalBean();
    }
  }
  getOrder() {
    const { httpData } = this.state;
    let that = this;
    fetchOrderList(httpData)
      .then((res) => {
        const { orderList } = res;
        Taro.stopPullDownRefresh();
        if (orderList && orderList.length > 0) {
          that.props.store.goodsStore.setOrderList(orderList);
        } else {
          this.setState(
            {
              countStatus: false,
            },
            (res) => {}
          );
        }
      })
      .catch((e) => {
        Taro.stopPullDownRefresh();
      });
  }
  //获取订单数据
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
  //下拉刷新
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
