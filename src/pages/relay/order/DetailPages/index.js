import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Title from "./components/title";
import Delivery from "./components/Delivery";
import GoodsCard from "./components/goodsCard";
import OrderCard from "./components/orderSnDetails";
import Collect from "./components/collectCard";
import { fetchOrderDetail } from "@/server/relay";
import StopBean from "@/components/stopBean";
import { goods } from "@/api/api";
import { httpGet, httpPost } from "@/api/newRequest";
import PayGo from "@/components/pay_btn";
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
      closeVisible: false,
    };
  }
  componentWillUnmount() {}
  componentDidMount() {
    this.fetchOrderInfo();
  }

  closeSn() {
    const { updateKol } = goods;
    const { httpData } = this.state;
    this.setState(
      {
        closeVisible: false,
      },
      (res) => {
        httpPost(
          {
            data: {
              orderSn: httpData.orderSn,
              status: "2",
            },
            url: updateKol,
          },
          (res) => {
            this.fetchOrderInfo();
          }
        );
      }
    );
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
      orderInfo: { status, payFee },
      closeVisible,
    } = this.state;
    return (
      <View className="order_detailsPage_box">
        <Title data={orderInfo}></Title>
        <Delivery data={orderInfo}></Delivery>
        <GoodsCard data={orderInfo}></GoodsCard>
        {status === "1" && <Collect></Collect>}
        <OrderCard data={orderInfo}></OrderCard>
        {status === "0" && (
          <View
            className="detailPges_order_close public_center"
            onClick={() =>
              this.setState({
                closeVisible: true,
              })
            }
          >
            关闭订单
          </View>
        )}
        {status === "0" && (
          <PayGo content={`立即支付 ￥${payFee}`} click={() => {}}></PayGo>
        )}
        {status === "0" && closeVisible && (
          <StopBean
            content={"确认关闭订单?"}
            cancel={() => {
              this.setState({ closeVisible: false });
            }}
            canfirm={() => this.closeSn()}
            cancelText={"确认"}
            canfirmText={"取消"}
          ></StopBean>
        )}
      </View>
    );
  }
}

export default Index;
