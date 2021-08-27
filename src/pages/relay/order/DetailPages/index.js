import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Title from "./components/title";
import Delivery from "./components/Delivery";
import GoodsCard from "./components/goodsCard";
import OrderCard from "./components/orderSnDetails";
import Collect from "./components/collectCard";
import { fetchOrderDetail } from "@/server/relay";
import { toast } from "@/common/utils";
import { navigatePostBack } from "@/relay/common/hooks";
import "./index.scss";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
      },
      orderInfo: {},
    };
  }
  componentWillUnmount() {}
  componentDidMount() {
    this.fetchOrderInfo();
  }
  fetchOrderInfo() {
    const { httpData } = this.state;
    fetchOrderDetail(httpData).then((val) => {
      const { orderInfo = {} } = val;
      this.setState({
        orderInfo,
      });
    });
  }
  render() {
    const {
      orderInfo,
      orderInfo: { status },
    } = this.state;
    return (
      <View className="order_detailsPage_box">
        <Title data={orderInfo}></Title>
        <Delivery data={orderInfo}></Delivery>
        <GoodsCard data={orderInfo}></GoodsCard>
        {status === "1"}
        <Collect></Collect>
        <OrderCard data={orderInfo}></OrderCard>
      </View>
    );
  }
}

export default Index;
