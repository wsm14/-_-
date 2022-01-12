import React, { useState, useEffect, useRef } from "react";
import { Canvas, Swiper, SwiperItem, Text, View } from "@tarojs/components";
import classNames from "classnames";
import { backgroundObj } from "@/utils/utils";
import drawQrcode from "weapp-qrcode";
import Taro from "@tarojs/taro";
import Router from "@/utils/router";
import Tag from "@/components/iconTag";
export default (props) => {
  const { data, fn, visible, beanLimit } = props;
  const [orderResult, setOrderResult] = useState({});
  const [current, setCurrent] = useState(0);
  const [list, setList] = useState([]);
  const qrwh = (304 / 750) * Taro.getSystemInfoSync().windowWidth;
  useEffect(() => {
    const { orderGoodsVerifications } = data;
    setOrderResult(data);
    if (orderGoodsVerifications && Array.isArray(orderGoodsVerifications)) {
      setList(orderGoodsVerifications);
    }
  }, [data]);
  const {
    goodsName,
    specialGoods = {},
    reduceCoupon = {},
    rightGoods = {},
    rightCoupon = {},
    beanFee,
    orderDesc = "",
    orderSn,
  } = orderResult;
  let objData = (orderDesc && JSON.parse(orderDesc)) || {};
  const { merchantImg } = objData;
  useEffect(() => {
    setTimeout(() => {
      list.forEach((item, index) => {
        const { verificationUrl } = item;
        if (item.status === "0") {
          drawQrcode({
            width: qrwh,
            height: qrwh,
            background: "#FFFFFF",
            canvasId: `canvas${index}`,
            text: verificationUrl,
          });
        }
      });
    }, 100);
  }, [list]);
  const setCode = () => {
    return (
      <View className="codeBox public_center">
        <Swiper
          current={current}
          onChange={(e) => {
            const {
              detail: { current },
            } = e;
            setCurrent(current);
          }}
          style={{ width: qrwh, height: qrwh }}
        >
          {list.map((item, index) => {
            return (
              <SwiperItem>
                {item.status === "1" ? (
                  <View
                    style={{ width: qrwh, height: qrwh }}
                    className="code_onloader bgCode public_center"
                  ></View>
                ) : (
                  <Canvas
                    id={"canvas" + index}
                    style={{
                      width: qrwh,
                      height: qrwh,
                      display: visible ? "none" : "block",
                    }}
                    canvasId={"canvas" + index}
                  ></Canvas>
                )}
              </SwiperItem>
            );
          })}
        </Swiper>
        <View
          onClick={() => onChangeLeft()}
          className="code_left codeLeft_icon codePosition"
        ></View>
        <View
          onClick={() => onChangeRight()}
          className="code_right codeLeft_right codePosition"
        ></View>
      </View>
    );
  };
  //核销码部分组件
  const onChangeLeft = () => {
    if (current === 0) {
      return setCurrent(list.length - 1);
    }
    return setCurrent(current - 1);
  };
  //核销码上一张
  const onChangeRight = () => {
    if (current === list.length - 1) {
      return setCurrent(0);
    }
    return setCurrent(current + 1);
  };
  //核销码下一张
  return (
    <View className="paySuccess_box">
      <View className="paySuccess_top_info">
        <View
          className="paySuccess_cover coupon_shop_icon"
          style={backgroundObj(merchantImg)}
        ></View>
        <View className="paySuccess_content">
          <View className="paySuccess_goodName font_hide">
            {specialGoods.goodsName ||
              reduceCoupon.goodsName ||
              rightGoods.goodsName ||
              rightCoupon.goodsName}
          </View>
          <View className="paySuccess_count">数量:{list.length}</View>
        </View>
      </View>

      {setCode()}
      {list.length > 0 && (
        <View
          style={
            list[current]["status"] === "1"
              ? { color: "#CCCCCC", textDecoration: "line-through" }
              : {}
          }
          className={classNames("color1 font24 code_num")}
        >
          券码：{list[current]["verificationCode"]}
        </View>
      )}
      <View className="public_center color1 font24 code_count">
        {current + 1 + "/" + list.length}{" "}
      </View>
      <View
        onClick={() => fn && fn()}
        className="public_center font24 color2 code_onRead"
      >
        <View className="onReadly_icon onReadly_iconBox"></View>
        如果券码不显示，点这里刷新
      </View>
      <View className="paySuccess_collect">
        <View
          className="paySuccess_collect_btnBox paySuccess_style1 public_center"
          onClick={() =>
            Router({
              routerName: "orderDetails",
              args: {
                orderSn: orderSn,
              },
            })
          }
        >
          查看订单
        </View>
        <View
          className="paySuccess_collect_btnBox paySuccess_style2  public_center"
          onClick={() => {
            Router({
              routerName: "nearVideo",
              args: {
                type: "goods",
              },
            });
          }}
        >
          立即捡豆
        </View>
      </View>
      {beanFee && (
        <View className="paySuccess_yd">
          <View className="paySuccess_yd_box">
            <View className="paySuccess_yd_icon"></View>
            <View className="paySuccess_yd_logo"></View>
            <View className="paySuccess_yd_bean">
              本单卡豆帮您节省{" "}
              <Text className="color3">
                ¥{(Number(beanFee) / 100).toFixed(2)}元
              </Text>
            </View>
          </View>
        </View>
      )}
      <View className="pay_goLiner"></View>
      <Tag
        className="paySuccess_yd_game"
        list={[
          {
            label: "签到赚豆",
            icon: "paySuccess_game_one",
            fn: () => {
              Router({
                routerName: "sign",
                type: "reLaunch",
              });
            },
          },
          {
            label: "免费领商品",
            icon: "paySuccess_game_two",
          },
          {
            label: "碎片大转盘",
            icon: "paySuccess_game_three",
          },
        ]}
      ></Tag>
      {/* //游戏tab栏 */}
      <View className="paySuccess_download public_auto">
        <View className="paySuccess_download_bean">
          打开哒卡乐APP 每天多领{beanLimit}卡豆
        </View>
        <View
          className="paySuccess_download_btn public_center"
          onClick={() =>
            Router({
              routerName: "download",
            })
          }
        >
          立即打开
        </View>
      </View>
    </View>
  );
};
