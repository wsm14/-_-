import React, { Component } from "react";
import Taro from "@tarojs/taro";
import { View } from "@tarojs/components";
import { index } from "@/api/api";
import { httpGet } from "@/api/newRequest";
import { toast, filterGoodsStatus } from "@/common/utils";
import Tabs from "@/components/tabs";
import Goods from "./components/goods";
import { goodsNullStatus } from "@/components/publicShopStyle";
import "./index.scss";
import { inject, observer } from "mobx-react";
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
      countStatus: true,
    };
  }

  setIndex(index) {
    const that = this;
    if (index != this.state.setting.current) {
      that.props.store.goodsStore.setNullList();
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

  componentDidMount() {
    // this.getOrder()
  }
  componentDidShow() {
    const {
      store: {
        goodsStore: { orderList },
      },
    } = this.props;
    console.log(orderList.length);
    if (orderList.length === 0) {
      this.getOrder();
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
    );
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
  }

  onReachBottom() {
    const { httpData, countStatus } = this.state;
    if (countStatus) {
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
    } else {
      toast("暂无数据");
    }
  } //上拉加载

  render() {
    const { setting } = this.state;
    const {
      store: {
        goodsStore: { orderList },
      },
    } = this.props;
    const tabStyle = {
      height: Taro.pxTransform(88),
      borderRadius: "0px 0px 20px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: "#FFFFFF",
      padding: `0 ${Taro.pxTransform(38)}`,
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
          style={tabStyle}
          {...setting}
        ></Tabs>
        {orderList.length === 0 ? (
          goodsNullStatus()
        ) : (
          <Goods pageDown={() => {}} list={orderList}></Goods>
        )}
      </View>
    );
  }
}

export default Index;
