import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import Title from "./components/title";
import Delivery from "./components/Delivery";
import GoodsCard from "./components/goodsCard";
import OrderCard from "./components/orderSnDetails";
import Collect from "./components/collectCard";
import { fetchOrderDetail, fetchCommunityOrderQcode } from "@/server/relay";
import StopBean from "@/components/stopBean";
import { goods } from "@/api/api";
import { httpPost } from "@/api/newRequest";
import PayGo from "@/components/pay_btn";
import ShareInfo from "@/relay/components/shareInfo";
import { getShareInfo } from "@/server/common";
import { loginStatus } from "@/common/utils";
import { handlePayWechat } from "@/relay/common/hooks";
import { authWxLogin } from "@/common/authority";
import ImageShow from "@/relay/components/ImageShow";
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
      shareData: {},
      visible: false,
      verfivationVisible: false,
      verificationQcodeUrl: null,
    };
  }
  componentWillUnmount() {}
  componentDidMount() {
    this.fetchOrderInfo();
  }
  fetchShareInfo(val) {
    const { communityOrganizationId, ownerId } = val;
    if (!loginStatus()) {
      return Router({
        routerName: "login",
      });
    } else {
      getShareInfo(
        {
          shareType: "communityGoods",
          shareId: communityOrganizationId,
          shardingKey: ownerId,
        },
        (res) => {
          this.setState(
            {
              shareData: { ...res },
            },
            (res) => {
              this.setState({
                visible: true,
              });
            }
          );
        }
      );
    }
  }
  upDateStatus() {
    const { orderInfo } = this.state;
    this.setState({
      orderInfo: {
        ...orderInfo,
        status: "2",
        closeReason: "付款已超时，订单自动关闭",
      },
    });
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
  fetchOrderQcode() {
    const { orderInfo } = this.state;
    const { orderSn } = orderInfo;
    fetchCommunityOrderQcode({ orderSn }).then((val) => {
      const { verificationQcodeUrl } = val;
      this.setState(
        {
          verificationQcodeUrl: verificationQcodeUrl,
        },
        (res) => {
          this.setState({
            verfivationVisible: true,
          });
        }
      );
    });
  }
  onShareAppMessage(res) {
    const { shareData } = this.state;
    const { title, miniProgramUrl, frontImage } = shareData;
    if (res.from === "button") {
      return {
        title: title,
        path: miniProgramUrl,
        imageUrl: frontImage,
      };
    }
    return {
      title: title,
      imageUrl: frontImage,
      path: miniProgramUrl,
    };
  }
  render() {
    const {
      orderInfo,
      orderInfo: { status, payFee, orderSn },
      closeVisible,
      shareData,
      visible,
      verfivationVisible,
      verificationQcodeUrl,
    } = this.state;
    return (
      <View className="order_detailsPage_box">
        <Title
          upDateStatus={this.upDateStatus.bind(this)}
          data={orderInfo}
        ></Title>
        <Delivery data={orderInfo}></Delivery>
        <GoodsCard data={orderInfo}></GoodsCard>
        {status === "1" && (
          <Collect
            shareInfo={this.fetchShareInfo.bind(this)}
            data={orderInfo}
          ></Collect>
        )}
        <OrderCard
          fetchOrderQcode={this.fetchOrderQcode.bind(this)}
          data={orderInfo}
        ></OrderCard>
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
          <PayGo
            content={`立即支付 ￥${payFee}`}
            click={() => {
              authWxLogin((val) => {
                handlePayWechat(
                  { orderSn, payType: "wx_lite", wechatCode: val },
                  (res) => {
                    const { result_status } = res;
                    if (result_status === "succeeded") {
                      this.fetchOrderInfo();
                    }
                  }
                );
              });
            }}
          ></PayGo>
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
        <ShareInfo
          onClose={() => {
            this.setState({ visible: false });
          }}
          show={visible}
          data={shareData}
          bottomFlag
        ></ShareInfo>
        {verfivationVisible && (
          <View
            catchMove
            className="animated  fadeIn  order_verfation_infoBox"
            onClick={(e) => {
              e.stopPropagation();
              this.setState({
                verfivationVisible: false,
              });
            }}
          >
            <View
              className="order_verfation_box"
              onClick={(e) => e.stopPropagation()}
            >
              <View
                className="order_verfation_close"
                onClick={(e) => {
                  e.stopPropagation();
                  this.setState({
                    verfivationVisible: false,
                  });
                }}
              ></View>
              <View className="order_verfation_title">
                请出示给团长，进行扫码核销
              </View>
              <View className="order_verfation_code">
                <ImageShow width={192} src={verificationQcodeUrl}></ImageShow>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
