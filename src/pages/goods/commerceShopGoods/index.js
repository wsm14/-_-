import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import "./index.scss";
import Title from "./components/goodsTitle";
import ShopCard from "./components/descriptionCard";
import ShopDetails from "./components/goodsCard";
import BtnLayer from "./components/bottonBtn";
import StopBean from "@/components/stopBean";
import { getOrderDetails, deleteOrder, fakeUpdateOrder } from "@/server/goods";
import { toast, goBack } from "@/common/utils";
import { inject, observer } from "mobx-react";
@inject("store")
@observer
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        orderSn: getCurrentInstance().router.params.orderSn,
      },
      orderInfo: {},
      visible: false,
      closeVisible: false,
      configUserLevelInfo: {},
    };
  }

  componentDidShow() {
    this.getGoodsDetails();
  }

  closeSn() {
    this.setState(
      {
        closeVisible: false,
      },
      (res) => {
        fakeUpdateOrder({
          orderSn: getCurrentInstance().router.params.orderSn,
          status: "2",
        }).then((val) => {
          this.getGoodsDetails();
        });
      }
    );
  }

  getGoodsDetails() {
    const { httpData } = this.state;
    getOrderDetails(httpData, (res) => {
      this.setState({
        orderInfo: res,
      });
    });
  }

  deleteOrder() {
    const { httpData, orderInfo } = this.state;
    let that = this;
    this.setState(
      {
        visible: false,
      },
      (res) => {
        deleteOrder(httpData, (res) => {
          that.props.store.goodsStore.deleteList(orderInfo, "orderSn");
          goBack(() => toast("删除成功"));
        });
      }
    );
  }
  render() {
    const { orderInfo, visible, closeVisible } = this.state;
    if (Object.keys(orderInfo).length > 0) {
      return (
        <View className="commerce_details_goodsDetails">
          <Title data={orderInfo}></Title>
          <ShopCard data={orderInfo}></ShopCard>
          <View>
            <ShopDetails data={orderInfo}></ShopDetails>
          </View>

          <BtnLayer
            data={orderInfo}
            closeSn={() => this.setState({ closeVisible: true })}
            deleteSn={() => this.setState({ visible: true })}
          ></BtnLayer>

          {closeVisible && (
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
          {visible && (
            <StopBean
              content={"确认删除订单？"}
              cancel={() => {
                this.setState({ visible: false });
              }}
              canfirm={() => this.deleteOrder()}
              cancelText={"确认"}
              canfirmText={"取消"}
            ></StopBean>
          )}
        </View>
      );
    }
    return null;
  }
}

export default Index;
