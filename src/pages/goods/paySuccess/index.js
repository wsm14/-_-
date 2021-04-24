import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { Text, View } from "@tarojs/components";
import { goods } from "@/api/api";
import { httpGet, httpPost } from "@/api/newRequest";
import "./index.scss";
import {
  toast,
  backgroundObj,
  filterActive,
  goBack,
  switchTab,
  filterGoods,
} from "@/common/utils";
import Title from "./components/goodsTitle";
import ShopCard from "./components/descriptionCard";
import Lovely from "@/components/lovely";
import CouponLovely from "@/components/couponLovely";
import Router from "@/common/router";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        orderSn: getCurrentInstance().router.params.orderSn,
      },
      orderResult: {},
    };
  }

  componentWillUnmount() {
    if (!getCurrentInstance().router.params.orderSn) {
      goBack();
    }
  }

  componentDidShow() {
    this.getOrderResult();
  }
  getOrderResult() {
    const { getOrderResult } = goods;
    httpGet(
      {
        data: this.state.httpData,
        url: getOrderResult,
      },
      (res) => {
        const { orderResult } = res;
        console.log(filterGoods(orderResult));
        this.setState({
          orderResult: filterGoods(orderResult),
        });
      }
    );
  }
  goGoodsDetails() {
    const {
      orderResult: { orderSn },
    } = this.state;
    Router({
      routerName: "kolShopGoods",
      args: {
        orderSn: orderSn,
      },
    });
  }
  onError(msg) {
    console.log(msg);
  }
  render() {
    const {
      orderResult,
      orderResult: { orderType },
    } = this.state;
    return (
      <View className="pay_details_payDetails">
        <Title></Title>
        <ShopCard
          fn={() => this.getOrderResult()}
          data={orderResult}
        ></ShopCard>

        <View className="pay_goGoods public_center">
          <View className="color8 font24">
            可在卡包和订单详情中查看
            {orderType === "specialGoods" ? "商品" : "券"}详细情况
          </View>
          <View
            className="pay_goods_btn color4 font28 public_center"
            onClick={() => this.goGoodsDetails()}
          >
            查看订单
          </View>
        </View>
        <View className="maybe_love">
          {orderType === "specialGoods" ? (
            <Lovely title={"小伙伴们还喜欢"}></Lovely>
          ) : (
            <CouponLovely title={"小伙伴们还喜欢"}></CouponLovely>
          )}
        </View>
      </View>
    );
  }
}

export default Index;
