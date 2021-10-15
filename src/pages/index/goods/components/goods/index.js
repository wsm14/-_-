import React, { useEffect, useState } from "react";
import Taro from "@tarojs/taro";
import classNames from "classnames";
import { ScrollView, Text, View } from "@tarojs/components";
import InterTime from "@/components/InterTime";
import { filterPayStatus, backgroundObj, filterPayColor } from "@/common/utils";
import "./index.scss";
import { navigateTo } from "@/common/utils";
import Router from "@/common/router";

export default (props) => {
  const { list, pageDown } = props;
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(list);
  }, [list]);
  const updateStatus = (item) => {
    setData(
      data.map((val) => {
        if (val.orderSn === item.orderSn) {
          val.status = "2";
        }
        return val;
      })
    );
  };
  const createCouponGoods = (item) => {
    let {
      payFee,
      orderDesc = "",
      orderSn,
      orderType,
      status,
      closeType,
      createTime,
      beanFee,
    } = item;
    orderDesc = orderDesc && JSON.parse(orderDesc);
    const {
      reduceCoupon = {},
      ownerType,
      merchantIdString,
      ownerIdString,
      merchantName,
      ownerCouponIdString,
    } = orderDesc;
    const {
      goodsImg,
      goodsName,
      goodsCount,
      useEndTime,
      couponPrice,
      buyPrice,
      thresholdPrice,
    } = reduceCoupon;
    const createBottom = () => {
      return {
        0: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                待付款：
                <Text style={{ color: "rgba(51, 51, 51, 1)" }}>
                  {
                    <InterTime
                      fn={() => updateStatus(item)}
                      times={createTime}
                    ></InterTime>
                  }
                </Text>
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "pay",
                    args: {
                      orderSn: orderSn,
                      orderType: orderType,
                    },
                  })
                }
              >
                去付款
              </View>
            </View>
          </View>
        ),
        1: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                {beanFee > 0 && (
                  <View className="createdGood_details_order">
                    卡豆帮省{" "}
                    <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "kolShopGoods",
                    args: {
                      orderSn: orderSn,
                    },
                  })
                }
              >
                去使用
              </View>
            </View>
          </View>
        ),
        2: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left"></View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "payCouponDetails",
                    args: {
                      merchantId: merchantIdString,
                      ownerId: ownerIdString,
                      ownerCouponId: ownerCouponIdString,
                    },
                  })
                }
              >
                重新购买
              </View>
            </View>
          </View>
        ),
        3: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                {beanFee > 0 && (
                  <View className="createdGood_details_order">
                    卡豆帮省{" "}
                    <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "payCouponDetails",
                    args: {
                      merchantId: merchantIdString,
                      ownerId: ownerIdString,
                      ownerCouponId: ownerCouponIdString,
                    },
                  })
                }
              >
                再次购买
              </View>
            </View>
          </View>
        ),
        6: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left"></View>
              <View
                className="createGood_btn_right createGood_btn_color2"
                onClick={() =>
                  Router({
                    routerName: "kolShopGoods",
                    args: {
                      orderSn: orderSn,
                    },
                  })
                }
              >
                查看
              </View>
            </View>
          </View>
        ),
      }[status];
    };
    //按钮
    return (
      <View className="createGood_box">
        <View
          className="createGood_title"
          onClick={(e) => {
            e.stopPropagation();
            if (ownerType !== "group") {
              Router({
                routerName: "merchantDetails",
                args: {
                  merchantId: merchantIdString,
                },
              });
            } else {
              Router({
                routerName: "groupDetails",
                args: {
                  merchantGroupId: ownerIdString,
                },
              });
            }
          }}
        >
          <View className="createGood_title_box">
            <View className="createGood_iconCoupon"></View>
            <View className="createGood_merchantName font_hide">
              {merchantName}
            </View>
            <View className="createGood_merchantgo"></View>
            <View
              className={classNames(
                "createGood_status",
                filterPayColor(status)
              )}
            >
              {filterPayStatus(status, closeType)}
            </View>
          </View>
        </View>
        <View
          className="createGood_content"
          onClick={() =>
            Router({
              routerName: "kolShopGoods",
              args: {
                orderSn: orderSn,
              },
            })
          }
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image coupon_big_icon"
              style={{ ...backgroundObj(goodsImg) }}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title font_hide">
                {goodsName}
              </View>
              <View className="createdGood_details_num">
                面值{couponPrice} |{" "}
                {!thresholdPrice ? "无门槛" : `满${thresholdPrice}元可用`} |
                数量:
                {goodsCount}
              </View>
              <View className="createdGood_details_date">
                有效期至：{useEndTime}
              </View>
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥ </Text>
              <Text className="createdGood_details_priceFont2">{payFee}</Text>
            </View>
          </View>
        </View>
        {createBottom()}
      </View>
    );
  };
  const createCodeGoods = (item) => {
    let { payFee, orderDesc, orderSn, createTime, beanFee = "", status } = item;
    orderDesc = JSON.parse(orderDesc) || {};
    const { merchantName, merchantImg, merchantId, merchantIdString } =
      orderDesc;

    return (
      <View className="createGood_box">
        <View
          className="createGood_title"
          onClick={(e) => {
            e.stopPropagation();
            Router({
              routerName: "merchantDetails",
              args: {
                merchantId: merchantIdString,
              },
            });
          }}
        >
          <View className="createGood_title_box">
            <View className="createGood_iconBox createGood_bg1">扫码</View>
            <View className="createGood_merchantName font_hide">
              {merchantName}
            </View>
            <View className="createGood_merchantgo"></View>
            <View className="createGood_status status_color1">
              {" "}
              {filterPayStatus(status)}
            </View>
          </View>
        </View>
        <View
          className="createGood_content"
          onClick={() =>
            Router({
              routerName: "codeGoodDetails",
              args: {
                orderSn: orderSn,
              },
            })
          }
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image merchant_dakale_logo"
              style={merchantImg ? backgroundObj(merchantImg) : {}}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title bold font_hide">
                {merchantName}
              </View>
              <View className="createdGood_details_time">
                支付时间：{createTime}
              </View>
              {beanFee > 0 && (
                <View className="createdGood_details_color">
                  卡豆帮省{" "}
                  <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                </View>
              )}
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥</Text>
              <Text className="createdGood_details_priceFont2">
                {" " + payFee.split(".")[0]}
              </Text>
              <Text className="createdGood_details_priceFont3">
                {payFee.split(".")[1] && `.${payFee.split(".")[1]}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  //扫码支付渲染模板
  const createShopGoods = (item) => {
    let {
      payFee,
      orderDesc = "",
      orderSn,
      orderType,
      status,
      closeType,
      createTime,
      beanFee,
    } = item;
    orderDesc = orderDesc && JSON.parse(orderDesc);
    const {
      specialGoods = {},
      merchantName,
      merchantIdString,
      ownerIdString,
      ownerType,
    } = orderDesc;
    const { goodsImg, goodsName, goodsCount, activityIdString, useEndTime } =
      specialGoods;
    const createBottom = () => {
      return {
        0: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                待付款：
                <Text style={{ color: "rgba(51, 51, 51, 1)" }}>
                  {
                    <InterTime
                      fn={() => updateStatus(item)}
                      times={createTime}
                    ></InterTime>
                  }
                </Text>
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "pay",
                    args: {
                      orderSn: orderSn,
                      orderType: orderType,
                    },
                  })
                }
              >
                去付款
              </View>
            </View>
          </View>
        ),
        1: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                {beanFee > 0 && (
                  <View className="createdGood_details_order">
                    卡豆帮省{" "}
                    <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "kolShopGoods",
                    args: {
                      orderSn: orderSn,
                    },
                  })
                }
              >
                去使用
              </View>
            </View>
          </View>
        ),
        2: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left"></View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "favourableDetails",
                    args: {
                      merchantId: merchantIdString,
                      specialActivityId: activityIdString,
                    },
                  })
                }
              >
                重新购买
              </View>
            </View>
          </View>
        ),
        3: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                {beanFee > 0 && (
                  <View className="createdGood_details_order">
                    卡豆帮省{" "}
                    <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "favourableDetails",
                    args: {
                      merchantId: merchantIdString,
                      specialActivityId: activityIdString,
                    },
                  })
                }
              >
                再次购买
              </View>
            </View>
          </View>
        ),
        6: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left"></View>
              <View
                className="createGood_btn_right createGood_btn_color2"
                onClick={() =>
                  Router({
                    routerName: "kolShopGoods",
                    args: {
                      orderSn: orderSn,
                    },
                  })
                }
              >
                查看
              </View>
            </View>
          </View>
        ),
      }[status];
    };
    //按钮
    return (
      <View className="createGood_box">
        <View
          className="createGood_title"
          onClick={(e) => {
            e.stopPropagation();
            if (ownerType !== "group") {
              Router({
                routerName: "merchantDetails",
                args: {
                  merchantId: merchantIdString,
                },
              });
            } else {
              Router({
                routerName: "groupDetails",
                args: {
                  merchantGroupId: ownerIdString,
                },
              });
            }
          }}
        >
          <View className="createGood_title_box">
            <View className="createGood_iconBox createGood_bg2">商品</View>

            <View className="createGood_merchantName font_hide">
              {merchantName}
            </View>
            <View className="createGood_merchantgo"></View>
            <View
              className={classNames(
                "createGood_status",
                filterPayColor(status)
              )}
            >
              {filterPayStatus(status, closeType)}
            </View>
          </View>
        </View>
        <View
          className="createGood_content"
          onClick={() =>
            Router({
              routerName: "kolShopGoods",
              args: {
                orderSn: orderSn,
              },
            })
          }
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image dakale_nullImage"
              style={{ ...backgroundObj(goodsImg) }}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title font_hide">
                {goodsName}
              </View>
              <View className="createdGood_details_num">数量:{goodsCount}</View>
              <View className="createdGood_details_date">
                有效期至：{useEndTime}
              </View>
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥ </Text>
              <Text className="createdGood_details_priceFont2">{payFee}</Text>
            </View>
          </View>
        </View>
        {createBottom()}
      </View>
    );
  };
  const createVirtualProduct = (item) => {
    let {
      payFee,
      orderDesc,
      orderSn,
      createTime,
      beanFee = "",
      totalFee,
      status,
    } = item;
    orderDesc = JSON.parse(orderDesc) || {};
    const {
      virtualProductType,
      virtualProductImage,
      virtualProductName,
      virtualProductAccount,
    } = orderDesc;
    return (
      <View className="createGood_box">
        <View className="createGood_title">
          <View className="createGood_title_box">
            <View className="createGood_iconBox createGood_bg1">
              {virtualProductType === "phoneBill" ? "话费充值" : "会员充值"}
            </View>

            <View className="createGood_status status_color1">
              {" "}
              {filterPayStatus(status)}
            </View>
          </View>
        </View>
        <View
          className="createGood_content"
          onClick={() =>
            Router({
              routerName: "codeGoodDetails",
              args: {
                orderSn: orderSn,
              },
            })
          }
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image merchant_dakale_logo"
              style={backgroundObj(virtualProductImage)}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title bold font_hide">
                {totalFee + "元 " + virtualProductName}-{virtualProductAccount}
              </View>
              <View className="createdGood_details_time">
                支付时间：{createTime}
              </View>
              {beanFee > 0 && (
                <View className="createdGood_details_color">
                  卡豆帮省{" "}
                  <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                </View>
              )}
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥</Text>
              <Text className="createdGood_details_priceFont2">
                {" " + payFee.split(".")[0]}
              </Text>
              <Text className="createdGood_details_priceFont3">
                {payFee.split(".")[1] && `.${payFee.split(".")[1]}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };
  const createRightCoupon = (item) => {
    let {
      payFee,
      orderDesc = "",
      orderSn,
      orderType,
      status,
      closeType,
      createTime,
      beanFee,
    } = item;
    orderDesc = orderDesc && JSON.parse(orderDesc);
    const {
      rightCoupon = {},
      ownerType,
      merchantIdString,
      ownerIdString,
      merchantName,
      ownerCouponIdString,
      relateId,
      relateType,
    } = orderDesc;

    const {
      goodsImg,
      goodsName,
      goodsCount,
      useEndTime,
      couponPrice,
      buyPrice,
      thresholdPrice,
    } = rightCoupon;
    const createBottom = () => {
      return {
        0: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                待付款：
                <Text style={{ color: "rgba(51, 51, 51, 1)" }}>
                  {
                    <InterTime
                      fn={() => updateStatus(item)}
                      times={createTime}
                    ></InterTime>
                  }
                </Text>
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "pay",
                    args: {
                      orderSn: orderSn,
                      orderType: orderType,
                    },
                  })
                }
              >
                去付款
              </View>
            </View>
          </View>
        ),
        1: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                {beanFee > 0 && (
                  <View className="createdGood_details_order">
                    卡豆帮省{" "}
                    <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "kolShopGoods",
                    args: {
                      orderSn: orderSn,
                    },
                  })
                }
              >
                去使用
              </View>
            </View>
          </View>
        ),
        2: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left"></View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "payCouponDetails",
                    args: {
                      merchantId: merchantIdString,
                      ownerId: ownerIdString,
                      ownerCouponId: ownerCouponIdString,
                    },
                  })
                }
              >
                重新购买
              </View>
            </View>
          </View>
        ),
        3: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                {beanFee > 0 && (
                  <View className="createdGood_details_order">
                    卡豆帮省{" "}
                    <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "payCouponDetails",
                    args: {
                      merchantId: merchantIdString,
                      ownerId: ownerIdString,
                      ownerCouponId: ownerCouponIdString,
                    },
                  })
                }
              >
                再次购买
              </View>
            </View>
          </View>
        ),
        6: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left"></View>
              <View
                className="createGood_btn_right createGood_btn_color2"
                onClick={() =>
                  Router({
                    routerName: "kolShopGoods",
                    args: {
                      orderSn: orderSn,
                    },
                  })
                }
              >
                查看
              </View>
            </View>
          </View>
        ),
      }[status];
    };
    //按钮
    return (
      <View className="createGood_box">
        <View
          className="createGood_title"
          onClick={(e) => {
            e.stopPropagation();
            if (relateType !== "group") {
              Router({
                routerName: "merchantDetails",
                args: {
                  merchantId: relateId,
                },
              });
            } else {
              Router({
                routerName: "groupDetails",
                args: {
                  merchantGroupId: relateId,
                },
              });
            }
          }}
        >
          <View className="createGood_title_box">
            <View className="createGood_iconCoupon"></View>
            <View className="createGood_merchantName font_hide">
              {merchantName}
            </View>
            <View className="createGood_merchantgo"></View>
            <View
              className={classNames(
                "createGood_status",
                filterPayColor(status)
              )}
            >
              {filterPayStatus(status, closeType)}
            </View>
          </View>
        </View>
        <View
          className="createGood_content"
          onClick={() =>
            Router({
              routerName: "kolShopGoods",
              args: {
                orderSn: orderSn,
              },
            })
          }
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image coupon_big_icon"
              style={{ ...backgroundObj(goodsImg) }}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title font_hide">
                {goodsName}
              </View>
              <View className="createdGood_details_num">
                面值{couponPrice} |{" "}
                {!thresholdPrice ? "无门槛" : `满${thresholdPrice}元可用`} |
                数量:
                {goodsCount}
              </View>
              <View className="createdGood_details_date">
                有效期至：{useEndTime}
              </View>
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥ </Text>
              <Text className="createdGood_details_priceFont2">{payFee}</Text>
            </View>
          </View>
        </View>
        {createBottom()}
      </View>
    );
  };

  const createRightGoods = (item) => {
    let {
      payFee,
      orderDesc = "",
      orderSn,
      orderType,
      status,
      closeType,
      createTime,
      beanFee,
    } = item;
    orderDesc = orderDesc && JSON.parse(orderDesc);
    const {
      rightGoods = {},
      merchantName,
      merchantIdString,
      relateId,
      relateType,
    } = orderDesc;
    const { goodsImg, goodsName, goodsCount, activityIdString, useEndTime } =
      rightGoods;
    const createBottom = () => {
      return {
        0: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                待付款：
                <Text style={{ color: "rgba(51, 51, 51, 1)" }}>
                  {
                    <InterTime
                      fn={() => updateStatus(item)}
                      times={createTime}
                    ></InterTime>
                  }
                </Text>
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "pay",
                    args: {
                      orderSn: orderSn,
                      orderType: orderType,
                    },
                  })
                }
              >
                去付款
              </View>
            </View>
          </View>
        ),
        1: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                {beanFee > 0 && (
                  <View className="createdGood_details_order">
                    卡豆帮省{" "}
                    <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "kolShopGoods",
                    args: {
                      orderSn: orderSn,
                    },
                  })
                }
              >
                去使用
              </View>
            </View>
          </View>
        ),
        2: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left"></View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "favourableDetails",
                    args: {
                      merchantId: merchantIdString,
                      specialActivityId: activityIdString,
                    },
                  })
                }
              >
                重新购买
              </View>
            </View>
          </View>
        ),
        3: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left">
                {beanFee > 0 && (
                  <View className="createdGood_details_order">
                    卡豆帮省{" "}
                    <Text className="bold">¥{(beanFee / 100).toFixed(2)}</Text>
                  </View>
                )}
              </View>
              <View
                className="createGood_btn_right createGood_btn_color1"
                onClick={() =>
                  Router({
                    routerName: "favourableDetails",
                    args: {
                      merchantId: merchantIdString,
                      specialActivityId: activityIdString,
                    },
                  })
                }
              >
                再次购买
              </View>
            </View>
          </View>
        ),
        6: (
          <View className="createGood_bottom">
            <View className="createGood_btn_style">
              <View className="createGood_btn_left"></View>
              <View
                className="createGood_btn_right createGood_btn_color2"
                onClick={() =>
                  Router({
                    routerName: "kolShopGoods",
                    args: {
                      orderSn: orderSn,
                    },
                  })
                }
              >
                查看
              </View>
            </View>
          </View>
        ),
      }[status];
    };
    //按钮
    return (
      <View className="createGood_box">
        <View
          className="createGood_title"
          onClick={(e) => {
            e.stopPropagation();
            if (relateType !== "group") {
              Router({
                routerName: "merchantDetails",
                args: {
                  merchantId: relateId,
                },
              });
            } else {
              Router({
                routerName: "groupDetails",
                args: {
                  merchantGroupId: relateId,
                },
              });
            }
          }}
        >
          <View className="createGood_title_box">
            <View className="createGood_iconBox createGood_bg2">商品</View>

            <View className="createGood_merchantName font_hide">
              {merchantName}
            </View>
            <View className="createGood_merchantgo"></View>
            <View
              className={classNames(
                "createGood_status",
                filterPayColor(status)
              )}
            >
              {filterPayStatus(status, closeType)}
            </View>
          </View>
        </View>
        <View
          className="createGood_content"
          onClick={() =>
            Router({
              routerName: "kolShopGoods",
              args: {
                orderSn: orderSn,
              },
            })
          }
        >
          <View className="createdGood_details_box">
            <View
              className="createdGood_details_image dakale_nullImage"
              style={{ ...backgroundObj(goodsImg) }}
            ></View>
            <View className="createdGood_details_setting">
              <View className="createdGood_details_title font_hide">
                {goodsName}
              </View>
              <View className="createdGood_details_num">数量:{goodsCount}</View>
              <View className="createdGood_details_date">
                有效期至：{useEndTime}
              </View>
            </View>
            <View className="createdGood_details_price">
              <Text className="createdGood_details_priceFont1">¥ </Text>
              <Text className="createdGood_details_priceFont2">{payFee}</Text>
            </View>
          </View>
        </View>
        {createBottom()}
      </View>
    );
  };
  const templateObj = {
    scan: createCodeGoods,
    specialGoods: createShopGoods,
    reduceCoupon: createCouponGoods,
    virtualProduct: createVirtualProduct,
    rightCoupon: createRightCoupon,
    rightGoods: createRightGoods,
  };
  //订单支付渲染模板
  return (
    <ScrollView
      scrollY
      onScrollToLower={() => pageDown()}
      className="goodsView"
    >
      {data.map((item) => {
        const { orderType } = item;
        return templateObj[orderType] && templateObj[orderType](item);
      })}
    </ScrollView>
  );
};
