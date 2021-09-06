import React, { Component } from "react";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import { View, Image, Text } from "@tarojs/components";
import classNames from "classnames";
import { GOODS_BY_TYPE } from "@/relay/common/constant";
import {
  fetchCommunityOrder,
  fetchVerificationGoods,
  fetchCommunityGoods,
} from "@/server/relay";
import PayBean from "@/components/stopBean";
import { backgroundObj, toast } from "@/common/utils";
import { getShareInfo, getShareParamInfo } from "@/server/common";
import "./index.scss";
import Router from "@/common/router";
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
      index: 0,
      orderList: [],
      verification: {},
      visible: false,
    };
  }
  componentDidMount() {
    let { scene } = getCurrentInstance().router.params;
    let { httpData } = this.state;
    if (scene) {
      getShareParamInfo({ uniqueKey: scene }, (res) => {
        let {
          shareParamInfo: { param },
        } = res;
        if (param && JSON.parse(param)) {
          param = JSON.parse(param);
          this.setState(
            {
              httpData: { ...httpData, ...param },
            },
            (res) => {
              this.fetchList();
            }
          );
        }
      });
    } else {
      this.fetchList();
    }
  }

  componentDidShow() {
    const { index, orderList } = this.state;
    if (index !== 0 && orderList.length === 0) {
      this.fetchList();
    }
  }
  select(item) {
    const { verification } = this.state;
    const { orderSn } = verification;
    if (orderSn === item.orderSn) {
      this.setState({
        verification: {},
      });
    } else {
      this.setState({
        verification: { ...item },
      });
    }
  }
  changeItem(item, type = "add") {
    const { orderSn, userIdString, organizationGoodsOrderDescObject } = item;
    const { computedCount } = organizationGoodsOrderDescObject;
    fetchVerificationGoods({ orderSn, userId: userIdString }).then((val) => {
      const { count } = val;
      if (computedCount >= count && type !== "remove") {
        return toast("已达到最大数量");
      } else {
        if (type === "add") {
          this.setState({
            orderList: this.state.orderList.map((val) => {
              if (val.orderSn === orderSn) {
                return {
                  ...val,
                  organizationGoodsOrderDescObject: {
                    ...organizationGoodsOrderDescObject,
                    computedCount: computedCount + 1,
                  },
                };
              } else return val;
            }),
          });
        } else {
          if (computedCount > 1) {
            this.setState({
              orderList: this.state.orderList.map((val) => {
                if (val.orderSn === orderSn) {
                  return {
                    ...val,
                    organizationGoodsOrderDescObject: {
                      ...organizationGoodsOrderDescObject,
                      computedCount: computedCount - 1,
                    },
                  };
                } else {
                  return val;
                }
              }),
            });
          } else {
            toast("核销数量不能为0");
          }
        }
      }
    });
  }
  fetchList() {
    const { httpData } = this.state;
    fetchCommunityOrder(httpData).then((val) => {
      const { orderList = [] } = val;
      this.setState({
        index: 1,
        orderList: [
          ...this.state.orderList,
          ...orderList.map((item) => {
            const { organizationGoodsOrderDescObject = {} } = item;
            return {
              ...item,
              organizationGoodsOrderDescObject: {
                ...organizationGoodsOrderDescObject,
                computedCount: 1,
              },
            };
          }),
        ],
      });
    });
  }

  onToast() {
    this.setState({
      visible: true,
    });
  }
  onSubmit() {
    const { verification, httpData } = this.state;
    const { orderSn, userIdString, organizationGoodsOrderDescObject } =
      verification;
    if (orderSn && organizationGoodsOrderDescObject) {
      const { computedCount } = organizationGoodsOrderDescObject;
      fetchCommunityGoods({
        orderSn,
        userId: userIdString,
        verificationCount: computedCount,
      }).then((val) => {
        this.setState(
          {
            httpData: {
              ...httpData,
              page: 1,
              limit: 10,
            },
            visible: false,
            orderList: [],
          },
          (res) => {
            this.fetchList();
          }
        );
      });
    } else {
      toast("请选择核销商品");
    }
  }
  onVisible() {
    const { verification, httpData } = this.state;
    const { orderSn, userIdString, organizationGoodsOrderDescObject } =
      verification;
    if (orderSn && organizationGoodsOrderDescObject) {
      this.setState({
        visible: true,
      });
    } else {
      toast("请选择核销商品");
    }
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
    const { orderList, verification, visible } = this.state;
    const { organizationGoodsOrderDescObject = {} } = verification;
    const {
      relateOwnerProfile,
      goodsCount,
      goodsName,
      relateOwnerName,
      title,
      computedCount,
      organizationNumber,
    } = organizationGoodsOrderDescObject;
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
        computedCount,
        relateOwnerName,
        title,
        organizationNumber,
        liftingName,
      } = organizationGoodsOrderDescObject;

      return (
        <View className="GroupVerification_template_box">
          <View className="GroupVerification_template_top  public_auto">
            <View className="GroupVerification_template_left">
              <View className="GroupVerification_template_count">跟团号：</View>
              <View className="GroupVerification_template_num">
                {organizationNumber}
              </View>
            </View>
            <View className="GroupVerification_template_right">
              <View className="GroupVerification_template_status">
                {orderTitle[status]}
              </View>
            </View>
          </View>
          <View className="GroupVerification_template_content">
            <View className="GroupVerification_content_top">
              <View
                className="GroupVerification_content_profile merchant_dakale_logo"
                style={backgroundObj(relateOwnerProfile)}
              ></View>
              <View className="GroupVerification_content_username font_hide">
                {relateOwnerName}
              </View>
            </View>
            <View
              className="GroupVerification_content_goodsBox public_auto"
              onClick={() =>
                Router({
                  routerName: "communityGoods",
                  args: { communityOrganizationId, ownerId },
                })
              }
            >
              <View className="GroupVerification_content_goodsleft font_hide">
                {title}
              </View>
              <View className="GroupVerification_content_goodsright">
                查看 {">"}
              </View>
            </View>
            <View className="GroupVerification_content_liner"></View>
            <View className="GroupVerification_content_shop">
              <View
                onClick={() => this.select(item)}
                className="GroupVerification_shop_top"
              >
                <View
                  className={classNames(
                    "GroupVerification_template_checkBox",
                    verification.orderSn === item.orderSn
                      ? "GroupVerification_template_check"
                      : "GroupVerification_template_noCheck"
                  )}
                ></View>
                <View className="GroupVerification_shop_name font_hide">
                  {goodsName}
                </View>
                <View className="GroupVerification_shop_tags">
                  本次核销数量
                </View>
              </View>
              <View className="GroupVerification_shop_collection">
                <View className="GroupVerification_shop_collectCount">
                  ×{goodsCount}
                </View>
                <View className="GroupVerification_buyCard_collection">
                  <View
                    className="GroupVerification_buyCard_icon GroupVerification_buyCard_remove"
                    onClick={() => this.changeItem(item, "remove")}
                  ></View>
                  <View className="GroupVerification_buyCard_text">
                    {computedCount}
                  </View>
                  <View
                    className="GroupVerification_buyCard_icon GroupVerification_buyCard_add"
                    onClick={() => this.changeItem(item, "add")}
                  ></View>
                </View>
              </View>
              <View className="GroupVerification_shop_liner"></View>
              <View className="GroupVerification_shop_goods public_auto">
                <Text>商品总价</Text>
                <Text>{totalFee}</Text>
              </View>
            </View>
            <View className="GroupVerification_content_price">
              <View className="GroupVerification_content_time">{payTime}</View>
              <View>
                <Text className="font20 color2">已团{goodsCount}件</Text>
                <Text className="font28 color1 price_margin8">合计</Text>
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
                        <Text className="bold">{liftingName}</Text>
                      </View>
                    </View>
                  </View>
                )}
                <View className="GroupVerification_cardUser_userDetails">
                  <View
                    className="GroupVerification_cardUser_meAddressMax font_hide"
                    onClick={() => {
                      Taro.makePhoneCall({
                        phoneNumber: writeMobile,
                        fail: (res) => {
                          toast("团长暂未设置联系电话");
                        },
                        complete: (res) => {},
                      });
                    }}
                  >
                    <Text className="color1">{writeContactPerson + " "}</Text>
                    <Text className="color2">{writeMobile}</Text>
                  </View>
                </View>
                <View
                  className="GroupVerification_cardUser_userAddress"
                  onClick={() =>
                    Taro.setClipboardData({
                      data: writeAddress,
                      success: function (res) {
                        toast("已复制");
                      },
                      fail: function (res) {
                        toast("复制失败");
                      },
                    })
                  }
                >
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
        {visible && (
          <PayBean
            cancel={() =>
              this.setState({
                visible: false,
              })
            }
            visible={visible}
            canfirm={() => this.onSubmit()}
            canfirmText="取消"
            cancelText="确认核销"
          >
            <View className="GroupVerification_init_toast">
              <View className="GroupVerification_init_toastTop">
                <View className="GroupVerification_init_toastTopCount">
                  {organizationNumber}
                </View>
                <View
                  className="GroupVerification_init_toastTopProfile"
                  style={backgroundObj(relateOwnerProfile)}
                ></View>
                <View className="GroupVerification_init_toastTopName font_hide">
                  {relateOwnerName}
                </View>
              </View>
              <View className="GroupVerification_init_contents">
                <View className="GroupVerification_init_contentsName font_hide">
                  {goodsName}
                </View>
                <View className="GroupVerification_init_contentsgoodCount">
                  x{computedCount}
                </View>
              </View>
            </View>
          </PayBean>
        )}
        {orderList.length > 0 && (
          <View className="GroupVerification_init_box">
            {orderList.map((item) => template(item))}
            <View
              className="GroupVerification_init_btn"
              onClick={() => this.onVisible()}
            >
              <View className="GroupVerification_init_vtnView public_center">
                {Object.keys(verification).length === 0
                  ? "请选择本次核销的商品"
                  : "确认核销"}
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }
}

export default Index;
