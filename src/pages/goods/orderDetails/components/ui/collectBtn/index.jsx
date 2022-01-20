import React, { useEffect, useState } from "react";
import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { toast } from "@/utils/utils";
import StopBean from "@/components/public_ui/selectToast";
import { fakeUpdateOrder } from "@/server/goods";
import Router from "@/utils/router";
import "./index.scss";
export default (props) => {
  const { data, type = "collect", reload, deleteOrderSn } = props;
  const [deleteVisible, setDeleteVisible] = useState(false);
  const [upDateVisible, setUpdateVisible] = useState(false);
  const [closeVisible, setCloseVisible] = useState(false);
  const {
    ownerIdString,
    ownerCouponIdString,
    merchantIdString,
    activityIdString,
    orderType,
    orderSn,
    status,
  } = data;

  const getPay = () => {
    const { orderType } = data;
    Router({
      routerName: "pay",
      args: {
        orderSn,
        orderType,
      },
    });
  };
  const goSpeGoods = () => {
    if (
      orderType === "specialGoods" ||
      orderType === "rightGoods" ||
      orderType === "commerceGoods"
    ) {
      console.log(ownerIdString, ownerIdString);
      Router({
        routerName: "favourableDetails",
        args: {
          merchantId: ownerIdString,
          specialActivityId: activityIdString,
        },
      });
    } else {
      Router({
        routerName: "payCouponDetails",
        args: {
          merchantId: merchantIdString,
          ownerId: ownerIdString,
          ownerCouponId: ownerCouponIdString,
        },
      });
    }
  };
  const templateBtn =
    type === "collect"
      ? {
          0: (
            <View className="kolGoods_bottom_btn">
              <View
                className="kolGoods_submit color2"
                onClick={() => setCloseVisible(true)}
                style={{ marginRight: `${Taro.pxTransform(24)}` }}
              >
                取消订单
              </View>
              <View
                className="kolGoods_submit1 color4"
                onClick={() => getPay()}
              >
                去付款
              </View>
            </View>
          ),
          1: (
            <View className="kolGoods_bottom_btn" onClick={() => goSpeGoods()}>
              <View className="kolGoods_submit1 color4">再来一单</View>
            </View>
          ),
          2: (
            <View className="kolGoods_bottom_btn">
              <View
                className="kolGoods_submit color2"
                onClick={() => setDeleteVisible(true)}
                style={{ marginRight: `${Taro.pxTransform(24)}` }}
              >
                删除订单
              </View>
              <View
                className="kolGoods_submit1 color4"
                onClick={() => goSpeGoods()}
              >
                重新购买
              </View>
            </View>
          ),
          3: (
            <View className="kolGoods_bottom_btn">
              <View
                className="kolGoods_submit color2"
                onClick={() => setDeleteVisible(true)}
                style={{ marginRight: `${Taro.pxTransform(24)}` }}
              >
                删除订单
              </View>
              <View
                className="kolGoods_submit1 color4"
                onClick={() => goSpeGoods()}
              >
                再次购买
              </View>
            </View>
          ),
          6: (
            <View className="kolGoods_bottom_btn">
              <View
                className="kolGoods_submit color2"
                onClick={() => setUpdateVisible(true)}
              >
                取消申请
              </View>
            </View>
          ),
        }[status]
      : {
          remove: (
            <View className="goods_bottom_btnBox">
              <View className="goods_bottom_btn">
                <View
                  className="goods_submit color2"
                  onClick={() => setDeleteVisible(true)}
                >
                  删除订单
                </View>
              </View>
            </View>
          ),
          telephone: (
            <View className="goods_bottom_btnBox">
              <View className="goods_bottom_btn">
                <View
                  className="kolGoods_submit1 color4"
                  onClick={(e) => {
                    e.stopPropagation();
                    Taro.makePhoneCall({
                      phoneNumber: "400-800-5881",
                      fail: (res) => {
                        toast("团长暂未设置联系电话");
                      },
                      complete: (res) => {},
                    });
                  }}
                >
                  联系客服
                </View>
              </View>
            </View>
          ),
        }[type];
  if (templateBtn) {
    return (
      <>
        <View className="kolGoods_bottom_btnBox">{templateBtn}</View>
        {deleteVisible && (
          <StopBean
            content={"确认删除订单？"}
            cancel={() => {
              setDeleteVisible(false);
            }}
            canfirm={() =>
              setDeleteVisible(() => {
                deleteOrderSn();
                return false;
              })
            }
            cancelText={"确认"}
            canfirmText={"取消"}
          ></StopBean>
        )}
        {upDateVisible && (
          <StopBean
            content={"确认取消申请退款？"}
            cancel={() => {
              setUpdateVisible(false);
            }}
            canfirm={() =>
              setUpdateVisible(() => {
                fakeUpdateOrder({
                  orderSn: orderSn,
                  status: "1",
                }).then((val) => {
                  reload();
                });
                return false;
              })
            }
            cancelText={"确认"}
            canfirmText={"取消"}
          ></StopBean>
        )}

        {status === "0" && closeVisible && (
          <StopBean
            content={"确认关闭订单?"}
            cancel={() => {
              setCloseVisible(false);
            }}
            canfirm={() =>
              setCloseVisible(() => {
                fakeUpdateOrder({
                  orderSn: orderSn,
                  status: "2",
                }).then((val) => {
                  reload();
                });
                return false;
              })
            }
            cancelText={"确认"}
            canfirmText={"取消"}
          ></StopBean>
        )}
      </>
    );
  } else return null;
};
