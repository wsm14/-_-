import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import classNames from "classnames";
import { GOODS_BY_TYPE } from "@/relay/common/constant";
import { fetchCommunityOrder } from "@/server/relay";
import "./index.scss";
import { backgroundObj } from "@/common/utils";
class Index extends Component {
  constructor() {
    super(...arguments);
    this.state = {
      httpData: {
        ...getCurrentInstance().router.params,
        page: 1,
        limit: 10,
        status: 1,
      },
      orderList: [],
      verification: null,
    };
  }
  componentWillUnmount() {}
  componentDidMount() {
    this.fetchList();
  }
  fetchList() {
    const { httpData } = this.state;
    fetchCommunityOrder(httpData).then((val) => {
      const { orderList = [] } = val;
      this.setState({
        orderList: [...this.state.orderList, ...orderList],
      });
    });
  }
  onReachBottom() {
    this.setState(
      {
        httpData: {
          ...this.state.httpData,
          page: this.state.httpData.page + 1,
        },
      },
      (res) => {
        this.fetchList();
      }
    );
  } //上拉加载
  render() {
    const { orderList, verification } = this.state;
    const orderTitle = {
      0: <View className="color3">待支付</View>,
      1: <View className="color4">已支付</View>,
      2: <View className="color2">已关闭</View>,
      3: <View className="color2">已完成</View>,
    };
    const template = (item) => {
      const {
        beanFee,
        createTime,
        orderSn,
        organizationGoodsOrderDescObject = {},
        payTime,
        status,
        totalFee,
        userIdString,
        payFee,
      } = item;
      const {
        communityOrganizationGoodsId,
        communityOrganizationId,
        goodsCount,
        goodsImg,
        goodsName,
        goodsPrice,
        logisticsType,
        ownerId,
        relateOwnerProfile,
        useEndTime,
        writeAddress,
        writeContactPerson,
        writeMobile,
        remark = "",
      } = organizationGoodsOrderDescObject;

      return (
        <View className="GroupVerification_template_box">
          <View className="GroupVerification_template_top  public_auto">
            <View className="GroupVerification_template_left">
              <View className="GroupVerification_template_count">跟团号：</View>
              <View className="GroupVerification_template_num">
                {goodsCount}
              </View>
            </View>
            <View className="GroupVerification_template_right">
              <View className="GroupVerification_template_status">
                {orderTitle[status]}
              </View>
              <View
                className={classNames(
                  "GroupVerification_template_checkBox",
                  verification === item.orderSn
                    ? ""
                    : "GroupVerification_template_noCheck"
                )}
              ></View>
            </View>
          </View>
          <View className="GroupVerification_template_content">
            <View className="GroupVerification_content_top">
              <View
                className="GroupVerification_content_profile merchant_dakale_logo"
                style={backgroundObj(relateOwnerProfile)}
              ></View>
              <View className="GroupVerification_content_username font_hide">
                二狗烘焙（国泰科技)
              </View>
            </View>
            <View className="GroupVerification_content_goodsBox public_auto">
              <View className="GroupVerification_content_goodsleft font_hide">
                商品标题标题标题标题标题标题
              </View>
              <View className="GroupVerification_content_goodsright">
                查看 {">"}
              </View>
            </View>
            <View className="GroupVerification_content_liner"></View>
            <View className="GroupVerification_content_shop">
              <View className="GroupVerification_content_shop1">
                {goodsName}
              </View>
              <View className="GroupVerification_content_shop2">
                ×{goodsCount}
              </View>
              <View className="GroupVerification_content_shop3">
                ¥ {goodsPrice}
              </View>
            </View>
            <View className="GroupVerification_content_price">
              <View className="GroupVerification_content_time">{payTime}</View>
              <View>
                <Text className="font20 color2">共{goodsCount}件</Text>
                <Text className="font28 color1 price_margin8">实收</Text>
                <Text className="font28 color3 price_margin8">¥ {payFee}</Text>
              </View>
            </View>
            <View className="GroupVerification_order_cardUser">
              <View className="GroupVerification_cardUser_title">
                {GOODS_BY_TYPE[logisticsType]}
              </View>
              <View className="GroupVerification_cardUser_content">
                {logisticsType === "self" && (
                  <View>
                    {" "}
                    <View className="GroupVerification_cardUser_meAddress">
                      <View className="GroupVerification_cardUser_meAddressMax font_hide">
                        <Text>自提点：</Text>
                        <Text className="bold">国泰科技大厦</Text>
                      </View>
                    </View>
                  </View>
                )}
                <View className="GroupVerification_cardUser_userDetails">
                  <View className="GroupVerification_cardUser_meAddressMax font_hide">
                    <Text className="color1">{writeContactPerson + " "}</Text>
                    <Text className="color2">{writeMobile}</Text>
                  </View>
                </View>
                <View className="GroupVerification_cardUser_userAddress">
                  {writeAddress}
                </View>
                {remark && (
                  <View className="GroupVerification_cardUser_remark">
                    <View className="GroupVerification_cardUser_remakeMax font_hide">
                      <Text className="color1">团员备注: </Text>
                      <Text className="color3">{remark}</Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      );
    };
    return (
      <View className="GroupVerification_box">
        {orderList.length === 0 && (
          <View className="GroupVerification_null_bg">
            <View className="GroupVerification_null_image"></View>
            <View className="GroupVerification_null_font">
              暂无待提货订单～
            </View>
          </View>
        )}

        {orderList.length > 0 && (
          <View className="GroupVerification_init_box">
            {orderList.map((item) => template(item))}
            <View className="GroupVerification_init_btn">
              <View className="GroupVerification_init_vtnView public_center">
                请选择本次核销的商品
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
